export const SDK_VERSION = '0.1.0';

export const SUPPORTED_CHAINS = {
  // Mainnets
  MAINNET: 1,
  POLYGON: 137,
  OPTIMISM: 10,
  ARBITRUM: 42161,
  BASE: 8453,
  GNOSIS: 100,
  
  // Testnets
  GOERLI: 5,
  SEPOLIA: 11155111,
  POLYGON_MUMBAI: 80001,
  OPTIMISM_GOERLI: 420,
  ARBITRUM_GOERLI: 421613,
  BASE_GOERLI: 84531,
  GNOSIS_CHIADO: 10200,
  
  // Local
  LOCALHOST: 1337
} as const;

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