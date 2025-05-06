import { ethers } from 'ethers';
import { TransactionResult } from './transactionManager';
import { SDKError, TransactionError, ErrorCodes } from './errors';

export interface MonitoringOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  confirmations?: number;
}

export interface MonitoringEvent {
  type: 'transaction' | 'event' | 'error';
  timestamp: number;
  data: any;
}

export class MonitoringSystem {
  private events: MonitoringEvent[] = [];
  private options: MonitoringOptions;
  private provider: ethers.Provider;

  constructor(provider: ethers.Provider, options: MonitoringOptions = {}) {
    this.provider = provider;
    this.options = {
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 30000,
      confirmations: options.confirmations || 1,
    };
  }

  /**
   * Monitor a transaction
   * @param txHash Transaction hash to monitor
   * @returns Promise<TransactionResult>
   */
  async monitorTransaction(txHash: string): Promise<TransactionResult> {
    try {
      const startTime = Date.now();
      let retries = 0;

      while (retries < this.options.maxRetries!) {
        try {
          const receipt = await this.provider.waitForTransaction(
            txHash,
            this.options.confirmations,
            this.options.timeout
          );

          if (receipt) {
            const result: TransactionResult = {
              hash: txHash,
              from: receipt.from,
              to: receipt.to ?? '',
              status: receipt.status === 1 ? 'confirmed' : 'failed',
              receipt,
            };

            this.logEvent('transaction', {
              txHash,
              status: result.status,
              duration: Date.now() - startTime,
            });

            return result;
          }
        } catch (error) {
          retries++;
          if (retries === this.options.maxRetries) {
            throw new TransactionError(
              'Transaction monitoring failed',
              txHash,
              { error, retries }
            );
          }
          await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
        }
      }

      throw new TransactionError(
        'Transaction monitoring timeout',
        txHash,
        { timeout: this.options.timeout }
      );
    } catch (error) {
      this.logEvent('error', {
        txHash,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Monitor contract events
   * @param contract Contract instance
   * @param eventName Event name to monitor
   * @param callback Callback function for event handling
   */
  monitorContractEvent(
    contract: ethers.Contract,
    eventName: string,
    callback: (event: ethers.ContractEvent) => void
  ): void {
    contract.on(eventName, (event: ethers.ContractEvent) => {
      this.logEvent('event', {
        contract: contract.address,
        eventName,
        event,
      });
      callback(event);
    });
  }

  /**
   * Get monitoring events
   * @returns MonitoringEvent[]
   */
  getEvents(): MonitoringEvent[] {
    return this.events;
  }

  /**
   * Clear monitoring events
   */
  clearEvents(): void {
    this.events = [];
  }

  private logEvent(type: MonitoringEvent['type'], data: any): void {
    this.events.push({
      type,
      timestamp: Date.now(),
      data,
    });
  }
} 