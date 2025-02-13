import { ethers } from 'ethers';

export enum ErrorType {
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR'
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

export enum ErrorType {
  WALLET_CONNECTION = 'WALLET_CONNECTION',
  CONTRACT_INTERACTION = 'CONTRACT_INTERACTION',
  TRANSACTION = 'TRANSACTION',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION'
}

export class ProtocolError extends Error {
  type: ErrorType;
  details?: any;

  constructor(type: ErrorType, message: string, details?: any) {
    super(message);
    this.type = type;
    this.details = details;
    this.name = 'ProtocolError';
  }

  static fromError(error: any): ProtocolError {
    if (error instanceof ProtocolError) return error;

    // Handle common Web3 errors
    if (error.code === 4001) {
      return new ProtocolError(
        ErrorType.WALLET_CONNECTION,
        'User rejected the transaction'
      );
    }

    if (error.code === -32603) {
      return new ProtocolError(
        ErrorType.TRANSACTION,
        'Transaction failed. Please check your balance and gas settings'
      );
    }

    return new ProtocolError(
      ErrorType.CONTRACT_INTERACTION,
      error.message || 'Unknown error occurred'
    );
  }
}

export const ERROR_CODES = {
  // Configuration Errors
  INVALID_CONFIG: 'INVALID_CONFIG',
  INVALID_PROVIDER: 'INVALID_PROVIDER',
  
  // Network Errors
  INVALID_NETWORK: 'INVALID_NETWORK',
  NETWORK_SWITCH_FAILED: 'NETWORK_SWITCH_FAILED',
  UNSUPPORTED_NETWORK: 'UNSUPPORTED_NETWORK',
  
  // Contract Errors
  CONTRACT_NOT_FOUND: 'CONTRACT_NOT_FOUND',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  GAS_ESTIMATION_FAILED: 'GAS_ESTIMATION_FAILED',
  
  // Authorization Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Validation Errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
  
  // Asset Errors
  DEED_NOT_FOUND: 'DEED_NOT_FOUND',
  FRACTION_NOT_FOUND: 'FRACTION_NOT_FOUND',
  INVALID_ASSET_TYPE: 'INVALID_ASSET_TYPE',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

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