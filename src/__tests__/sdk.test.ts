import { expect, jest } from '@jest/globals';
import { ethers } from 'ethers';
import { ProtocolSDK } from '../index';
import { ChainId } from '../types/network';
import { ValidationError } from '../types/errors';
import { CONTRACT_ADDRESSES } from '../config/contracts';

describe('ProtocolSDK', () => {
  let sdk: ProtocolSDK;
  let mockProvider: ethers.Provider;
  let mockSigner: ethers.Signer;
  let mockContract: ethers.Contract;

  beforeEach(() => {
    // Create mock objects
    mockProvider = new ethers.JsonRpcProvider();
    mockSigner = new ethers.Wallet('0x123', mockProvider);
    mockContract = new ethers.Contract('0x123', [], mockSigner);

    // Mock provider methods
    jest.spyOn(mockProvider, 'getTransactionCount').mockResolvedValue(1);
    jest.spyOn(mockProvider, 'getTransactionReceipt').mockResolvedValue({
      to: '0x123',
      from: '0x123',
      contractAddress: '0x123',
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
      byzantium: true,
      provider: mockProvider
    } as unknown as ethers.TransactionReceipt);

    // Mock signer methods
    jest.spyOn(mockSigner, 'getAddress').mockResolvedValue('0x123');

    // Mock contract methods
    jest.spyOn(mockContract, 'mintAsset').mockResolvedValue({
      data: '0x',
      estimateGas: () => Promise.resolve(100000)
    });
    jest.spyOn(mockContract, 'updateMetadata').mockResolvedValue({
      data: '0x',
      estimateGas: () => Promise.resolve(100000)
    });
    jest.spyOn(mockContract, 'tokenURI').mockResolvedValue({
      uri: 'ipfs://test',
      operatingAgreement: 'ipfs://test',
      definition: 'test',
      configuration: 'test'
    });

    // Create SDK instance
    sdk = new ProtocolSDK({
      network: {
        chainId: ChainId.BASE_SEPOLIA,
        provider: mockProvider,
        contracts: CONTRACT_ADDRESSES[ChainId.BASE_SEPOLIA]
      },
      signer: mockSigner
    });

    // Mock contract initialization
    sdk['contracts'].deedNFT = mockContract;
  });

  describe('mintDeedNFT', () => {
    const validParams = {
      owner: '0x123',
      assetType: 1,
      ipfsDetailsHash: 'ipfs://test',
      definition: 'test',
      configuration: 'test',
      validatorAddress: '0x456',
      salt: BigInt(1)
    };

    it('should mint a new DeedNFT successfully', async () => {
      const result = await sdk.mintDeedNFT(validParams);
      expect(result.tokenId).toBe(BigInt(1));
      expect(result.hash).toBeDefined();
      expect(mockContract.mintAsset).toHaveBeenCalledWith(
        validParams.owner,
        validParams.assetType,
        validParams.ipfsDetailsHash,
        validParams.definition,
        validParams.configuration,
        validParams.validatorAddress,
        validParams.salt
      );
    });

    it('should throw error if contract not initialized', async () => {
      sdk['contracts'].deedNFT = undefined;
      await expect(sdk.mintDeedNFT(validParams)).rejects.toThrow('DeedNFT contract not initialized');
    });

    it('should throw error for invalid address', async () => {
      await expect(sdk.mintDeedNFT({
        ...validParams,
        owner: 'invalid'
      })).rejects.toThrow(ValidationError);
    });

    it('should throw error for invalid IPFS hash', async () => {
      await expect(sdk.mintDeedNFT({
        ...validParams,
        ipfsDetailsHash: 'invalid'
      })).rejects.toThrow(ValidationError);
    });
  });

  describe('updateDeedNFTMetadata', () => {
    const validParams = {
      tokenId: BigInt(1),
      uri: 'ipfs://test',
      operatingAgreement: 'ipfs://test',
      definition: 'test',
      configuration: 'test'
    };

    it('should update metadata successfully', async () => {
      const hash = await sdk.updateDeedNFTMetadata(validParams);
      expect(hash).toBeDefined();
      expect(mockContract.updateMetadata).toHaveBeenCalledWith(
        validParams.tokenId,
        validParams.uri,
        validParams.operatingAgreement,
        validParams.definition,
        validParams.configuration
      );
    });

    it('should throw error if contract not initialized', async () => {
      sdk['contracts'].deedNFT = undefined;
      await expect(sdk.updateDeedNFTMetadata(validParams)).rejects.toThrow('DeedNFT contract not initialized');
    });

    it('should throw error for invalid IPFS hash', async () => {
      await expect(sdk.updateDeedNFTMetadata({
        ...validParams,
        uri: 'invalid'
      })).rejects.toThrow(ValidationError);
    });
  });

  describe('getDeedNFTMetadata', () => {
    it('should return metadata successfully', async () => {
      const metadata = await sdk.getDeedNFTMetadata(BigInt(1));
      expect(metadata).toEqual({
        uri: 'ipfs://test',
        operatingAgreement: 'ipfs://test',
        definition: 'test',
        configuration: 'test'
      });
      expect(mockContract.tokenURI).toHaveBeenCalledWith(BigInt(1));
    });

    it('should throw error if contract not initialized', async () => {
      sdk['contracts'].deedNFT = undefined;
      await expect(sdk.getDeedNFTMetadata(BigInt(1))).rejects.toThrow('DeedNFT contract not initialized');
    });
  });

  describe('network monitoring', () => {
    it('should start and stop monitoring', async () => {
      await sdk.startMonitoring();
      expect(sdk['networkMonitor']['isRunning']).toBe(true);
      
      sdk.stopMonitoring();
      expect(sdk['networkMonitor']['isRunning']).toBe(false);
    });

    it('should get network status', async () => {
      const status = await sdk.getNetworkStatus();
      expect(status).toBeDefined();
    });
  });

  describe('transaction management', () => {
    it('should get transaction status', async () => {
      const status = await sdk.getTransactionStatus('0x123');
      expect(status).toBeDefined();
    });
  });
}); 