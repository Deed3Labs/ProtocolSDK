export const SDK_VERSION = '0.1.0';

export enum SUPPORTED_CHAINS {
  LOCALHOST = 8545,
  MAINNET = 1,
  OPTIMISM = 10,
  ARBITRUM = 42161,
  BASE = 8453,
  GNOSIS = 100,
  POLYGON = 137,
  // Test networks
  GOERLI = 5,
  SEPOLIA = 11155111,
  POLYGON_MUMBAI = 80001,
  OPTIMISM_GOERLI = 420,
  ARBITRUM_GOERLI = 421613,
  BASE_GOERLI = 84531,
  GNOSIS_CHIADO = 10200
}

export const DEFAULT_GAS_LIMIT = 500000;
export const DEFAULT_TIMEOUT = 60000;
export const DEFAULT_CONFIRMATIONS = 1;
export const GAS_PRICE_INCREASE_FACTOR = 1.2;

export const ERROR_MESSAGES = {
  INVALID_PROVIDER: 'Invalid provider configuration',
  CONTRACT_NOT_FOUND: 'Contract not found at address',
  UNAUTHORIZED: 'Unauthorized operation',
  VALIDATION_FAILED: 'Validation failed'
} as const;

export const ERROR_CODES = {
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  WALLET_CONNECTION: 'WALLET_CONNECTION',
  CONTRACT_INTERACTION: 'CONTRACT_INTERACTION',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  NETWORK_MISMATCH: 'NETWORK_MISMATCH',
  INVALID_CONFIG: 'INVALID_CONFIG'
} as const 