import { 
  type PublicClient, 
  type Hash,
  type TransactionReceipt,
  type TransactionRequestBase
} from 'viem'
import { watchBlocks } from 'viem/actions'
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
  hash?: Hash;
  receipt?: TransactionReceipt;
  error?: string;
}

export interface TransactionEventCallbacks {
  onSubmitted?: (hash: Hash) => void;
  onConfirmed?: (receipt: TransactionReceipt) => void;
  onFailed?: (error: Error) => void;
  onBlockMined?: (confirmations: number) => void;
}

export type TransactionResponse = {
  hash: Hash
  wait: () => Promise<TransactionReceipt>
}

export class TransactionManager {
  constructor(private publicClient: PublicClient) {}

  async monitorTransactionWithUpdates(
    hash: Hash,
    callbacks: TransactionEventCallbacks = {},
    confirmations: number = 1
  ): Promise<void> {
    callbacks.onSubmitted?.(hash);

    let currentConfirmations = 0
    const unwatch = watchBlocks(this.publicClient, {
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
              unwatch()
            }
          }
        } catch (error) {
          callbacks.onFailed?.(error instanceof Error ? error : new Error('Unknown error'))
        }
      }
    })
  }

  async handleTransaction(
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
        'Failed to get transaction receipt',
        ErrorType.TRANSACTION_FAILED,
        error
      )
    }
  }

  async getGasPrice(): Promise<bigint> {
    return this.publicClient.getGasPrice()
  }
} 