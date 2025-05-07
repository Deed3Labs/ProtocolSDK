/**
 * Error handling system for the Protocol SDK
 * 
 * This module provides a comprehensive error handling system with the following features:
 * 1. Hierarchical error types for different categories of errors
 * 2. Context and details for better error tracking
 * 3. Error codes for programmatic error handling
 * 4. Type-safe error creation and handling
 * 
 * Error Hierarchy:
 * - ProtocolError (Base error class)
 *   ├── SDKError (SDK-specific errors)
 *   │   ├── TransactionError (Transaction-related errors)
 *   │   ├── ValidationError (Validation-related errors)
 *   │   ├── NetworkError (Network-related errors)
 *   │   └── ContractError (Contract-related errors)
 *   │       ├── DeedNFTError
 *   │       ├── FundManagerError
 *   │       ├── ValidatorError
 *   │       ├── ValidatorRegistryError
 *   │       └── MetadataRendererError
 *   ├── AuthorizationError (Authorization-related errors)
 *   └── ConfigurationError (Configuration-related errors)
 * 
 * Usage:
 * ```typescript
 * // Basic error
 * throw new ProtocolError('Something went wrong', { context: 'value' });
 * 
 * // SDK error with code
 * throw new SDKError('SDK error', 'SDK_ERROR_CODE', { details: 'value' });
 * 
 * // Validation error
 * throw new ValidationError('Invalid input', 'fieldName', { value: 'invalid' });
 * 
 * // Contract error
 * throw new ContractError('Contract error', '0x123...', { method: 'transfer' });
 * 
 * // Specific contract error
 * throw new DeedNFTError('Deed NFT error', { tokenId: 123 });
 * ```
 */

// Base error class
export class ProtocolError extends Error {
  constructor(message: string, public context?: Record<string, any>) {
    super(message);
    this.name = 'ProtocolError';
  }
}

// SDK specific errors
export class SDKError extends ProtocolError {
  constructor(message: string, public code: string, public details?: any) {
    super(message, { code, details });
    this.name = 'SDKError';
  }
}

// Transaction errors
export class TransactionError extends SDKError {
  constructor(message: string, public txHash?: string, details?: any) {
    super(message, 'TRANSACTION_ERROR', { txHash, ...details });
    this.name = 'TransactionError';
  }
}

// Validation errors
export class ValidationError extends SDKError {
  constructor(
    message: string,
    public field?: string,
    public context?: Record<string, any>
  ) {
    super(message, 'VALIDATION_ERROR', { field, ...context });
    this.name = 'ValidationError';
  }
}

// Network errors
export class NetworkError extends SDKError {
  constructor(message: string, public network?: string, details?: any) {
    super(message, 'NETWORK_ERROR', { network, ...details });
    this.name = 'NetworkError';
  }
}

// Contract errors
export class ContractError extends SDKError {
  constructor(message: string, public contractAddress?: string, details?: any) {
    super(message, 'CONTRACT_ERROR', { contractAddress, ...details });
    this.name = 'ContractError';
  }
}

// Authorization errors
export class AuthorizationError extends ProtocolError {
  constructor(message: string, public context?: Record<string, any>) {
    super(message, context);
    this.name = 'AuthorizationError';
  }
}

// Configuration errors
export class ConfigurationError extends ProtocolError {
  constructor(message: string, public context?: Record<string, any>) {
    super(message, context);
    this.name = 'ConfigurationError';
  }
}

// Specific contract errors
export class DeedNFTError extends ContractError {
  constructor(message: string, public context?: Record<string, any>) {
    super(message, undefined, context);
    this.name = 'DeedNFTError';
  }
}

export class FundManagerError extends ContractError {
  constructor(message: string, public context?: Record<string, any>) {
    super(message, undefined, context);
    this.name = 'FundManagerError';
  }
}

export class ValidatorError extends ContractError {
  constructor(message: string, public context?: Record<string, any>) {
    super(message, undefined, context);
    this.name = 'ValidatorError';
  }
}

export class ValidatorRegistryError extends ContractError {
  constructor(message: string, public context?: Record<string, any>) {
    super(message, undefined, context);
    this.name = 'ValidatorRegistryError';
  }
}

export class MetadataRendererError extends ContractError {
  constructor(message: string, public context?: Record<string, any>) {
    super(message, undefined, context);
    this.name = 'MetadataRendererError';
  }
}

// Error codes
export const ErrorCodes = {
  TRANSACTION: {
    FAILED: 'TX_FAILED',
    TIMEOUT: 'TX_TIMEOUT',
    INSUFFICIENT_GAS: 'TX_INSUFFICIENT_GAS',
    INVALID_NONCE: 'TX_INVALID_NONCE',
  },
  VALIDATION: {
    INVALID_ADDRESS: 'INVALID_ADDRESS',
    INVALID_AMOUNT: 'INVALID_AMOUNT',
    INVALID_PARAMETER: 'INVALID_PARAMETER',
  },
  NETWORK: {
    DISCONNECTED: 'NETWORK_DISCONNECTED',
    UNSUPPORTED_CHAIN: 'UNSUPPORTED_CHAIN',
    RPC_ERROR: 'RPC_ERROR',
  },
  CONTRACT: {
    NOT_DEPLOYED: 'CONTRACT_NOT_DEPLOYED',
    INVALID_ABI: 'INVALID_ABI',
    CALL_FAILED: 'CALL_FAILED',
  },
} as const; 