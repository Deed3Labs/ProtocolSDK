import { ethers } from 'ethers';
import { NetworkError, ErrorCodes } from '../types/errors';
import { ValidationSystem } from './validation';

export interface NetworkStatus {
  isConnected: boolean;
  chainId: number;
  blockNumber: number;
  gasPrice: bigint;
  lastUpdate: number;
}

export interface NetworkMonitorOptions {
  checkInterval: number; // in milliseconds
  maxRetries: number;
  retryDelay: number;
}

export class NetworkMonitor {
  private provider: ethers.Provider;
  private status: NetworkStatus;
  private options: NetworkMonitorOptions;
  private checkInterval: NodeJS.Timeout | null = null;
  private listeners: Set<(status: NetworkStatus) => void> = new Set();

  constructor(
    provider: ethers.Provider,
    options: NetworkMonitorOptions = {
      checkInterval: 10000, // 10 seconds
      maxRetries: 3,
      retryDelay: 1000,
    }
  ) {
    this.provider = provider;
    this.options = options;
    this.status = {
      isConnected: false,
      chainId: 0,
      blockNumber: 0,
      gasPrice: BigInt(0),
      lastUpdate: 0,
    };
  }

  /**
   * Start monitoring network status
   */
  async start(): Promise<void> {
    if (this.checkInterval) {
      return;
    }

    await this.updateStatus();
    this.checkInterval = setInterval(() => this.updateStatus(), this.options.checkInterval);
  }

  /**
   * Stop monitoring network status
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Get current network status
   */
  getStatus(): NetworkStatus {
    return { ...this.status };
  }

  /**
   * Add a status change listener
   * @param listener Callback function for status changes
   */
  addListener(listener: (status: NetworkStatus) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove a status change listener
   * @param listener Callback function to remove
   */
  removeListener(listener: (status: NetworkStatus) => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Update network status
   * @throws NetworkError if network is unreachable
   */
  private async updateStatus(): Promise<void> {
    try {
      const [chainId, blockNumber, feeData] = await Promise.all([
        this.provider.getNetwork(),
        this.provider.getBlockNumber(),
        this.provider.getFeeData(),
      ]);

      const newStatus: NetworkStatus = {
        isConnected: true,
        chainId: Number(chainId.chainId),
        blockNumber,
        gasPrice: feeData.gasPrice || BigInt(0),
        lastUpdate: Date.now(),
      };

      const hasChanged = JSON.stringify(this.status) !== JSON.stringify(newStatus);
      this.status = newStatus;

      if (hasChanged) {
        this.notifyListeners();
      }
    } catch (error) {
      this.status.isConnected = false;
      this.status.lastUpdate = Date.now();
      this.notifyListeners();

      throw new NetworkError(
        'Failed to update network status',
        undefined,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(): void {
    const status = this.getStatus();
    this.listeners.forEach(listener => listener(status));
  }

  /**
   * Check if network is healthy
   * @throws NetworkError if network is unhealthy
   */
  async checkHealth(): Promise<void> {
    try {
      await this.provider.getNetwork();
    } catch (error) {
      throw new NetworkError(
        'Network is unreachable',
        undefined,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Wait for network to be ready
   * @param timeout Timeout in milliseconds
   * @throws NetworkError if network is not ready within timeout
   */
  async waitForReady(timeout: number = 30000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        await this.checkHealth();
        return;
      } catch {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new NetworkError(
      'Network not ready within timeout',
      undefined,
      { timeout }
    );
  }
} 