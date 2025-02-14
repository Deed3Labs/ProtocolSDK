import { type Hash } from 'viem'
import { ProtocolError, ErrorType } from './errors'

interface QueuedTransaction {
  hash: Hash
  status: 'pending' | 'success' | 'failed'
  retries: number
}

export class TransactionQueue {
  private queue: Map<Hash, QueuedTransaction> = new Map()
  private maxRetries: number = 3

  addTransaction(hash: Hash): void {
    this.queue.set(hash, {
      hash,
      status: 'pending',
      retries: 0
    })
  }

  updateStatus(hash: Hash, status: 'success' | 'failed'): void {
    const tx = this.queue.get(hash)
    if (tx) {
      tx.status = status
      this.queue.set(hash, tx)
    }
  }

  clear(): void {
    this.queue.clear()
  }
} 