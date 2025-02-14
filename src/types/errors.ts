import { ErrorType } from '../utils/errors'

export enum SDKErrorType {
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR'
}

export class SDKError extends Error {
  constructor(
    message: string,
    public type: SDKErrorType,
    public originalError?: any
  ) {
    super(message);
  }
}

export enum ERROR_CODES {
  INVALID_CONFIG = 'INVALID_CONFIG',
  INVALID_NETWORK = 'INVALID_NETWORK',
  NETWORK_SWITCH_FAILED = 'NETWORK_SWITCH_FAILED',
  CONTRACT_CALL_FAILED = 'CONTRACT_CALL_FAILED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED'
}

export interface SDKErrorDetails {
  type: ErrorType
  message: string
  originalError?: unknown
}

export interface TransactionError extends SDKErrorDetails {
  hash?: string
  receipt?: unknown
} 