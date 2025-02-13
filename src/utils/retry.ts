import { SDKError, ERROR_CODES } from './errors';

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay?: number;
  backoffFactor?: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error;
  let delay = retryConfig.initialDelay;

  for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === retryConfig.maxAttempts) {
        throw new SDKError(
          `Operation failed after ${attempt} attempts: ${lastError.message}`,
          ERROR_CODES.OPERATION_FAILED,
          { originalError: lastError }
        );
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(
        delay * (retryConfig.backoffFactor || 1),
        retryConfig.maxDelay || Infinity
      );
    }
  }

  throw lastError;
} 