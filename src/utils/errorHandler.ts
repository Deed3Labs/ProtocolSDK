import { type PublicClient } from 'viem'
import { ProtocolError, ErrorType } from './errors'

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export class ErrorHandler {
  constructor(private client: PublicClient) {}

  async handleError(error: unknown): Promise<ProtocolError> {
    if (!(error instanceof Error)) {
      return ProtocolError.fromError(error)
    }

    try {
      if (this.isNonceError(error)) {
        const result = await this.handleNonceError(error)
        return new ProtocolError(
          `Nonce error occurred: ${error.message}`,
          ErrorType.TRANSACTION_FAILED,
          { originalError: error, ...result }
        )
      }

      if (this.isGasError(error)) {
        const result = await this.handleGasError()
        return new ProtocolError(
          `Gas estimation failed: ${error.message}`,
          ErrorType.TRANSACTION_FAILED,
          { originalError: error, ...result }
        )
      }

      if (this.isNetworkError(error)) {
        await this.handleNetworkError(error)
      }

      return ProtocolError.fromError(error)
    } catch (e) {
      return ProtocolError.fromError(e)
    }
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig
  ): Promise<T> {
    let lastError: Error | null = null
    let delay = config.initialDelay

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        
        if (attempt === config.maxAttempts) break
        
        await new Promise(resolve => setTimeout(resolve, delay))
        delay = Math.min(
          delay * (config.backoffFactor || 2),
          config.maxDelay || 30000
        )
      }
    }

    throw await this.handleError(lastError)
  }

  private isNonceError(error: any): boolean {
    return error.message?.includes('nonce') || error.message?.includes('replacement transaction underpriced');
  }

  private async handleNonceError(error: any) {
    try {
      const nonce = await this.client.getTransactionCount({ 
        address: error.account as `0x${string}`
      })
      return { nonce }
    } catch {
      throw error
    }
  }

  private isGasError(error: any): boolean {
    return error.message?.includes('gas') || error.message?.includes('fee');
  }

  private async handleGasError() {
    const gasPrice = await this.client.getGasPrice();
    return {
      gasPrice: BigInt(Math.floor(Number(gasPrice) * 1.2)) // Increase by 20%
    };
  }

  private isNetworkError(error: any): boolean {
    return error.message?.includes('network') || error.message?.includes('connection');
  }

  private async handleNetworkError(error: any) {
    // Implement network retry logic
    throw error;
  }
} 