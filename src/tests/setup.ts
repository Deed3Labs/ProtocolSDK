import { ethers } from 'ethers';
import { TransactionManager, MonitoringSystem } from '../utils';

// Test configuration
export const TEST_CONFIG = {
  // Use a local hardhat node or testnet RPC
  rpcUrl: process.env.TEST_RPC_URL || 'http://localhost:8545',
  // Test wallet private key (never use real private keys)
  privateKey: process.env.TEST_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  // Test contract addresses (to be deployed before tests)
  contracts: {
    deedNFT: process.env.TEST_DEED_NFT_ADDRESS,
    fundManager: process.env.TEST_FUND_MANAGER_ADDRESS,
    validator: process.env.TEST_VALIDATOR_ADDRESS,
    validatorRegistry: process.env.TEST_VALIDATOR_REGISTRY_ADDRESS,
    metadataRenderer: process.env.TEST_METADATA_RENDERER_ADDRESS,
  },
};

// Initialize test provider and signer
export const provider = new ethers.JsonRpcProvider(TEST_CONFIG.rpcUrl);
export const wallet = new ethers.Wallet(TEST_CONFIG.privateKey, provider);

// Initialize SDK components
export const transactionManager = new TransactionManager(provider);
export const monitoringSystem = new MonitoringSystem(provider, {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  confirmations: 1,
});

// Helper function to wait for transaction
export const waitForTransaction = async (txHash: string) => {
  const receipt = await provider.waitForTransaction(txHash);
  if (!receipt) throw new Error('Transaction receipt not found');
  return receipt;
};

// Helper function to get test contract
export const getTestContract = async (address: string, abi: any) => {
  return new ethers.Contract(address, abi, wallet);
};

// Test utilities
export async function setupTestEnvironment() {
  // Create provider
  const provider = new ethers.JsonRpcProvider(TEST_CONFIG.rpcUrl);
  
  // Create wallet
  const wallet = new ethers.Wallet(TEST_CONFIG.privateKey, provider);
  
  // Create transaction manager
  const transactionManager = new TransactionManager(provider);

  return {
    provider,
    wallet,
    transactionManager,
    config: TEST_CONFIG
  };
}

// Helper function to get test accounts
export async function getTestAccounts(provider: ethers.JsonRpcProvider): Promise<string[]> {
  const accounts = await provider.listAccounts();
  return accounts;
}

// Helper function to reset test environment
export async function resetTestEnvironment(provider: ethers.Provider) {
  // Add any cleanup logic here
  // For example, resetting contract state or clearing test data
}

// Mock ethers provider
jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  ethers: {
    ...jest.requireActual('ethers').ethers,
    providers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({
        getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
        getBlockNumber: jest.fn().mockResolvedValue(1000000),
      })),
    },
    Contract: jest.fn().mockImplementation(() => ({
      // Add mock contract methods here
    })),
  },
}));

// Global test setup
beforeAll(() => {
  // Add any global setup here
});

// Global test teardown
afterAll(() => {
  // Add any global teardown here
}); 