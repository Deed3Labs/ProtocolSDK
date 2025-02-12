export const SUPPORTED_NETWORKS = {
  MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    contracts: {
      deedNFT: '0x...',
      subdivide: '0x...',
      fractionalize: '0x...',
      validatorRegistry: '0x...'
    }
  },
  TESTNET: {
    chainId: 5,
    name: 'Goerli Testnet',
    contracts: {
      // Add testnet addresses
    }
  }
} as const;

export const SUPPORTED_CHAINS = {
  MAINNET: 1,
  GOERLI: 5,
  LOCALHOST: 1337
} as const;

export const DEFAULT_GAS_LIMIT = 500000;
export const DEFAULT_CONFIRMATIONS = 1;
export const GAS_PRICE_INCREASE_FACTOR = 1.2;

export const ERROR_MESSAGES = {
  INVALID_PROVIDER: 'Invalid provider configuration',
  CONTRACT_NOT_FOUND: 'Contract not found at address',
  UNAUTHORIZED: 'Unauthorized operation',
  VALIDATION_FAILED: 'Validation failed'
} as const;

export const NETWORK_CONFIGS = {
  [SUPPORTED_NETWORKS.MAINNET]: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    contracts: {
      deedNFT: '0x...',
      subdivide: '0x...',
      fractionalize: '0x...',
      validatorRegistry: '0x...',
      fundManager: '0x...'
    }
  },
  [SUPPORTED_NETWORKS.TESTNET]: {
    // Testnet config
  }
} as const; 