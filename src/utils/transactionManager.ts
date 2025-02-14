import { 
  type PublicClient,
  type Hash,
  type TransactionReceipt,
  type TransactionRequest,
  waitForTransactionReceipt,
  watchPendingTransactions,
  watchBlocks
} from 'viem'
import { ProtocolError, ErrorType } from './errors'
import { TransactionEventCallbacks } from '../types/transactions'

export class TransactionManager {
  private watchedTransactions: Map<Hash, {
    unwatch: () => void;
    callbacks: TransactionEventCallbacks;
  }> = new Map()

  constructor(private publicClient: PublicClient) {}

  async waitForTransaction(
    hash: Hash,
    confirmations: number = 1
  ): Promise<TransactionReceipt> {
    try {
      return await waitForTransactionReceipt(this.publicClient, {
        hash,
        confirmations
      })
    } catch (error) {
      throw ProtocolError.fromError(error)
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

    const unwatchPending = watchPendingTransactions(this.publicClient, {
      onTransactions: async (hashes) => {
        if (hashes.includes(hash)) {
          callbacks.onPending?.()
        }
      }
    })

    let confirmedBlocks = 0
    const unwatchBlocks = watchBlocks(this.publicClient, {
      onBlock: async () => {
        try {
          const receipt = await this.publicClient.getTransactionReceipt({ hash })
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
      return await this.publicClient.getTransactionReceipt({ hash })
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }
} 