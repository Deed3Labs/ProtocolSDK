export * from './contracts';
export * from './constants';

/**
 * Configuration types
 */
export interface Config {
  /** Maximum number of retries for failed transactions */
  maxRetries?: number;
  /** Delay between retries in milliseconds */
  retryDelay?: number;
  /** Transaction timeout in milliseconds */
  timeout?: number;
  /** Number of confirmations to wait for */
  confirmations?: number;
  /** Maximum gas price in wei */
  maxGasPrice?: number;
  /** Gas limit buffer multiplier */
  gasLimitBuffer?: number;
  /** Rate limiting configuration */
  rateLimit?: {
    /** Maximum number of requests */
    maxRequests: number;
    /** Time window in milliseconds */
    timeWindow: number;
  };
}

/**
 * Default configuration
 */
export const defaultConfig: Config = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  confirmations: 1,
  maxGasPrice: 100000000000,
  gasLimitBuffer: 1.2,
  rateLimit: {
    maxRequests: 100,
    timeWindow: 60000
  }
}; 