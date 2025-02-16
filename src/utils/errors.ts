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
  UNAUTHORIZED = 'UNAUTHORIZED',
  INITIALIZATION_ERROR = 'INITIALIZATION_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  IPFS_ERROR = 'IPFS_ERROR'
}

export class SDKError extends Error {
  constructor(
    message: string,
    public code: typeof ERROR_CODES[keyof typeof ERROR_CODES],
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'SDKError'
  }
}

export class ProtocolError extends Error {
  constructor(
    message: string,
    public code: ErrorType,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ProtocolError'
  }

  static fromError(error: unknown): ProtocolError {
    if (error instanceof ProtocolError) return error
    return new ProtocolError(
      error instanceof Error ? error.message : String(error),
      ErrorType.NETWORK_ERROR // Changed to an existing ErrorType
    )
  }
}

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
  [ERROR_CODES.INVALID_CONFIG]: 'Invalid configuration',
  [ERROR_CODES.CONTRACT_ERROR]: 'Contract operation failed',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error occurred',
  [ERROR_CODES.VALIDATION_ERROR]: 'Validation failed',
  [ERROR_CODES.TRANSACTION_ERROR]: 'Transaction error occurred',
  [ERROR_CODES.WALLET_CONNECTION]: 'Wallet connection failed',
  [ERROR_CODES.CONTRACT_INTERACTION]: 'Contract interaction failed',
  [ERROR_CODES.TRANSACTION_FAILED]: 'Transaction failed',
  [ERROR_CODES.NETWORK_MISMATCH]: 'Network mismatch detected'
} as const

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
    super(message)
    this.name = 'ContractError'
  }
} 