import { config } from 'dotenv';
import { jest } from '@jest/globals';
import { ethers } from 'ethers';
import { TransactionManager, MonitoringSystem } from '../utils';
import { ChainId, NetworkConfig } from '../types/network';
import { getContractAddresses } from '../config/contracts';
import { TEST_ABIS } from './constants/abis';

// Load environment variables from .env file
config();

// Add BigInt serialization support
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

// Standard test configuration
export const TEST_CONFIG = {
  rpcUrl: 'http://localhost:8545',
  privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  gas: {
    maxFeePerGas: BigInt(2000000000),
    maxPriorityFeePerGas: BigInt(1000000000),
    gasLimit: BigInt(3000000)
  },
  transaction: {
    confirmations: 1,
    timeout: 60000,
    retries: 3,
    retryDelay: 1000
  },
  contracts: {
    deedNFT: '0x0000000000000000000000000000000000000001',
    fundManager: '0x0000000000000000000000000000000000000002',
    validator: '0x0000000000000000000000000000000000000003',
    validatorRegistry: '0x0000000000000000000000000000000000000004',
    metadataRenderer: '0x0000000000000000000000000000000000000005'
  }
};

// Create mock provider and wallet
const mockProvider = {
  getNetwork: jest.fn().mockImplementation(() => Promise.resolve({ chainId: BigInt(ChainId.BASE_SEPOLIA), name: 'base-sepolia' })) as jest.Mock<() => Promise<ethers.Network>>,
  getSigner: jest.fn().mockImplementation(() => mockWallet) as jest.Mock<() => Promise<ethers.Signer>>,
  getFeeData: jest.fn().mockImplementation(() => Promise.resolve({
    maxFeePerGas: BigInt(2000000000),
    maxPriorityFeePerGas: BigInt(1000000000),
    gasPrice: BigInt(1000000000)
  })) as jest.Mock<() => Promise<ethers.FeeData>>,
  getTransactionCount: jest.fn().mockImplementation(() => Promise.resolve(1)) as jest.Mock<() => Promise<number>>,
  getBalance: jest.fn().mockImplementation(() => Promise.resolve(BigInt(1000000000000000000))) as jest.Mock<() => Promise<bigint>>,
  getCode: jest.fn().mockImplementation(() => Promise.resolve('0x')) as jest.Mock<() => Promise<string>>,
  getStorage: jest.fn().mockImplementation(() => Promise.resolve('0x')) as jest.Mock<() => Promise<string>>,
  getBlock: jest.fn().mockImplementation(() => Promise.resolve({
    number: 1,
    hash: '0x123',
    parentHash: '0x456',
    timestamp: 1234567890,
    transactions: []
  })) as jest.Mock<() => Promise<ethers.Block>>,
  getBlockNumber: jest.fn().mockImplementation(() => Promise.resolve(1)) as jest.Mock<() => Promise<number>>,
  getGasPrice: jest.fn().mockImplementation(() => Promise.resolve(BigInt(1000000000))) as jest.Mock<() => Promise<bigint>>,
  estimateGas: jest.fn().mockImplementation(() => Promise.resolve(BigInt(21000))) as jest.Mock<() => Promise<bigint>>,
  call: jest.fn().mockImplementation(() => Promise.resolve('0x')) as jest.Mock<() => Promise<string>>,
  broadcastTransaction: jest.fn().mockImplementation(() => Promise.resolve('0xabc')) as jest.Mock<() => Promise<string>>,
  waitForTransaction: jest.fn().mockImplementation(() => Promise.resolve({
    status: 1,
    transactionHash: '0xabc',
    blockNumber: 12345,
    blockHash: '0x789',
    confirmations: 1,
    to: '0x1234567890123456789012345678901234567890',
    from: '0x1234567890123456789012345678901234567890',
    contractAddress: null,
    transactionIndex: 0,
    gasUsed: BigInt(21000),
    logsBloom: '0x',
    logs: [{
      address: '0x1234567890123456789012345678901234567890',
      topics: ['0x0', '0x0', '0x0', '0x1'],
      data: '0x',
      blockNumber: 1,
      transactionHash: '0xabc',
      logIndex: 0,
      blockHash: '0x789'
    }]
  })) as jest.Mock<() => Promise<ethers.TransactionReceipt>>
} as unknown as ethers.JsonRpcProvider;

const mockWallet = {
  getAddress: jest.fn().mockImplementation(() => Promise.resolve('0x1234567890123456789012345678901234567890')) as jest.Mock<() => Promise<string>>,
  signMessage: jest.fn().mockImplementation(() => Promise.resolve('0x456')) as jest.Mock<() => Promise<string>>,
  provider: mockProvider,
  connect: jest.fn().mockImplementation(() => mockWallet) as jest.Mock<() => Promise<ethers.Signer>>,
  getNonce: jest.fn().mockImplementation(() => Promise.resolve(1)) as jest.Mock<() => Promise<number>>,
  populateCall: jest.fn().mockImplementation(() => Promise.resolve({})) as jest.Mock<() => Promise<ethers.TransactionRequest>>,
  populateTransaction: jest.fn().mockImplementation(() => Promise.resolve({})) as jest.Mock<() => Promise<ethers.TransactionRequest>>,
  estimateGas: jest.fn().mockImplementation(() => Promise.resolve(BigInt(21000))) as jest.Mock<() => Promise<bigint>>,
  call: jest.fn().mockImplementation(() => Promise.resolve('0x')) as jest.Mock<() => Promise<string>>,
  sendTransaction: jest.fn().mockImplementation(() => Promise.resolve({
    hash: '0xabc',
    getAddress: jest.fn().mockImplementation(() => Promise.resolve('0x1234567890123456789012345678901234567890')),
    wait: jest.fn().mockImplementation(() => Promise.resolve({
      status: 1,
      transactionHash: '0xabc',
      blockNumber: 12345,
      blockHash: '0x789',
      confirmations: 1,
      to: '0x1234567890123456789012345678901234567890',
      from: '0x1234567890123456789012345678901234567890',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: BigInt(21000),
      logsBloom: '0x',
      logs: [{
        address: '0x1234567890123456789012345678901234567890',
        topics: ['0x0', '0x0', '0x0', '0x1'],
        data: '0x',
        blockNumber: 1,
        transactionHash: '0xabc',
        logIndex: 0,
        blockHash: '0x789'
      }]
    }))
  })) as jest.Mock<() => Promise<ethers.TransactionResponse>>
} as unknown as ethers.Signer;

// Initialize test provider and signer
export const provider = mockProvider;
export const wallet = mockWallet;

// Create network configuration
export const networkConfig: NetworkConfig = {
  chainId: ChainId.BASE_SEPOLIA,
  provider: provider,
  contracts: {
    DeedNFT: TEST_CONFIG.contracts.deedNFT,
    FundManager: TEST_CONFIG.contracts.fundManager,
    Validator: TEST_CONFIG.contracts.validator,
    ValidatorRegistry: TEST_CONFIG.contracts.validatorRegistry,
    MetadataRenderer: TEST_CONFIG.contracts.metadataRenderer
  }
};

// Initialize SDK components
export const transactionManager = new TransactionManager(provider);
export const monitoringSystem = new MonitoringSystem(provider, {
  maxRetries: TEST_CONFIG.transaction.retries,
  retryDelay: TEST_CONFIG.transaction.retryDelay,
  timeout: TEST_CONFIG.transaction.timeout,
  confirmations: TEST_CONFIG.transaction.confirmations,
});

// Nonce management
let currentNonce: number | undefined;

async function getNextNonce(): Promise<number> {
  if (currentNonce === undefined) {
    currentNonce = await wallet.getNonce();
  }
  return currentNonce++;
}

// Helper function to wait for transaction
export async function waitForTransaction(tx: ethers.TransactionResponse): Promise<ethers.TransactionReceipt> {
  const mockReceipt = {
    provider: provider,
    hash: tx.hash,
    index: 0,
    status: 1,
    transactionHash: tx.hash,
    blockNumber: 12345,
    blockHash: '0x789',
    confirmations: 1,
    to: tx.to,
    from: tx.from,
    contractAddress: null,
    transactionIndex: 0,
    gasUsed: BigInt(21000),
    logsBloom: '0x',
    logs: [{
      address: tx.to || '',
      topics: ['0x0', '0x0', '0x0', '0x1'],
      data: '0x',
      blockNumber: 1,
      transactionHash: tx.hash,
      logIndex: 0,
      blockHash: '0x789'
    }],
    blobGasUsed: BigInt(0),
    cumulativeGasUsed: BigInt(21000),
    effectiveGasPrice: BigInt(1000000000),
    fee: BigInt(21000000000000),
    gasPrice: BigInt(1000000000),
    type: 2
  } as unknown as ethers.TransactionReceipt;

  return mockReceipt;
}

// Helper function to execute contract transactions
export async function executeContractTransaction(
  contract: ethers.Contract,
  functionName: string,
  args: any[] = []
): Promise<ethers.TransactionReceipt> {
  const nonce = await getNextNonce();
  const gasPrice = await provider.getFeeData();
  
  const mockReceipt = {
    provider: provider,
    hash: '0xabc',
    index: 0,
    status: 1,
    transactionHash: '0xabc',
    blockNumber: 12345,
    blockHash: '0x789',
    confirmations: 1,
    to: contract.address,
    from: await wallet.getAddress(),
    contractAddress: null,
    transactionIndex: 0,
    gasUsed: BigInt(21000),
    logsBloom: '0x',
    logs: [{
      address: contract.address,
      topics: ['0x0', '0x0', '0x0', '0x1'],
      data: '0x',
      blockNumber: 1,
      transactionHash: '0xabc',
      logIndex: 0,
      blockHash: '0x789'
    }],
    blobGasUsed: BigInt(0),
    cumulativeGasUsed: BigInt(21000),
    effectiveGasPrice: BigInt(1000000000),
    fee: BigInt(21000000000000),
    gasPrice: BigInt(1000000000),
    type: 2
  } as unknown as ethers.TransactionReceipt;

  // Call the original contract method to get the response
  const tx = await contract[functionName](...args, {
    nonce,
    maxFeePerGas: gasPrice.maxFeePerGas || TEST_CONFIG.gas.maxFeePerGas,
    maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas || TEST_CONFIG.gas.maxPriorityFeePerGas,
    gasLimit: TEST_CONFIG.gas.gasLimit
  });

  // Return the mock receipt directly
  return mockReceipt;
}

// Helper function to get test contract with proper ABI
export function getTestContract<T extends keyof typeof TEST_ABIS>(
  contractName: T,
  address?: string
): ethers.Contract {
  const contractAddress = address || networkConfig.contracts[contractName];
  const contract = new ethers.Contract(contractAddress, TEST_ABIS[contractName], wallet);
  
  // Track state
  const whitelistedTokens = new Set<string>();
  const compatibleDeedNFTs = new Set<string>();

  // Mock contract transaction responses
  const mockTxResponse = {
    hash: '0xabc',
    to: contractAddress,
    from: '0x1234567890123456789012345678901234567890',
    wait: async (confirmations?: number) => {
      // Get the method name and arguments from the most recent call
      const methodName = (mockTxResponse as any).methodName;
      const args = (mockTxResponse as any).args;

      // Update state based on the method called
      if (methodName === 'addWhitelistedToken') {
        whitelistedTokens.add(args[0]);
      } else if (methodName === 'removeWhitelistedToken') {
        whitelistedTokens.delete(args[0]);
      } else if (methodName === 'addCompatibleDeedNFT') {
        compatibleDeedNFTs.add(args[0]);
      } else if (methodName === 'removeCompatibleDeedNFT') {
        compatibleDeedNFTs.delete(args[0]);
      }

      return {
        provider: provider,
        hash: '0xabc',
        index: 0,
        status: 1,
        transactionHash: '0xabc',
        blockNumber: 12345,
        blockHash: '0x789',
        confirmations: confirmations || 1,
        to: contractAddress,
        from: '0x1234567890123456789012345678901234567890',
        contractAddress: null,
        transactionIndex: 0,
        gasUsed: BigInt(21000),
        logsBloom: '0x',
        logs: [{
          address: contractAddress,
          topics: ['0x0', '0x0', '0x0', '0x1'],
          data: '0x',
          blockNumber: 1,
          transactionHash: '0xabc',
          logIndex: 0,
          blockHash: '0x789'
        }],
        blobGasUsed: BigInt(0),
        cumulativeGasUsed: BigInt(21000),
        effectiveGasPrice: BigInt(1000000000),
        fee: BigInt(21000000000000),
        gasPrice: BigInt(1000000000),
        type: 2
      } as unknown as ethers.TransactionReceipt;
    }
  } as unknown as ethers.TransactionResponse;

  // Mock contract methods
  jest.spyOn(contract, 'isTokenWhitelisted').mockImplementation(async (...args: any[]) => {
    const [token] = args;
    return whitelistedTokens.has(token);
  });

  jest.spyOn(contract, 'addWhitelistedToken').mockImplementation(async (...args: any[]) => {
    const [token] = args;
    const response = { ...mockTxResponse, methodName: 'addWhitelistedToken', args };
    return response;
  });

  jest.spyOn(contract, 'removeWhitelistedToken').mockImplementation(async (...args: any[]) => {
    const [token] = args;
    const response = { ...mockTxResponse, methodName: 'removeWhitelistedToken', args };
    return response;
  });

  jest.spyOn(contract, 'isCompatibleDeedNFT').mockImplementation(async (...args: any[]) => {
    const [deedNFT] = args;
    return compatibleDeedNFTs.has(deedNFT);
  });

  jest.spyOn(contract, 'addCompatibleDeedNFT').mockImplementation(async (...args: any[]) => {
    const [deedNFT] = args;
    const response = { ...mockTxResponse, methodName: 'addCompatibleDeedNFT', args };
    return response;
  });

  jest.spyOn(contract, 'removeCompatibleDeedNFT').mockImplementation(async (...args: any[]) => {
    const [deedNFT] = args;
    const response = { ...mockTxResponse, methodName: 'removeCompatibleDeedNFT', args };
    return response;
  });

  // Mock other contract methods to return the transaction response
  const contractMethods = Object.keys(contract.interface.format());
  contractMethods.forEach(method => {
    if (!['isTokenWhitelisted', 'addWhitelistedToken', 'removeWhitelistedToken', 'isCompatibleDeedNFT', 'addCompatibleDeedNFT', 'removeCompatibleDeedNFT'].includes(method)) {
      jest.spyOn(contract, method).mockResolvedValue(mockTxResponse);
    }
  });

  return contract;
}

// Global test timeout
jest.setTimeout(30000);

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Helper function to get test accounts
export const getTestAccounts = async (provider: ethers.JsonRpcProvider): Promise<string[]> => {
  const accounts = await provider.listAccounts();
  return Promise.all(accounts.map((account: ethers.JsonRpcSigner) => account.getAddress()));
};

// Initialize test environment
export async function initializeTestEnv() {
  const provider = new ethers.JsonRpcProvider();
  const signer = await provider.getSigner();
  const accounts = await getTestAccounts(provider);

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