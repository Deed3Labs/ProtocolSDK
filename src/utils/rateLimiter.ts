import { SDKError, ErrorCodes } from '../types/errors';

export interface RateLimitOptions {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

export class RateLimiter {
  private requests: number[] = [];
  private options: RateLimitOptions;

  constructor(options: RateLimitOptions) {
    this.options = options;
  }

  /**
   * Check if a request is allowed
   * @throws SDKError if rate limit is exceeded
   */
  checkRateLimit(): void {
    const now = Date.now();
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.options.timeWindow
    );

    if (this.requests.length >= this.options.maxRequests) {
      throw new SDKError(
        'Rate limit exceeded',
        ErrorCodes.NETWORK.RPC_ERROR,
        {
          maxRequests: this.options.maxRequests,
          timeWindow: this.options.timeWindow,
          currentRequests: this.requests.length,
        }
      );
    }

    this.requests.push(now);
  }

  /**
   * Reset rate limit counter
   */
  reset(): void {
    this.requests = [];
  }

  /**
   * Get current request count
   */
  getCurrentCount(): number {
    return this.requests.length;
  }

  /**
   * Get time until next available request
   */
  getTimeUntilNext(): number {
    if (this.requests.length < this.options.maxRequests) {
      return 0;
    }

    const oldestRequest = this.requests[0];
    const timeWindowEnd = oldestRequest + this.options.timeWindow;
    return Math.max(0, timeWindowEnd - Date.now());
  }
} 