import '@types/jest';
import { ethers } from 'ethers';
import { TransactionManager, MonitoringSystem } from '../utils';
import { ChainId } from '../types/network';

// Test configuration
export const TEST_CONFIG = {
  // Use a local hardhat node or testnet RPC
  rpcUrl: process.env.TEST_RPC_URL || 'http://localhost:8545',
  // Test wallet private key (never use real private keys)
  privateKey: process.env.TEST_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  // Test contract addresses (to be deployed before tests)
  contracts: {
    deedNFT: process.env.TEST_DEED_NFT_ADDRESS || '0x0000000000000000000000000000000000000001',
    fundManager: process.env.TEST_FUND_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000002',
    validator: process.env.TEST_VALIDATOR_ADDRESS || '0x0000000000000000000000000000000000000003',
    validatorRegistry: process.env.TEST_VALIDATOR_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000004',
    metadataRenderer: process.env.TEST_METADATA_RENDERER_ADDRESS || '0x0000000000000000000000000000000000000005'
  },
  // Contract addresses for testing
  CONTRACT_ADDRESSES: {
    DEED_NFT: process.env.TEST_DEED_NFT_ADDRESS || '0x0000000000000000000000000000000000000001',
    FUND_MANAGER: process.env.TEST_FUND_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000002',
    VALIDATOR: process.env.TEST_VALIDATOR_ADDRESS || '0x0000000000000000000000000000000000000003',
    VALIDATOR_REGISTRY: process.env.TEST_VALIDATOR_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000004',
    METADATA_RENDERER: process.env.TEST_METADATA_RENDERER_ADDRESS || '0x0000000000000000000000000000000000000005'
  }
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

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getNetwork: jest.fn().mockResolvedValue({ chainId: ChainId.MAINNET }),
      getSigner: jest.fn().mockReturnValue({
        getAddress: jest.fn().mockResolvedValue('0x123...'),
        signMessage: jest.fn().mockResolvedValue('0x456...'),
      }),
    })),
    Wallet: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockReturnThis(),
      getAddress: jest.fn().mockResolvedValue('0x123...'),
    })),
    Contract: jest.fn().mockImplementation(() => ({
      address: '0x789...',
      interface: {
        parseLog: jest.fn().mockReturnValue({
          name: 'Transfer',
          args: ['0x123...', '0x456...', 1],
        }),
      },
    })),
  },
}));

// Global test timeout
jest.setTimeout(30000);

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Helper function to get test accounts
export async function getTestAccounts(): Promise<string[]> {
  const provider = new ethers.JsonRpcProvider();
  const accounts = await provider.listAccounts();
  return accounts.map(account => account.toString());
}

// Initialize test environment
export async function initializeTestEnv() {
  const provider = new ethers.JsonRpcProvider();
  const signer = await provider.getSigner();
  const accounts = await getTestAccounts();

  return {
    provider,
    signer,
    accounts,
  };
}

// Global test setup
beforeAll(() => {
  // Add any global setup here
});

// Global test teardown
afterAll(() => {
  // Add any global teardown here
}); 