export class SDKError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'SDKError';
  }
}

export class TransactionError extends SDKError {
  constructor(message: string, public txHash?: string, details?: any) {
    super(message, 'TRANSACTION_ERROR', details);
    this.name = 'TransactionError';
  }
}

export class ValidationError extends SDKError {
  constructor(message: string, public field?: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends SDKError {
  constructor(message: string, public network?: string, details?: any) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ContractError extends SDKError {
  constructor(message: string, public contractAddress?: string, details?: any) {
    super(message, 'CONTRACT_ERROR', details);
    this.name = 'ContractError';
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