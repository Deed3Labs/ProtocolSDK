import { ethers } from 'ethers';
import { TransactionResponse, TransactionReceipt } from '@ethersproject/abstract-provider';
import { SDKError, ERROR_CODES } from '../utils/errors';
import { NetworkConfig } from '../types/config';
import { TransactionManager, TransactionOptions } from '../utils/transactions';
import { ErrorHandler } from '../utils/errorHandler';

export abstract class BaseContract {
  protected contract: ethers.Contract;
  protected provider: ethers.providers.Web3Provider;
  protected network: NetworkConfig;
  protected txManager: TransactionManager;
  protected errorHandler: ErrorHandler;

  constructor(
    address: string,
    abi: ethers.ContractInterface,
    provider: ethers.providers.Web3Provider,
    network: NetworkConfig
  ) {
    if (!address || !ethers.utils.isAddress(address)) {
      throw new SDKError('Invalid contract address', ERROR_CODES.CONTRACT_NOT_FOUND);
    }
    
    this.provider = provider;
    this.contract = new ethers.Contract(address, abi, provider);
    this.network = network;
    this.txManager = new TransactionManager(this.provider);
    this.errorHandler = new ErrorHandler();
  }

  protected async handleTransaction(
    txPromise: Promise<TransactionResponse>,
    options?: TransactionOptions
  ): Promise<TransactionReceipt> {
    try {
      const tx = await txPromise;
      const status = await this.txManager.monitorTransaction(tx);
      if (status.status === 'confirmed' && status.receipt) {
        return status.receipt;
      }
      throw new SDKError('Transaction failed', ERROR_CODES.TRANSACTION_FAILED);
    } catch (error: any) {
      throw new SDKError(
        error.message || 'Transaction failed',
        ERROR_CODES.TRANSACTION_FAILED,
        error
      );
    }
  }

  protected async getSignedContract(): Promise<ethers.Contract> {
    const signer = this.provider.getSigner();
    return this.contract.connect(signer);
  }

  // Add methods for gas estimation and transaction monitoring
  protected async estimateGas(
    method: string,
    args: any[]
  ): Promise<ethers.BigNumber> {
    try {
      return await this.contract.estimateGas[method](...args);
    } catch (error: any) {
      throw new SDKError(
        `Gas estimation failed: ${error.message}`,
        ERROR_CODES.GAS_ESTIMATION_FAILED
      );
    }
  }

  protected async waitForTransaction(
    tx: TransactionResponse,
    confirmations: number = 1
  ): Promise<TransactionReceipt> {
    try {
      return await tx.wait(confirmations);
    } catch (error: any) {
      throw new SDKError(
        `Transaction failed: ${error.message}`,
        ERROR_CODES.TRANSACTION_FAILED
      );
    }
  }

  protected async estimateAndSendTransaction(
    method: string,
    args: any[],
    options: TransactionOptions = {}
  ): Promise<ethers.ContractTransaction> {
    const signedContract = await this.getSignedContract();
    const gasEstimate = await signedContract.estimateGas[method](...args);
    
    const tx = await signedContract[method](...args, {
      gasLimit: gasEstimate.mul(12).div(10), // Add 20% buffer
      ...options
    });

    return tx;
  }

  protected async executeTransaction(
    method: string,
    args: any[]
  ): Promise<TransactionResponse> {
    try {
      const signer = this.provider.getSigner();
      const tx = await this.contract.connect(signer)[method](...args);
      const receipt = await tx.wait();
      return { success: true, receipt };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
} 