/**
 * @file SDK Test Suite
 * @description This test suite verifies the functionality of the ProtocolSDK class.
 * It tests initialization, configuration, contract interactions, and error handling.
 * The suite uses mocked dependencies to isolate the SDK's functionality.
 * 
 * @module SDKTest
 */

import { expect, jest } from '@jest/globals';
import { ethers } from 'ethers';
import { ProtocolSDK } from '../index';
import { ChainId } from '../types/network';
import { ValidationError } from '../types/errors';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { networkConfig, TEST_CONFIG } from './setup';
import { TEST_ABIS } from './constants/abis';
import { ValidationSystem } from '../utils/validation';

/**
 * @description Mocks the ValidationSystem module to control validation behavior in tests
 */
jest.mock('../utils/validation', () => ({
  ValidationSystem: {
    validateAddress: jest.fn(),
    validateAmount: jest.fn(),
    validateIpfsHash: jest.fn(),
    validateContractAddresses: jest.fn(),
    validateConfig: jest.fn(),
    validateGasPrice: jest.fn(),
    validateContractDeployment: jest.fn(),
    validateString: jest.fn(),
    validateNumberRange: jest.fn(),
    validateBigIntRange: jest.fn(),
    validateArrayNotEmpty: jest.fn(),
    validateFutureDate: jest.fn(),
    validateUrl: jest.fn(),
    validateJson: jest.fn()
  }
}));

/**
 * @description Test suite for the ProtocolSDK class
 */
describe('ProtocolSDK', () => {
  let sdk: ProtocolSDK;
  let mockProvider: ethers.Provider;
  let mockSigner: ethers.Signer;
  let mockContract: ethers.Contract;
  const validAddress = '0x1234567890123456789012345678901234567890';
  const validIpfsHash = 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';

  /**
   * @description Sets up test environment before each test
   * - Resets all mocks
   * - Configures validation mocks
   * - Creates mock provider, signer, and contract instances
   * - Sets up mock transaction receipts and responses
   */
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock validation methods
    (ValidationSystem.validateAddress as jest.Mock).mockImplementation((...args: unknown[]) => {
      const address = args[0] as string;
      if (!address.startsWith('0x') || address.length !== 42) {
        throw new ValidationError('Invalid address format');
      }
    });

    (ValidationSystem.validateIpfsHash as jest.Mock).mockImplementation((...args: unknown[]) => {
      const hash = args[0] as string;
      if (!hash.startsWith('Qm')) {
        throw new ValidationError('Invalid IPFS hash format');
      }
    });

    // Create mock objects
    const mockReceipt = {
      to: validAddress,
      from: validAddress,
      contractAddress: validAddress,
      transactionIndex: 0,
      gasUsed: 100000n,
      logsBloom: '0x',
      blockHash: '0x123',
      transactionHash: '0x123',
      logs: [{
        address: validAddress,
        topics: ['0x0', '0x0', '0x0', '0x1'],
        data: '0x',
        blockNumber: 1,
        transactionHash: '0x123',
        logIndex: 0,
        blockHash: '0x123',
        removed: false
      }],
      blockNumber: 1,
      confirmations: 1,
      cumulativeGasUsed: 100000n,
      effectiveGasPrice: 1000000000n,
      status: 1,
      type: 0,
      byzantium: true,
      hash: '0x123',
      index: 0,
      provider: undefined
    } as unknown as ethers.TransactionReceipt;

    /**
     * @description Mock provider class that simulates blockchain network behavior
     */
    class MockProvider extends ethers.JsonRpcProvider {
      constructor() {
        super();
      }

      async getNetwork(): Promise<any> {
        return { chainId: BigInt(ChainId.BASE_SEPOLIA) };
      }

      async getTransactionCount(): Promise<number> {
        return 1;
      }

      async getTransactionReceipt(): Promise<ethers.TransactionReceipt> {
        return mockReceipt;
      }

      async waitForTransaction(): Promise<ethers.TransactionReceipt> {
        return mockReceipt;
      }
    }

    mockProvider = new MockProvider();
    mockSigner = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', mockProvider);
    mockContract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', TEST_ABIS.DeedNFT, mockSigner);

    // Mock signer methods
    jest.spyOn(mockSigner, 'getAddress').mockResolvedValue(validAddress);
    jest.spyOn(mockSigner, 'sendTransaction').mockResolvedValue({
      hash: '0x123',
      getAddress: () => Promise.resolve(validAddress),
      estimateGas: () => Promise.resolve(BigInt(100000)),
      wait: () => Promise.resolve({
        to: validAddress,
        from: validAddress,
        contractAddress: validAddress,
        transactionIndex: 0,
        gasUsed: 100000n,
        logsBloom: '0x',
        blockHash: '0x123',
        transactionHash: '0x123',
        logs: [{
          address: validAddress,
          topics: ['0x0', '0x0', '0x0', '0x1'],
          data: '0x',
          blockNumber: 1,
          transactionHash: '0x123',
          logIndex: 0,
          blockHash: '0x123',
          removed: false
        }],
        blockNumber: 1,
        confirmations: 1,
        cumulativeGasUsed: 100000n,
        effectiveGasPrice: 1000000000n,
        status: 1,
        type: 0,
        byzantium: true
      } as unknown as ethers.TransactionReceipt)
    } as unknown as ethers.TransactionResponse);

    // Mock contract methods with proper ABI
    const mockAbi = [
      'function mintAsset(address owner, uint256 assetType, string ipfsDetailsHash, string definition, string configuration, address validatorAddress, uint256 salt) returns (uint256)',
      'function updateMetadata(uint256 tokenId, string uri, string operatingAgreement, string definition, string configuration)',
      'function getDeedInfo(uint256 tokenId) view returns (string operatingAgreement, string definition, string configuration)',
      'function tokenURI(uint256 tokenId) view returns (string)'
    ];

    mockContract = new ethers.Contract(validAddress, mockAbi, mockSigner);

    // Mock contract methods
    jest.spyOn(mockContract, 'mintAsset').mockResolvedValue({
      hash: '0x123',
      getAddress: () => Promise.resolve(validAddress),
      estimateGas: () => Promise.resolve(BigInt(100000)),
      wait: () => Promise.resolve({
        to: validAddress,
        from: validAddress,
        contractAddress: validAddress,
        transactionIndex: 0,
        gasUsed: 100000n,
        logsBloom: '0x',
        blockHash: '0x123',
        transactionHash: '0x123',
        logs: [{
          address: validAddress,
          topics: ['0x0', '0x0', '0x0', '0x1'],
          data: '0x',
          blockNumber: 1,
          transactionHash: '0x123',
          logIndex: 0,
          blockHash: '0x123',
          removed: false
        }],
        blockNumber: 1,
        confirmations: 1,
        cumulativeGasUsed: 100000n,
        effectiveGasPrice: 1000000000n,
        status: 1,
        type: 0,
        byzantium: true
      } as unknown as ethers.TransactionReceipt)
    });

    jest.spyOn(mockContract, 'updateMetadata').mockResolvedValue({
      hash: '0x123',
      getAddress: () => Promise.resolve(validAddress),
      estimateGas: () => Promise.resolve(BigInt(100000)),
      wait: () => Promise.resolve({
        to: validAddress,
        from: validAddress,
        contractAddress: validAddress,
        transactionIndex: 0,
        gasUsed: 100000n,
        logsBloom: '0x',
        blockHash: '0x123',
        transactionHash: '0x123',
        logs: [],
        blockNumber: 1,
        confirmations: 1,
        cumulativeGasUsed: 100000n,
        effectiveGasPrice: 1000000000n,
        status: 1,
        type: 0,
        byzantium: true
      } as unknown as ethers.TransactionReceipt)
    });

    jest.spyOn(mockContract, 'getDeedInfo').mockResolvedValue({
      operatingAgreement: validIpfsHash,
      definition: 'test',
      configuration: 'test'
    });

    jest.spyOn(mockContract, 'tokenURI').mockResolvedValue(validIpfsHash);

    /**
     * @description Mock network monitor for testing network status and monitoring
     */
    const mockNetworkMonitor = {
      start: jest.fn().mockImplementation(() => Promise.resolve()),
      stop: jest.fn(),
      getStatus: jest.fn().mockImplementation(() => Promise.resolve({
        isConnected: true,
        chainId: ChainId.BASE_SEPOLIA,
        blockNumber: 1,
        gasPrice: BigInt(1000000000),
        lastUpdate: Date.now()
      }))
    };

    /**
     * @description Mock transaction queue for testing transaction management
     */
    const mockTransactionQueue = {
      add: jest.fn().mockImplementation(() => Promise.resolve('0x123')),
      getStatus: jest.fn().mockImplementation(() => Promise.resolve({
        hash: '0x123',
        from: validAddress,
        to: validAddress,
        status: 'pending',
        confirmations: 0
      }))
    };

    // Create SDK instance
    sdk = new ProtocolSDK({
      network: {
        chainId: ChainId.BASE_SEPOLIA,
        provider: mockProvider,
        contracts: CONTRACT_ADDRESSES[ChainId.BASE_SEPOLIA]
      },
      signer: mockSigner,
      options: {
        maxConcurrentTransactions: TEST_CONFIG.transaction.retries,
        maxRetries: TEST_CONFIG.transaction.retries,
        retryDelay: TEST_CONFIG.transaction.retryDelay,
        confirmations: TEST_CONFIG.transaction.confirmations,
        timeout: TEST_CONFIG.transaction.timeout
      }
    });

    // Initialize contract and mocks
    sdk['contracts'].deedNFT = mockContract;
    sdk['networkMonitor'] = mockNetworkMonitor as any;
    sdk['transactionQueue'] = mockTransactionQueue as any;

    // Initialize transaction queue with a test transaction
    const testHash = '0x1234567890123456789012345678901234567890123456789012345678901234';
    sdk['transactionQueue']['queue'] = [{
      hash: testHash,
      from: validAddress,
      to: validAddress,
      value: BigInt(1),
      data: '0x',
      nonce: 1,
      gasLimit: BigInt(100000),
      status: 'pending',
      confirmations: 0,
      timestamp: Date.now()
    }];
  });

  describe('mintDeedNFT', () => {
    it('should mint a new DeedNFT successfully', async () => {
      const result = await sdk.mintDeedNFT({
        owner: validAddress,
        assetType: 0,
        ipfsDetailsHash: validIpfsHash,
        definition: 'Definition',
        configuration: 'Configuration',
        validatorAddress: validAddress,
        salt: BigInt(1)
      });

      expect(result).toBeDefined();
      expect(result.tokenId).toBeDefined();
      expect(result.hash).toBeDefined();
    });

    it('should throw error if contract not initialized', async () => {
      sdk['contracts'].deedNFT = undefined;
      await expect(sdk.mintDeedNFT({
        owner: validAddress,
        assetType: 0,
        ipfsDetailsHash: validIpfsHash,
        definition: 'Definition',
        configuration: 'Configuration',
        validatorAddress: validAddress,
        salt: BigInt(1)
      })).rejects.toThrow('DeedNFT contract not initialized');
    });

    it('should throw error for invalid address', async () => {
      await expect(sdk.mintDeedNFT({
        owner: 'invalid',
        assetType: 0,
        ipfsDetailsHash: validIpfsHash,
        definition: 'Definition',
        configuration: 'Configuration',
        validatorAddress: validAddress,
        salt: BigInt(1)
      })).rejects.toThrow(ValidationError);
    });

    it('should throw error for invalid IPFS hash', async () => {
      await expect(sdk.mintDeedNFT({
        owner: validAddress,
        assetType: 0,
        ipfsDetailsHash: 'invalid',
        definition: 'Definition',
        configuration: 'Configuration',
        validatorAddress: validAddress,
        salt: BigInt(1)
      })).rejects.toThrow(ValidationError);
    });
  });

  describe('updateDeedNFTMetadata', () => {
    it('should update metadata successfully', async () => {
      const result = await sdk.updateDeedNFTMetadata({
        tokenId: BigInt(1),
        uri: validIpfsHash,
        operatingAgreement: validIpfsHash,
        definition: 'test',
        configuration: 'test'
      });
      expect(result).toBeDefined();
    });

    it('should throw error if contract not initialized', async () => {
      sdk['contracts'].deedNFT = undefined;
      await expect(sdk.updateDeedNFTMetadata({
        tokenId: BigInt(1),
        uri: validIpfsHash,
        operatingAgreement: validIpfsHash,
        definition: 'test',
        configuration: 'test'
      })).rejects.toThrow('DeedNFT contract not initialized');
    });

    it('should throw error for invalid IPFS hash', async () => {
      await expect(sdk.updateDeedNFTMetadata({
        tokenId: BigInt(1),
        uri: 'invalid',
        operatingAgreement: validIpfsHash,
        definition: 'test',
        configuration: 'test'
      })).rejects.toThrow(ValidationError);
    });
  });

  describe('getDeedNFTMetadata', () => {
    it('should return metadata successfully', async () => {
      const metadata = await sdk.getDeedNFTMetadata(BigInt(1));
      expect(metadata).toEqual({
        uri: validIpfsHash,
        operatingAgreement: validIpfsHash,
        definition: 'test',
        configuration: 'test'
      });
    });

    it('should throw error if contract not initialized', async () => {
      sdk['contracts'].deedNFT = undefined;
      await expect(sdk.getDeedNFTMetadata(BigInt(1))).rejects.toThrow('DeedNFT contract not initialized');
    });
  });

  describe('network monitoring', () => {
    it('should start and stop monitoring', async () => {
      await sdk.startMonitoring();
      await sdk.stopMonitoring();
    });

    it('should get network status', async () => {
      const status = await sdk.getNetworkStatus();
      expect(status).toBeDefined();
    });
  });

  describe('transaction management', () => {
    it('should get transaction status', async () => {
      const status = await sdk.getTransactionStatus('0x1234567890123456789012345678901234567890123456789012345678901234');
      expect(status).toBeDefined();
      expect(status.status).toBe('pending');
    });
  });
}); 