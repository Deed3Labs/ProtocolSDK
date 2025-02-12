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
  INVALID_PROVIDER: 'INVALID_PROVIDER',
  CONTRACT_NOT_FOUND: 'CONTRACT_NOT_FOUND',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
  DEED_NOT_FOUND: 'DEED_NOT_FOUND',
  INVALID_ASSET_TYPE: 'INVALID_ASSET_TYPE',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  FRACTION_NOT_FOUND: 'FRACTION_NOT_FOUND',
  INVALID_NETWORK: 'INVALID_NETWORK',
  GAS_ESTIMATION_FAILED: 'GAS_ESTIMATION_FAILED'
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

export class SDKError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
  }
} 