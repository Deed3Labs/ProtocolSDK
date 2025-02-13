import dotenv from 'dotenv';
dotenv.config();

export const SDK_VERSION = '0.1.0';
export * from './ProtocolSDK';
export * from './types';
export * from './config/networks';
export * from './utils/errors';
export * from './contracts';
export * from './utils';
export * from './hooks';
export * from './types/config';
export * from './utils/config/networks';

// Re-export commonly used types
export type {
  DeedInfo,
  SubdivisionInfo,
  FractionInfo,
  ValidatorInfo
} from './types';

export type {
  TransactionState,
  TransactionStatus,
  TransactionOptions
} from './utils/transactions';

export { createProtocolSDK } from './ProtocolSDK'; 