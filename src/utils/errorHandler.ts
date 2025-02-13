import { ethers } from 'ethers';
import { ERROR_CODES } from '../config/constants';
import { ProtocolError } from './errors';
import { providers } from 'ethers';
import { SDKErrorDetails } from '../types/errors';

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export enum ErrorType {
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class ErrorHandler {
  constructor(private provider: providers.Provider) {}

  handleError(error: any): SDKErrorDetails {
    // Handle different error types
    if (error.code === 'NETWORK_ERROR') {
      return {
        code: ERROR_CODES.INVALID_NETWORK,
        message: 'Network connection failed'
      };
    }
    // Add more error handling logic
    return {
      code: ERROR_CODES.CONTRACT_CALL_FAILED,
      message: error.message || 'Unknown error occurred'
    };
  }

  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    config: RetryConfig
  ): Promise<T> {
    let lastError: Error;
    let delay = config.initialDelay;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        if (attempt === config.maxAttempts) {
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(
          delay * (config.backoffFactor || 2),
          config.maxDelay || 30000
        );
      }
    }

    throw lastError!;
  }

  private isNonceError(error: any): boolean {
    return error.message?.includes('nonce') || error.message?.includes('replacement transaction underpriced');
  }

  private async handleNonceError(error: any) {
    const signer = this.provider instanceof ethers.providers.Web3Provider 
      ? this.provider.getSigner()
      : null;
    
    if (!signer) throw error;

    const address = await signer.getAddress();
    const nonce = await this.provider.getTransactionCount(address);
    
    return { nonce };
  }

  private isGasError(error: any): boolean {
    return error.message?.includes('gas') || error.message?.includes('fee');
  }

  private async handleGasError(error: any) {
    const gasPrice = await this.provider.getGasPrice();
    return {
      gasPrice: gasPrice.mul(12).div(10) // Increase by 20%
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