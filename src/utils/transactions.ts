import { ethers } from 'ethers';
import { TransactionResponse, TransactionReceipt } from '@ethersproject/abstract-provider';
import { SDKError, ERROR_CODES } from './errors';
import { TransactionQueue } from './transactionQueue';
import { ErrorHandler } from './errors';

export interface TransactionOptions {
  gasLimit?: ethers.BigNumber;
  gasPrice?: ethers.BigNumber;
  nonce?: number;
  maxFeePerGas?: ethers.BigNumber;
  maxPriorityFeePerGas?: ethers.BigNumber;
  value?: ethers.BigNumber;
  retryConfig?: {
    maxAttempts: number;
    initialDelay: number;
  };
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  MINING = 'MINING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface TransactionState {
  status: TransactionStatus;
  hash?: string;
  receipt?: ethers.ContractReceipt;
  error?: string;
}

export interface TransactionEventCallbacks {
  onSubmitted?: (hash: string) => void;
  onConfirmed?: (receipt: TransactionReceipt) => void;
  onFailed?: (error: Error) => void;
  onSpeedUp?: (newHash: string, oldHash: string) => void;
  onCancel?: (hash: string) => void;
  onBlockMined?: (confirmations: number) => void;
}

export class TransactionManager {
  private queue: TransactionQueue;
  private errorHandler: ErrorHandler;

  constructor(
    private provider: ethers.providers.Provider,
    errorHandler?: ErrorHandler
  ) {
    this.queue = new TransactionQueue();
    this.errorHandler = errorHandler || new ErrorHandler(provider);
  }

  async sendTransaction(
    tx: ethers.providers.TransactionRequest,
    options?: TransactionOptions
  ): Promise<ethers.providers.TransactionResponse> {
    return this.queue.add(async () => {
      try {
        const signer = this.provider.getSigner();
        const response = await signer.sendTransaction(tx);
        return response;
      } catch (error) {
        throw await this.errorHandler.handleError(error);
      }
    });
  }

  async monitorTransaction(
    tx: ethers.ContractTransaction,
    callbacks?: {
      onMined?: (receipt: ethers.ContractReceipt) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<TransactionState> {
    try {
      const receipt = await tx.wait();
      callbacks?.onMined?.(receipt);
      return {
        status: TransactionStatus.SUCCESS,
        hash: tx.hash,
        receipt
      };
    } catch (error: any) {
      callbacks?.onError?.(error);
      return {
        status: TransactionStatus.FAILED,
        hash: tx.hash,
        error: error.message
      };
    }
  }

  async estimateGas(tx: ethers.PopulatedTransaction): Promise<ethers.BigNumber> {
    return this.provider.estimateGas(tx);
  }

  async getGasPrice(): Promise<ethers.BigNumber> {
    return this.provider.getGasPrice();
  }

  async monitorTransactionWithUpdates(
    txResponse: TransactionResponse,
    callbacks: TransactionEventCallbacks = {},
    confirmations: number = 1
  ): Promise<TransactionStatus> {
    const { hash } = txResponse;
    callbacks.onSubmitted?.(hash);

    const status = await this.monitorTransaction(txResponse, {
      onMined: (receipt) => {
        if (receipt.status === 1) {
          callbacks.onConfirmed?.(receipt);
        } else {
          callbacks.onFailed?.(new Error('Transaction failed'));
        }
      }
    });

    // Listen for replacement transactions (speedup/cancel)
    this.provider.on('pending', async (pendingHash) => {
      const tx = await this.provider.getTransaction(pendingHash);
      if (tx && tx.nonce === txResponse.nonce && tx.from === txResponse.from) {
        if (tx.hash !== hash) {
          // Transaction was replaced
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            callbacks.onSpeedUp?.(tx.hash, hash);
          } else {
            callbacks.onCancel?.(hash);
          }
        }
      }
    });

    // Monitor block confirmations
    let currentConfirmations = 0;
    this.provider.on('block', async () => {
      const receipt = await this.provider.getTransactionReceipt(hash);
      if (receipt && receipt.confirmations > currentConfirmations) {
        currentConfirmations = receipt.confirmations;
        callbacks.onBlockMined?.(currentConfirmations);
      }
    });

    return status.status;
  }

  getPendingTransactions(): TransactionStatus[] {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  private async getSignerAddress(): Promise<string> {
    if (this.provider instanceof ethers.providers.Web3Provider) {
      return await this.provider.getSigner().getAddress();
    }
    throw new SDKError('No signer available', ERROR_CODES.NO_SIGNER);
  }

  async speedUpTransaction(
    oldTxHash: string,
    increaseFactor: number = 1.1
  ): Promise<TransactionStatus> {
    const oldTx = await this.provider.getTransaction(oldTxHash);
    if (!oldTx) {
      throw new SDKError('Transaction not found', ERROR_CODES.TRANSACTION_NOT_FOUND);
    }

    const newGasPrice = oldTx.gasPrice!.mul(Math.floor(increaseFactor * 100)).div(100);
    
    const newTx = {
      to: oldTx.to,
      from: oldTx.from,
      nonce: oldTx.nonce,
      data: oldTx.data,
      value: oldTx.value,
      gasLimit: oldTx.gasLimit,
      gasPrice: newGasPrice,
      chainId: oldTx.chainId
    };

    if (this.provider instanceof ethers.providers.Web3Provider) {
      const signer = this.provider.getSigner();
      const txResponse = await signer.sendTransaction(newTx);
      return this.monitorTransaction(txResponse, {
        onMined: (receipt) => {
          if (receipt.status === 1) {
            // Transaction succeeded
          } else {
            throw new Error('Speed up transaction failed');
          }
        },
        onError: (error) => {
          throw error;
        }
      });
    }
    
    throw new SDKError('Provider does not support signing', ERROR_CODES.INVALID_SIGNER);
  }

  async cancelTransaction(txHash: string): Promise<TransactionStatus> {
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) {
      throw new SDKError('Transaction not found', ERROR_CODES.TRANSACTION_NOT_FOUND);
    }

    // Send 0 ETH to self with same nonce to cancel
    const cancelTx = {
      to: tx.from,
      from: tx.from,
      nonce: tx.nonce,
      data: '0x',
      value: 0,
      gasLimit: 21000, // Standard ETH transfer
      gasPrice: tx.gasPrice!.mul(12).div(10), // 20% higher gas price
      chainId: tx.chainId
    };

    if (this.provider instanceof ethers.providers.Web3Provider) {
      const signer = this.provider.getSigner();
      const txResponse = await signer.sendTransaction(cancelTx);
      return this.monitorTransaction(txResponse, {
        onMined: (receipt) => {
          if (receipt.status === 1) {
            // Transaction succeeded
          } else {
            throw new Error('Cancel transaction failed');
          }
        },
        onError: (error) => {
          throw error;
        }
      });
    }

    throw new SDKError('Provider does not support signing', ERROR_CODES.INVALID_SIGNER);
  }

  async handleTransaction<T>(
    txPromise: Promise<ethers.ContractTransaction>,
    callbacks?: {
      onSubmitted?: (hash: string) => void;
      onMining?: (confirmations: number) => void;
      onSuccess?: (receipt: ethers.ContractReceipt) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<TransactionState> {
    try {
      const tx = await txPromise;
      callbacks?.onSubmitted?.(tx.hash);

      const receipt = await tx.wait();
      callbacks?.onSuccess?.(receipt);

      return {
        status: TransactionStatus.SUCCESS,
        hash: tx.hash,
        receipt
      };
    } catch (error: any) {
      callbacks?.onError?.(error);
      return {
        status: TransactionStatus.FAILED,
        error: error.message
      };
    }
  }
} 