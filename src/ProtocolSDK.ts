import { type PublicClient, type WalletClient } from 'viem';
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
import { TransactionQueue, QueueStatus } from './utils/transactionQueue';
import { SDKConfig, NetworkConfig } from './config/types';
import { ProtocolError, ErrorType } from './utils/errors';
import { NetworkMonitor } from './utils/networkMonitor';

// Only export the SDK class and creation function
export { ProtocolSDK as default } from './ProtocolSDK';
export const createProtocolSDK = async (config: SDKConfig): Promise<ProtocolSDK> => {
  return ProtocolSDK.create(config);
};

// Export types from a single location
export * from './types';

export class ProtocolSDK {
  public readonly wallet: WalletManager;
  public readonly events: EventManager;
  public readonly transactions: TransactionManager;
  public readonly errorHandler: ErrorHandler;
  public readonly txQueue: TransactionQueue;
  
  public deedNFT!: DeedNFTContract;
  public subdivide!: SubdivideContract;
  public fractionalize!: FractionalizeContract;
  public validatorRegistry!: ValidatorRegistryContract;
  public fundManager!: FundManagerContract;

  private publicClient: PublicClient;
  private network: NetworkConfig;
  private walletClient: WalletClient | null = null;

  private constructor(config: SDKConfig) {
    this.validateConfig(config);
    
    this.publicClient = config.publicClient;
    this.network = config.network;
    
    // Initialize wallet manager with AppKit
    this.wallet = new WalletManager({
      ...config.walletConfig,
      network: this.network,
      supportedChainIds: [this.network.chainId] // Ensure network chainId is supported
    });
    
    this.transactions = new TransactionManager(this.publicClient);
    this.errorHandler = new ErrorHandler(this.publicClient);
    this.txQueue = new TransactionQueue();
    this.events = new EventManager(this.publicClient);
    
    this.setupNetworkMonitoring();
  }

  private validateConfig(config: SDKConfig): void {
    if (!config.publicClient) {
      throw new ProtocolError(
        'Public client is required',
        ErrorType.INVALID_CONFIG
      );
    }

    if (!config.network) {
      throw new ProtocolError(
        'Network configuration is required',
        ErrorType.INVALID_CONFIG
      );
    }

    if (!config.network.contracts) {
      throw new ProtocolError(
        'Contract addresses are required',
        ErrorType.INVALID_CONFIG
      );
    }
  }

  private async initializeContracts() {
    const { walletClient } = await this.wallet.connect();
    this.walletClient = walletClient;

    this.deedNFT = new DeedNFTContract(
      this.publicClient,
      this.walletClient,
      this.network.contracts.deedNFT
    );
    
    this.subdivide = new SubdivideContract(
      this.publicClient,
      this.walletClient,
      this.network.contracts.subdivide,
      this.deedNFT
    );
    
    this.fractionalize = new FractionalizeContract(
      this.publicClient,
      this.walletClient,
      this.network.contracts.fractionalize
    );
    
    this.validatorRegistry = new ValidatorRegistryContract(
      this.publicClient,
      this.walletClient,
      this.network.contracts.validatorRegistry
    );
    
    this.fundManager = new FundManagerContract(
      this.publicClient,
      this.walletClient,
      this.network.contracts.fundManager
    );
  }

  private setupNetworkMonitoring(): void {
    const monitor = new NetworkMonitor(this.publicClient, this.network)
    
    monitor.onNetworkChange(async (chainId: number) => {
      try {
        await this.validateNetwork(chainId)
      } catch (error) {
        throw ProtocolError.fromError(error)
      }
    })
  }

  private async validateNetwork(chainId: number): Promise<void> {
    if (chainId !== this.network.chainId) {
      await this.switchNetwork(this.network.chainId)
    }
  }

  public static async create(config: SDKConfig): Promise<ProtocolSDK> {
    const sdk = new ProtocolSDK(config)
    await sdk.initializeContracts()
    return sdk
  }

  private async switchNetwork(chainId: number): Promise<void> {
    await this.wallet.switchNetwork(chainId)
  }

  public getPublicClient(): PublicClient {
    return this.publicClient;
  }

  public getNetwork(): NetworkConfig {
    return this.network;
  }

  // Public utility methods
  async isValidNetwork(): Promise<boolean> {
    try {
      const currentNetwork = await this.wallet.getNetwork();
      return currentNetwork.chainId === this.network.chainId;
    } catch (error) {
      this.errorHandler.handleError(error);
      return false;
    }
  }

  async getGasPrice(): Promise<bigint> {
    return this.transactions.getGasPrice();
  }

  getPendingTransactions(): QueueStatus {
    return this.txQueue.getQueueStatus();
  }

  // Cleanup method
  destroy() {
    this.events.removeAllListeners();
    this.txQueue.clear();
  }
}

export type { SDKConfig } from './types/sdk'
export type { QueueStatus } from './utils/transactionQueue'
