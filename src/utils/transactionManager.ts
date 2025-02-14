import { 
  type PublicClient,
  type TransactionReceipt,
  type Hash
} from 'viem'
import { 
  getTransactionReceipt,
  watchPendingTransactions,
  watchBlocks 
} from 'viem/actions'
import { ProtocolError, ErrorType } from './errors'
import { TransactionEventCallbacks } from '../types/transactions'

export class TransactionManager {
  private client: PublicClient
  private watchedTransactions: Map<Hash, {
    unwatch: () => void;
    callbacks: TransactionEventCallbacks;
  }> = new Map()

  constructor(client: PublicClient) {
    this.client = client
  }

  async waitForTransaction(hash: Hash): Promise<TransactionReceipt> {
    try {
      return await getTransactionReceipt(this.client, { hash })
    } catch (error) {
      throw new ProtocolError(
        `Failed to wait for transaction ${hash}`,
        ErrorType.TRANSACTION_ERROR,
        error
      )
    }
  }

  watchTransaction(
    hash: Hash,
    callbacks: TransactionEventCallbacks,
    confirmations: number = 1
  ): () => void {
    if (this.watchedTransactions.has(hash)) {
      return () => this.stopWatching(hash)
    }

    const unwatchPending = watchPendingTransactions(this.client, {
      onTransactions: async (hashes: Hash[]) => {
        if (hashes.includes(hash)) {
          callbacks.onPending?.()
        }
      }
    })

    let confirmedBlocks = 0
    const unwatchBlocks = watchBlocks(this.client, {
      onBlock: async () => {
        try {
          const receipt = await this.client.getTransactionReceipt({ hash })
          if (receipt) {
            confirmedBlocks++
            callbacks.onConfirmation?.(confirmedBlocks)

            if (confirmedBlocks >= confirmations) {
              if (receipt.status === 'success') {
                callbacks.onSuccess?.(receipt)
              } else {
                callbacks.onError?.(new Error('Transaction failed'))
              }
              this.stopWatching(hash)
            }
          }
        } catch (error) {
          callbacks.onError?.(error instanceof Error ? error : new Error('Unknown error'))
          this.stopWatching(hash)
        }
      }
    })

    const unwatch = () => {
      unwatchPending()
      unwatchBlocks()
    }

    this.watchedTransactions.set(hash, { unwatch, callbacks })
    return () => this.stopWatching(hash)
  }

  private stopWatching(hash: Hash): void {
    const watched = this.watchedTransactions.get(hash)
    if (watched) {
      watched.unwatch()
      this.watchedTransactions.delete(hash)
    }
  }

  cleanup(): void {
    this.watchedTransactions.forEach(({ unwatch }) => unwatch())
    this.watchedTransactions.clear()
  }

  async getTransactionReceipt(hash: Hash): Promise<TransactionReceipt> {
    try {
      return await this.client.getTransactionReceipt({ hash })
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  watchTransactions(onTransactions: (hashes: Hash[]) => Promise<void>) {
    return watchPendingTransactions(this.client, {
      onTransactions
    })
  }
} 