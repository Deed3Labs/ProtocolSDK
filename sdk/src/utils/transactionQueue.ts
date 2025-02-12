import { ethers } from 'ethers';
import { TransactionResponse, TransactionReceipt } from '@ethersproject/abstract-provider';
import { SDKError, ERROR_CODES } from './errors';

interface QueuedTransaction {
  id: string;
  response: TransactionResponse;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  maxRetries: number;
  callbacks?: TransactionEventCallbacks;
}

export class TransactionQueue {
  private queue: Map<string, ethers.ContractTransaction>;
  private processing: boolean = false;

  constructor() {
    this.queue = new Map();
  }

  async addTransaction(tx: ethers.ContractTransaction) {
    this.queue.set(tx.hash, tx);
    if (!this.processing) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.size === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const [hash, tx] = Array.from(this.queue.entries())[0];
    
    try {
      await tx.wait();
      this.queue.delete(hash);
    } catch (error) {
      console.error(`Transaction ${hash} failed:`, error);
      this.queue.delete(hash);
    }

    await this.processQueue();
  }

  getQueueStatus() {
    return {
      pending: this.queue.size,
      processing: this.processing
    };
  }

  clearQueue() {
    this.queue.clear();
    this.processing = false;
  }
} 