import { type Hash } from 'viem'
import { ProtocolError, ErrorType } from './errors'

interface QueuedTransaction {
  hash: Hash
  status: 'pending' | 'success' | 'failed'
  retries: number
}

export interface QueueStatus {
  pending: number
  completed: number
  failed: number
}

export class TransactionQueue {
  private queue: Map<Hash, QueuedTransaction> = new Map()
  private maxRetries: number = 3

  addTransaction(hash: Hash): void {
    if (this.queue.has(hash)) {
      throw new ProtocolError(
        `Transaction ${hash} already exists in queue`,
        ErrorType.TRANSACTION_ERROR
      )
    }

    this.queue.set(hash, {
      hash,
      status: 'pending',
      retries: 0
    })
  }

  updateStatus(hash: Hash, status: 'success' | 'failed'): void {
    const tx = this.queue.get(hash)
    if (!tx) {
      throw new ProtocolError(
        `Transaction ${hash} not found in queue`,
        ErrorType.TRANSACTION_ERROR
      )
    }

    tx.status = status
    this.queue.set(hash, tx)
  }

  incrementRetry(hash: Hash): boolean {
    const tx = this.queue.get(hash)
    if (!tx) {
      throw new ProtocolError(
        `Transaction ${hash} not found in queue`,
        ErrorType.TRANSACTION_ERROR
      )
    }

    tx.retries++
    this.queue.set(hash, tx)
    return tx.retries < this.maxRetries
  }

  clear(): void {
    this.queue.clear()
  }

  getQueueStatus(): QueueStatus {
    let pending = 0
    let completed = 0
    let failed = 0

    this.queue.forEach(tx => {
      switch (tx.status) {
        case 'pending':
          pending++
          break
        case 'success':
          completed++
          break
        case 'failed':
          failed++
          break
      }
    })

    return {
      pending,
      completed,
      failed
    }
  }
} 