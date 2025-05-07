/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  // Transaction settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  TIMEOUT: 30000, // 30 seconds
  CONFIRMATIONS: 1,

  // Gas settings
  MAX_GAS_PRICE: 100000000000, // 100 gwei
  GAS_LIMIT_BUFFER: 1.2, // 20% buffer

  // Rate limiting
  DEFAULT_RATE_LIMIT: {
    MAX_REQUESTS: 100,
    TIME_WINDOW: 60000 // 1 minute
  },

  // Validation
  MIN_CONFIRMATIONS: 1,
  MAX_CONFIRMATIONS: 100
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_NOT_SUPPORTED: 'Network is not supported',
  INVALID_ADDRESS: 'Invalid address format',
  INVALID_AMOUNT: 'Amount must be greater than 0',
  CONTRACT_NOT_DEPLOYED: 'Contract is not deployed at the specified address',
  GAS_PRICE_TOO_HIGH: 'Gas price exceeds maximum allowed',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  TRANSACTION_FAILED: 'Transaction failed',
  VALIDATION_FAILED: 'Validation failed'
} as const;

/**
 * Event names
 */
export const EVENTS = {
  TRANSFER: 'Transfer',
  VALIDATION_UPDATED: 'ValidationUpdated',
  METADATA_UPDATED: 'MetadataUpdated',
  FUNDS_WITHDRAWN: 'FundsWithdrawn'
} as const; 