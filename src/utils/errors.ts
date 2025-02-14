import { BaseError } from 'viem'

export enum ErrorType {
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  WALLET_CONNECTION = 'WALLET_CONNECTION',
  CONTRACT_INTERACTION = 'CONTRACT_INTERACTION',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  NETWORK_MISMATCH = 'NETWORK_MISMATCH',
  INVALID_CONFIG = 'INVALID_CONFIG',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class SDKError extends Error {
  constructor(
    message: string,
    public code: ERROR_CODES,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'SDKError';
  }
}

export class ProtocolError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'ProtocolError'
  }

  static fromError(error: unknown): ProtocolError {
    if (error instanceof ProtocolError) {
      return error
    }

    if (error instanceof BaseError) {
      return new ProtocolError(
        ErrorType.CONTRACT_ERROR,
        error.message,
        error
      )
    }

    return new ProtocolError(
      ErrorType.UNKNOWN_ERROR,
        error instanceof Error ? error.message : 'Unknown error',
        error
    )
  }
}

// Export error codes for backward compatibility
export const ERROR_CODES = {
  CONTRACT_ERROR: ErrorType.CONTRACT_ERROR,
  VALIDATION_ERROR: ErrorType.VALIDATION_ERROR,
  NETWORK_ERROR: ErrorType.NETWORK_ERROR,
  TRANSACTION_ERROR: ErrorType.TRANSACTION_ERROR,
  WALLET_CONNECTION: ErrorType.WALLET_CONNECTION,
  CONTRACT_INTERACTION: ErrorType.CONTRACT_INTERACTION,
  TRANSACTION_FAILED: ErrorType.TRANSACTION_FAILED,
  NETWORK_MISMATCH: ErrorType.NETWORK_MISMATCH,
  INVALID_CONFIG: ErrorType.INVALID_CONFIG
} as const

export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_PROVIDER]: 'Invalid provider configuration',
  [ERROR_CODES.CONTRACT_NOT_FOUND]: 'Contract not found at address',
  [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized operation',
  [ERROR_CODES.VALIDATION_FAILED]: 'Validation failed',
  [ERROR_CODES.NETWORK_SWITCH_FAILED]: 'Failed to switch to the requested network',
  [ERROR_CODES.UNSUPPORTED_NETWORK]: 'Network not supported by the SDK'
} as const;

export enum ContractErrorType {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS'
}

export class ContractError extends Error {
  constructor(
    public type: ContractErrorType,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ContractError';
  }
}

export class ErrorHandler {
  constructor(private provider?: ethers.providers.Provider) {}

  async handleError(error: any): Promise<SDKError> {
    if (error instanceof SDKError) return error;
    
    // Handle provider errors
    if (error.code && typeof error.code === 'string') {
      return new SDKError(
        error.message || ERROR_MESSAGES[error.code] || 'Unknown provider error',
        error.code,
        error.details
      );
    }

    // Handle contract errors
    if (error.reason) {
      return new SDKError(
        error.reason,
        ERROR_CODES.CONTRACT_ERROR,
        ErrorType.CONTRACT_ERROR,
        { originalError: error }
      );
    }

    return new SDKError(
      error.message || 'Unknown error',
      ERROR_CODES.UNKNOWN_ERROR,
      ErrorType.UNKNOWN_ERROR
    );
  }
} 