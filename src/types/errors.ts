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