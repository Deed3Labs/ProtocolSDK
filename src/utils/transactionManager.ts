import { ethers } from 'ethers';

export interface TransactionOptions {
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  nonce?: number;
  value?: bigint;
}

export interface TransactionResult {
  hash: string;
  from: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
  receipt?: ethers.TransactionReceipt;
  error?: Error;
}

export class TransactionManager {
  private provider: ethers.Provider;
  private maxRetries: number;
  private retryDelay: number;

  constructor(provider: ethers.Provider, maxRetries = 3, retryDelay = 1000) {
    this.provider = provider;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  /**
   * Sends a transaction and waits for confirmation
   * @param transaction The transaction to send
   * @param options Optional transaction parameters
   * @returns Promise<TransactionResult>
   */
  async sendTransaction(
    transaction: ethers.ContractTransactionResponse,
    options: TransactionOptions = {}
  ): Promise<TransactionResult> {
    try {
      // Send transaction
      const tx = await transaction;
      const result: TransactionResult = {
        hash: tx.hash,
        from: tx.from ?? '',
        to: tx.to ?? '',
        status: 'pending'
      };

      // Wait for confirmation with retries
      let retries = 0;
      while (retries < this.maxRetries) {
        try {
          const receipt = await tx.wait();
          if (receipt) {
            result.status = receipt.status === 1 ? 'confirmed' : 'failed';
            result.receipt = receipt;
          }
          return result;
        } catch (error) {
          retries++;
          if (retries === this.maxRetries) {
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }

      return result;
    } catch (error) {
      return {
        hash: '',
        from: '',
        to: '',
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  /**
   * Gets the status of a transaction
   * @param hash Transaction hash
   * @returns Promise<TransactionResult>
   */
  async getTransactionStatus(hash: string): Promise<TransactionResult> {
    try {
      const tx = await this.provider.getTransaction(hash);
      if (!tx) {
        throw new Error('Transaction not found');
      }

      const receipt = await this.provider.getTransactionReceipt(hash);
      return {
        hash: tx.hash,
        from: tx.from ?? '',
        to: tx.to ?? '',
        status: receipt ? (receipt.status === 1 ? 'confirmed' : 'failed') : 'pending',
        receipt: receipt ?? undefined
      };
    } catch (error) {
      return {
        hash,
        from: '',
        to: '',
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }

  /**
   * Gets the current gas price
   * @returns Promise<bigint>
   */
  async getGasPrice(): Promise<bigint> {
    try {
      return await this.provider.getFeeData().then(data => data.gasPrice ?? BigInt(0));
    } catch (error) {
      throw new Error(`Failed to get gas price: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 