import { 
  type PublicClient, 
  type WalletClient,
  type Hash,
  type TransactionReceipt,
  type TransactionRequest,
  type TransactionRequestBase,
  watchPendingTransactions,
  watchBlocks
} from 'viem'
import { ProtocolError, ErrorType } from './errors'

export interface TransactionOptions extends TransactionRequestBase {
  retryConfig?: {
    maxAttempts: number;
    initialDelay: number;
  };
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface TransactionState {
  status: TransactionStatus;
  hash: Hash;
  receipt?: TransactionReceipt;
}

export interface TransactionEventCallbacks {
  onSubmitted?: (hash: Hash) => void;
  onConfirmed?: (receipt: TransactionReceipt) => void;
  onFailed?: (error: Error) => void;
  onSpeedUp?: (newHash: Hash, oldHash: Hash) => void;
  onCancel?: (hash: Hash) => void;
  onBlockMined?: (confirmations: number) => void;
}

export class TransactionManager {
  private queue: TransactionQueue;
  private errorHandler: ErrorHandler;

  constructor(private publicClient: PublicClient) {
    this.queue = new TransactionQueue();
    this.errorHandler = new ErrorHandler(publicClient);
  }

  async sendTransaction(
    request: TransactionRequest,
    callbacks?: {
      onSubmitted?: (hash: Hash) => void;
      onMined?: (receipt: TransactionReceipt) => void;
    }
  ): Promise<TransactionState> {
    try {
      const hash = await this.walletClient.sendTransaction(request)
      callbacks?.onSubmitted?.(hash)

      const receipt = await this.waitForTransaction(hash)
      callbacks?.onMined?.(receipt)

      return {
        status: TransactionStatus.SUCCESS,
        hash,
        receipt
      }
    } catch (error) {
      throw new ProtocolError(
        ErrorType.TRANSACTION_FAILED,
        'Transaction failed',
        error
      )
    }
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
    return publicClient.estimateGas(tx);
  }

  async getGasPrice(): Promise<ethers.BigNumber> {
    return publicClient.getGasPrice();
  }

  async monitorTransactionWithUpdates(
    hash: Hash,
    callbacks: TransactionEventCallbacks = {},
    confirmations: number = 1
  ): Promise<void> {
    callbacks.onSubmitted?.(hash);

    const unwatchPending = watchPendingTransactions(this.publicClient, {
      onTransactions: async (pendingHashes) => {
        for (const pendingHash of pendingHashes) {
          const tx = await this.publicClient.getTransaction({ hash: pendingHash })
          if (tx && tx.hash !== hash) {
            callbacks.onSpeedUp?.(tx.hash, hash)
          }
        }
      }
    })

    let currentConfirmations = 0
    const unwatchBlocks = watchBlocks(this.publicClient, {
      onBlock: async () => {
        try {
          const receipt = await this.publicClient.getTransactionReceipt({ hash })
          if (receipt) {
            if (receipt.status === 'success') {
              callbacks.onConfirmed?.(receipt)
            } else {
              callbacks.onFailed?.(new Error('Transaction failed'))
            }
            currentConfirmations++
            callbacks.onBlockMined?.(currentConfirmations)

            if (currentConfirmations >= confirmations) {
              unwatchBlocks()
              unwatchPending()
            }
          }
        } catch (error) {
          callbacks.onFailed?.(error instanceof Error ? error : new Error('Unknown error'))
        }
      }
    })
  }

  getPendingTransactions(): TransactionStatus[] {
    // Implementation needed
    throw new Error('Method not implemented');
  }

  private async getSignerAddress(): Promise<string> {
    if (publicClient instanceof ethers.providers.Web3Provider) {
      return await publicClient.getSigner().getAddress();
    }
    throw new SDKError('No signer available', ERROR_CODES.NO_SIGNER);
  }

  async speedUpTransaction(
    oldTxHash: string,
    increaseFactor: number = 1.1
  ): Promise<TransactionStatus> {
    const oldTx = await publicClient.getTransaction(oldTxHash);
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

    if (publicClient instanceof ethers.providers.Web3Provider) {
      const signer = publicClient.getSigner();
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
    const tx = await publicClient.getTransaction(txHash);
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

    if (publicClient instanceof ethers.providers.Web3Provider) {
      const signer = publicClient.getSigner();
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
    txPromise: Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>,
    callbacks?: {
      onSubmitted?: (hash: Hash) => void;
      onMining?: (confirmations: number) => void;
      onSuccess?: (receipt: TransactionReceipt) => void;
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

  async waitForTransaction(hash: Hash): Promise<TransactionReceipt> {
    return await this.publicClient.waitForTransactionReceipt({ hash })
  }

  async getTransactionReceipt(hash: Hash): Promise<TransactionReceipt | null> {
    try {
      return await this.publicClient.getTransactionReceipt({ hash })
    } catch (error) {
      throw new ProtocolError(
        ErrorType.TRANSACTION_FAILED,
        'Failed to get transaction receipt',
        error
      )
    }
  }
} 