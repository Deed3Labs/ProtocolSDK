import { ethers } from 'ethers';
import { TransactionError, ErrorCodes } from '../types/errors';
import { ValidationSystem } from './validation';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  data: string;
  nonce: number;
  gasLimit: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  timestamp: number;
}

export interface TransactionQueueOptions {
  maxConcurrent: number;
  maxRetries: number;
  retryDelay: number;
  confirmations: number;
  timeout: number;
}

export class TransactionQueue {
  private queue: Transaction[] = [];
  private processing: Set<string> = new Set();
  private options: TransactionQueueOptions;
  private provider: ethers.Provider;
  private signer: ethers.Signer;

  constructor(
    provider: ethers.Provider,
    signer: ethers.Signer,
    options: TransactionQueueOptions = {
      maxConcurrent: 3,
      maxRetries: 3,
      retryDelay: 1000,
      confirmations: 1,
      timeout: 300000, // 5 minutes
    }
  ) {
    this.provider = provider;
    this.signer = signer;
    this.options = options;
  }

  /**
   * Add a transaction to the queue
   * @param transaction Transaction to add
   * @returns Transaction hash
   */
  async add(transaction: Omit<Transaction, 'hash' | 'status' | 'confirmations' | 'timestamp'>): Promise<string> {
    try {
      // Validate transaction
      ValidationSystem.validateAddress(transaction.from);
      ValidationSystem.validateAddress(transaction.to);
      ValidationSystem.validateAmount(transaction.value);

      // Send transaction
      const tx = await this.signer.sendTransaction({
        to: transaction.to,
        value: transaction.value,
        data: transaction.data,
        nonce: transaction.nonce,
        gasLimit: transaction.gasLimit,
        maxFeePerGas: transaction.maxFeePerGas,
        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
      });

      // Add to queue
      const queuedTx: Transaction = {
        ...transaction,
        hash: tx.hash,
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now(),
      };

      this.queue.push(queuedTx);
      this.processQueue();

      return tx.hash;
    } catch (error) {
      throw new TransactionError(
        'Failed to add transaction to queue',
        undefined,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get transaction status
   * @param hash Transaction hash
   */
  async getStatus(hash: string): Promise<Transaction> {
    const transaction = this.queue.find(tx => tx.hash === hash);
    if (!transaction) {
      throw new TransactionError(
        'Transaction not found',
        hash
      );
    }

    try {
      const receipt = await this.provider.getTransactionReceipt(hash);
      if (receipt) {
        transaction.status = receipt.status ? 'confirmed' : 'failed';
        transaction.confirmations = Number(receipt.confirmations);
      }
    } catch (error) {
      // Ignore errors, return current status
    }

    return transaction;
  }

  /**
   * Get all transactions
   */
  getAll(): Transaction[] {
    return [...this.queue];
  }

  /**
   * Get pending transactions
   */
  getPending(): Transaction[] {
    return this.queue.filter(tx => tx.status === 'pending');
  }

  /**
   * Clear completed transactions
   */
  clearCompleted(): void {
    this.queue = this.queue.filter(tx => tx.status === 'pending');
  }

  /**
   * Process the transaction queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing.size >= this.options.maxConcurrent) {
      return;
    }

    const pending = this.queue.filter(tx => 
      tx.status === 'pending' && !this.processing.has(tx.hash)
    );

    for (const transaction of pending) {
      if (this.processing.size >= this.options.maxConcurrent) {
        break;
      }

      this.processing.add(transaction.hash);
      this.waitForConfirmation(transaction.hash).finally(() => {
        this.processing.delete(transaction.hash);
        this.processQueue();
      });
    }
  }

  /**
   * Wait for transaction confirmation
   * @param hash Transaction hash
   */
  private async waitForConfirmation(hash: string): Promise<void> {
    const startTime = Date.now();
    let retries = 0;

    while (retries < this.options.maxRetries) {
      try {
        const receipt = await this.provider.waitForTransaction(
          hash,
          this.options.confirmations,
          this.options.timeout
        );

        if (receipt) {
          const transaction = this.queue.find(tx => tx.hash === hash);
          if (transaction) {
            transaction.status = receipt.status ? 'confirmed' : 'failed';
            transaction.confirmations = Number(receipt.confirmations);
          }
        }

        return;
      } catch (error) {
        retries++;
        if (retries >= this.options.maxRetries) {
          const transaction = this.queue.find(tx => tx.hash === hash);
          if (transaction) {
            transaction.status = 'failed';
          }
          throw new TransactionError(
            'Transaction failed to confirm',
            hash,
            { error: error instanceof Error ? error.message : String(error) }
          );
        }
        await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
      }
    }
  }
} 