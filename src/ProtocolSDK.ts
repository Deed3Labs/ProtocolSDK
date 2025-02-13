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

export const SDK_VERSION = '0.1.0';
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
    
    this.provider = config.provider;
    this.network = config.network;

    this.wallet = new WalletManager(config.walletConfig);
    this.transactions = new TransactionManager(this.provider);
    this.errorHandler = new ErrorHandler(this.provider);
    this.txQueue = new TransactionQueue();

    this.initializeContracts(config.contracts);

    this.events = new EventManager({
      deedNFT: this.deedNFT.contract,
      subdivide: this.subdivide.contract,
      fractionalize: this.fractionalize.contract
    });

    this.setupNetworkMonitoring();
  }

  private validateConfig(config: SDKConfig) {
    if (!config.provider) {
      throw new SDKError('Provider is required', ERROR_CODES.INVALID_CONFIG);
    }
    if (!config.network) {
      throw new SDKError('Network configuration is required', ERROR_CODES.INVALID_CONFIG);
    }
  }

  private initializeContracts(addresses: SDKConfig['contracts']) {
    const contractConfig = {
      provider: this.provider,
      network: this.network,
      errorHandler: this.errorHandler,
      txManager: this.transactions
    };

    const contracts = {
      deedNFT: DeedNFTContract,
      subdivide: SubdivideContract,
      fractionalize: FractionalizeContract,
      validatorRegistry: ValidatorRegistryContract,
      fundManager: FundManagerContract
    };

    Object.entries(contracts).forEach(([key, Contract]) => {
      this[key] = new Contract(addresses[key], contractConfig);
    });
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
    try {
      const currentNetwork = await this.wallet.getNetwork();
      return currentNetwork.chainId === this.network.chainId;
    } catch (error) {
      this.errorHandler.handleError(error);
      return false;
    }
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

  private async init() {
    if (this.initialized) return;
    await this.validateNetwork();
    this.initialized = true;
  }

  static async create(config: SDKConfig): Promise<ProtocolSDK> {
    const sdk = new ProtocolSDK(config);
    
    const isValid = await sdk.isValidNetwork();
    if (!isValid) {
      throw new SDKError(
        'Invalid network',
        ERROR_CODES.INVALID_NETWORK,
        { expected: config.network.chainId }
      );
    }
    
    await sdk.init();
    return sdk;
  }

  private async validateNetwork() {
    const currentNetwork = await this.wallet.getNetwork();
    if (currentNetwork.chainId !== this.network.chainId) {
      try {
        await this.wallet.switchNetwork(this.network.chainId);
      } catch (error) {
        throw new SDKError(
          'Failed to switch to correct network',
          ERROR_CODES.NETWORK_SWITCH_FAILED
        );
      }
    }
  }
}
