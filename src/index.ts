// Core SDK
export { ProtocolSDK } from './ProtocolSDK'

// Config and Types
export type {
  NetworkConfig,
  ContractAddresses,
  WalletConfig
} from './config/types'

// Networks and Constants
export { NETWORKS } from './config/networks'
export { SUPPORTED_CHAINS } from './config/constants'

// Utils
export {
  WalletManager,
  TransactionManager,
  EventManager,
  NetworkMonitor,
  TransactionQueue,
  // Error utilities
  ErrorHandler,
  ErrorType,
  ERROR_CODES,
  ERROR_MESSAGES,
  ProtocolError
} from './utils'

// Transaction types
export type { TransactionOptions } from './utils/transactions'

// React hooks
export { useProtocolSDK } from './hooks/useProtocolSDK'

// Export everything needed from the SDK
export * from './ProtocolSDK'
export * from './types'
export * from './config/networks'
export * from './config/constants'
export * from './utils'

// Re-export commonly used types
export type {
  DeedInfo,
  SubdivisionInfo,
  FractionInfo,
  ValidatorInfo
} from './types';

export { createProtocolSDK } from './ProtocolSDK'

// Change this import:
// from: import { ... } from './utils/config/networks'
// to:

// Export everything needed from the SDK
export * from './ProtocolSDK'
export * from './types'
export * from './config/networks'
export * from './config/constants'
export * from './utils' 