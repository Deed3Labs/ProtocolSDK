import * as deedNFT from './api/deedNFT';
import * as fundManager from './api/fundManager';
import * as validator from './api/validator';
import * as validatorRegistry from './api/validatorRegistry';
import * as metadataRenderer from './api/metadataRenderer';
import { ethers } from 'ethers';
import { ChainId, NetworkConfig } from './types/network';
import { getContractAddresses } from './config/contracts';
import { ContractFactory } from './contracts';
import { IDeedNFT } from './contracts/IDeedNFT';
import { IFundManager } from './contracts/IFundManager';
import { IValidator } from './contracts/IValidator';
import { IValidatorRegistry } from './contracts/IValidatorRegistry';
import { IMetadataRenderer } from './contracts/IMetadataRenderer';
import { TransactionQueue } from './utils/transactionQueue';
import { NetworkMonitor } from './utils/networkMonitor';
import { ValidationSystem } from './utils/validation';
import { MonitoringSystem } from './utils/monitoring';
import { RateLimiter } from './utils/rateLimiter';
import { TransactionManager, TransactionResult } from './utils/transactionManager';

export interface SDKConfig {
  network: NetworkConfig;
  signer: ethers.Signer;
  options?: {
    maxConcurrentTransactions?: number;
    maxRetries?: number;
    retryDelay?: number;
    confirmations?: number;
    timeout?: number;
    maxRequests?: number;
    timeWindow?: number;
  };
}

export class ProtocolSDK {
  private provider: ethers.Provider;
  private signer: ethers.Signer;
  private chainId: ChainId;
  private contracts: {
    deedNFT?: ethers.Contract;
    fundManager?: ethers.Contract;
    validator?: ethers.Contract;
    validatorRegistry?: ethers.Contract;
    metadataRenderer?: ethers.Contract;
  } = {};
  private transactionQueue: TransactionQueue;
  private networkMonitor: NetworkMonitor;
  private monitoringSystem: MonitoringSystem;
  private rateLimiter: RateLimiter;

  constructor(config: SDKConfig) {
    this.provider = config.network.provider;
    this.signer = config.signer;
    this.chainId = config.network.chainId;

    // Initialize utilities
    this.transactionQueue = new TransactionQueue(
      this.provider,
      this.signer,
      {
        maxConcurrent: config.options?.maxConcurrentTransactions ?? 3,
        maxRetries: config.options?.maxRetries ?? 3,
        retryDelay: config.options?.retryDelay ?? 1000,
        confirmations: config.options?.confirmations ?? 1,
        timeout: config.options?.timeout ?? 300000,
      }
    );

    this.networkMonitor = new NetworkMonitor(this.provider);
    this.monitoringSystem = new MonitoringSystem(this.provider);
    this.rateLimiter = new RateLimiter({
      maxRequests: config.options?.maxRequests ?? 100,
      timeWindow: config.options?.timeWindow ?? 60000,
    });
  }

  /**
   * Initialize contract instances
   */
  async initialize(): Promise<void> {
    const addresses = getContractAddresses(this.chainId);
    
    // Initialize contract instances with signer
    this.contracts.deedNFT = new ethers.Contract(
      addresses.DeedNFT,
      IDeedNFT.abi,
      this.signer
    );

    this.contracts.fundManager = new ethers.Contract(
      addresses.FundManager,
      IFundManager.abi,
      this.signer
    );

    this.contracts.validator = new ethers.Contract(
      addresses.Validator,
      IValidator.abi,
      this.signer
    );

    this.contracts.validatorRegistry = new ethers.Contract(
      addresses.ValidatorRegistry,
      IValidatorRegistry.abi,
      this.signer
    );

    this.contracts.metadataRenderer = new ethers.Contract(
      addresses.MetadataRenderer,
      IMetadataRenderer.abi,
      this.signer
    );
  }

  /**
   * Mint a new DeedNFT
   */
  async mintDeedNFT(params: {
    owner: string;
    assetType: number;
    ipfsDetailsHash: string;
    definition: string;
    configuration: string;
    validatorAddress: string;
    salt: bigint;
  }): Promise<{ tokenId: bigint; hash: string }> {
    if (!this.contracts.deedNFT) {
      throw new Error('DeedNFT contract not initialized');
    }

    // Validate inputs
    ValidationSystem.validateAddress(params.owner);
    ValidationSystem.validateAddress(params.validatorAddress);
    ValidationSystem.validateIpfsHash(params.ipfsDetailsHash, 'ipfsDetailsHash');

    // Check rate limit
    this.rateLimiter.checkRateLimit();

    // Mint NFT
    const tx = await this.contracts.deedNFT.mintAsset(
      params.owner,
      params.assetType,
      params.ipfsDetailsHash,
      params.definition,
      params.configuration,
      params.validatorAddress,
      params.salt
    );

    // Add to transaction queue
    const from = await this.signer.getAddress();
    const transaction = {
      from,
      to: await tx.getAddress(),
      data: tx.data,
      value: BigInt(0),
      nonce: await this.provider.getTransactionCount(from),
      gasLimit: await tx.estimateGas()
    };

    const hash = await this.transactionQueue.add(transaction);

    // Wait for confirmation
    await this.transactionQueue.getStatus(hash);

    // Get token ID from event
    const receipt = await this.provider.getTransactionReceipt(hash);
    const deedNFTAddress = await this.contracts.deedNFT?.getAddress();
    if (!deedNFTAddress) {
      throw new Error('DeedNFT contract not initialized');
    }
    const event = receipt?.logs.find(log => 
      log.address.toLowerCase() === deedNFTAddress.toLowerCase()
    );

    if (!event) {
      throw new Error('Failed to get token ID from event');
    }

    const tokenId = BigInt(event.topics[3]);

    return { tokenId, hash };
  }

  /**
   * Update DeedNFT metadata
   */
  async updateDeedNFTMetadata(params: {
    tokenId: bigint;
    uri: string;
    operatingAgreement: string;
    definition: string;
    configuration: string;
  }): Promise<string> {
    if (!this.contracts.deedNFT) {
      throw new Error('DeedNFT contract not initialized');
    }

    // Validate inputs
    ValidationSystem.validateIpfsHash(params.uri, 'uri');
    ValidationSystem.validateIpfsHash(params.operatingAgreement, 'operatingAgreement');

    // Check rate limit
    this.rateLimiter.checkRateLimit();

    // Update metadata
    const tx = await this.contracts.deedNFT.updateMetadata(
      params.tokenId,
      params.uri,
      params.operatingAgreement,
      params.definition,
      params.configuration
    );

    // Add to transaction queue
    const from = await this.signer.getAddress();
    const transaction = {
      from,
      to: await tx.getAddress(),
      data: tx.data,
      value: BigInt(0),
      nonce: await this.provider.getTransactionCount(from),
      gasLimit: await tx.estimateGas()
    };

    const hash = await this.transactionQueue.add(transaction);

    return hash;
  }

  /**
   * Get DeedNFT metadata
   */
  async getDeedNFTMetadata(tokenId: bigint): Promise<{
    uri: string;
    operatingAgreement: string;
    definition: string;
    configuration: string;
  }> {
    if (!this.contracts.deedNFT) {
      throw new Error('DeedNFT contract not initialized');
    }

    const info = await this.contracts.deedNFT.getDeedInfo(tokenId);
    const uri = await this.contracts.deedNFT.tokenURI(tokenId);

    return {
      uri,
      operatingAgreement: info.operatingAgreement,
      definition: info.definition,
      configuration: info.configuration
    };
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(hash: string) {
    return this.transactionQueue.getStatus(hash);
  }

  /**
   * Get network status
   */
  async getNetworkStatus() {
    return this.networkMonitor.getStatus();
  }

  /**
   * Start monitoring network
   */
  async startMonitoring() {
    await this.networkMonitor.start();
  }

  /**
   * Stop monitoring network
   */
  stopMonitoring() {
    this.networkMonitor.stop();
  }
}

// Export the SDK as the default export
export default ProtocolSDK;

// Also export individual modules for direct access
export {
  deedNFT,
  fundManager,
  validator,
  validatorRegistry,
  metadataRenderer,
  TransactionManager,
  TransactionResult
}; 