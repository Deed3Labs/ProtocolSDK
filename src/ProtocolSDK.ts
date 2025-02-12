import { providers } from 'ethers';
import {
  DeedNFTContract,
  SubdivideContract,
  FractionalizeContract,
  ValidatorRegistryContract,
  FundManagerContract
} from './contracts';
import { WalletManager } from './utils/wallet';
import { EventManager } from './utils/events';
import { TransactionManager } from './utils/transactions';
import { ErrorHandler } from './utils/errorHandler';
import { TransactionQueue } from './utils/transactionQueue';
import { SDKConfig, NetworkConfig } from './types/config';
import { SDKError, ERROR_CODES } from './utils/errors';

export * from './types';
export * from './contracts';
export * from './utils/wallet';
export * from './utils/events';
export { ProtocolSDK as default } from './ProtocolSDK';

export class ProtocolSDK {
  public readonly wallet: WalletManager;
  public readonly events: EventManager;
  public readonly transactions: TransactionManager;
  public readonly errorHandler: ErrorHandler;
  public readonly txQueue: TransactionQueue;
  
  public deedNFT: DeedNFTContract;
  public subdivide: SubdivideContract;
  public fractionalize: FractionalizeContract;
  public validatorRegistry: ValidatorRegistryContract;
  public fundManager: FundManagerContract;

  private provider: providers.Provider;
  private network: NetworkConfig;
  private initialized = false;

  constructor(config: SDKConfig) {
    this.validateConfig(config);
    
    // Initialize provider and network
    this.provider = config.provider;
    this.network = config.network;

    // Initialize utility managers
    this.wallet = new WalletManager(config.walletConfig);
    this.transactions = new TransactionManager(this.provider);
    this.errorHandler = new ErrorHandler(this.provider);
    this.txQueue = new TransactionQueue();

    // Initialize contracts
    this.initializeContracts(config.contracts);

    // Initialize event manager with contracts
    this.events = new EventManager({
      deedNFT: this.deedNFT.contract,
      subdivide: this.subdivide.contract,
      fractionalize: this.fractionalize.contract
    });

    // Setup network monitoring
    this.setupNetworkMonitoring();
  }

  private validateConfig(config: SDKConfig) {
    if (!config.provider) {
      throw new SDKError('Provider is required', ERROR_CODES.INVALID_CONFIG);
    }
    if (!config.network) {
      throw new SDKError('Network configuration is required', ERROR_CODES.INVALID_CONFIG);
    }
    if (!config.contracts) {
      throw new SDKError('Contract addresses are required', ERROR_CODES.INVALID_CONFIG);
    }
  }

  private initializeContracts(addresses: SDKConfig['contracts']) {
    const contractConfig = {
      provider: this.provider,
      network: this.network,
      errorHandler: this.errorHandler,
      txQueue: this.txQueue,
      transactions: this.transactions
    };

    this.deedNFT = new DeedNFTContract(addresses.deedNFT, contractConfig);
    this.subdivide = new SubdivideContract(addresses.subdivide, contractConfig);
    this.fractionalize = new FractionalizeContract(addresses.fractionalize, contractConfig);
    this.validatorRegistry = new ValidatorRegistryContract(addresses.validatorRegistry, contractConfig);
    this.fundManager = new FundManagerContract(addresses.fundManager, contractConfig);
  }

  private setupNetworkMonitoring() {
    if (this.provider instanceof providers.Web3Provider) {
      this.provider.on('network', (newNetwork, oldNetwork) => {
        if (oldNetwork && newNetwork.chainId !== this.network.chainId) {
          this.handleNetworkChange(newNetwork.chainId);
        }
      });
    }
  }

  private async handleNetworkChange(newChainId: number) {
    if (newChainId !== this.network.chainId) {
      this.events.removeAllListeners();
      this.txQueue.clearQueue();
      throw new SDKError(
        'Network changed unexpectedly',
        ERROR_CODES.NETWORK_CHANGED,
        { expected: this.network.chainId, received: newChainId }
      );
    }
  }

  // Public utility methods
  async isValidNetwork(): Promise<boolean> {
    const network = await this.provider.getNetwork();
    return network.chainId === this.network.chainId;
  }

  async getGasPrice(): Promise<providers.BigNumber> {
    return this.transactions.getGasPrice();
  }

  getPendingTransactions() {
    return this.txQueue.getQueueStatus();
  }

  // Cleanup method
  destroy() {
    this.events.removeAllListeners();
    this.txQueue.clearQueue();
    if (this.provider.removeAllListeners) {
      this.provider.removeAllListeners();
    }
  }

  async init() {
    if (this.initialized) return;
    
    // Verify network and contracts
    await this.validateConfig(this.config);
    
    // Initialize contracts
    await this.initializeContracts();
    
    this.initialized = true;
  }

  static async create(config: SDKConfig): Promise<ProtocolSDK> {
    const sdk = new ProtocolSDK(config);
    await sdk.init();
    return sdk;
  }
}

// Export a factory function for easier initialization
export async function createProtocolSDK(config: SDKConfig): Promise<ProtocolSDK> {
  const sdk = new ProtocolSDK(config);
  const isValid = await sdk.isValidNetwork();
  
  if (!isValid) {
    throw new SDKError(
      'Invalid network',
      ERROR_CODES.INVALID_NETWORK,
      { expected: config.network.chainId }
    );
  }
  
  return sdk;
}
