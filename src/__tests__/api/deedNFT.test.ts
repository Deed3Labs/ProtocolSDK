/**
 * @file DeedNFT API Test Suite
 * @description This test suite verifies the functionality of the DeedNFT contract API.
 * It tests asset minting, burning, transfers, metadata management, validation,
 * minter management, marketplace approvals, and royalty enforcement. The suite uses
 * mocked contract methods to simulate blockchain interactions.
 * 
 * @module DeedNFTAPITest
 */

import { expect, jest } from '@jest/globals';
import { ethers } from 'ethers';
import { IDeedNFTContract, IMetadataRendererContract } from '../../contracts';
import {
  mintAsset,
  getTransferValidator,
  burnAsset,
  burnBatchAssets,
  updateMetadata,
  tokenURI,
  updateValidationStatus,
  addMinter,
  removeMinter,
  isApprovedMarketplace,
  setRoyaltyEnforcement,
  isRoyaltyEnforced,
  setTransferValidator,
  setApprovedMarketplace,
  setDefaultValidator,
  setValidatorRegistry,
  setMetadataRenderer,
  generateUniqueTokenId,
  getTraitValue,
  getTraitValues,
  getTraitKeys,
  getTraitName,
  getTraitMetadataURI,
  contractURI,
  setContractURI,
  getValidationStatus,
  royaltyInfo,
  setToDefaultSecurityPolicy,
  setApprovedMarketplace as setApprovedMarketplaceFn,
  isApprovedMarketplace as isApprovedMarketplaceFn,
  setRoyaltyEnforcement as setRoyaltyEnforcementFn,
  isRoyaltyEnforced as isRoyaltyEnforcedFn,
  getTransferValidator as getTransferValidatorFn,
  setTransferValidator as setTransferValidatorFn,
  getTransferValidationFunction,
  totalSupply,
  setFundManager
} from '../../api/deedNFT';
import { TEST_CONFIG, provider, wallet } from '../setup';
import { ValidationError } from '../../types/errors';
import { TransactionManager } from '../../utils/transactionManager';

describe('DeedNFT API', () => {
  let contract: IDeedNFTContract;
  let transactionManager: TransactionManager;
  const validAddress = '0x1234567890123456789012345678901234567890';
  const validIpfsHash = 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';
  const validTokenId = 1;
  const validTokenIds = [1, 2, 3];
  const validTokenURI = 'ipfs://QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock contract with proper types
    const mockTxResponse = {
      hash: '0x123',
      wait: async () => ({
        status: 1,
        logs: [{
          args: {
            tokenId: 1
          }
        }]
      } as unknown as ethers.TransactionReceipt),
      toJSON: () => ({}),
      getBlock: async () => null,
      getTransaction: async () => null,
      gasLimit: BigInt(1000000),
      gasPrice: BigInt(1000000000),
      maxFeePerGas: BigInt(1000000000),
      maxPriorityFeePerGas: BigInt(1000000000),
      data: '0x',
      from: '0x123',
      to: '0x456',
      value: BigInt(0),
      nonce: 1,
      type: 2,
      chainId: 1,
      confirmations: 1,
      blockNumber: 1,
      blockHash: '0x789',
      index: 0,
      provider: provider,
      signature: {
        r: '0x123',
        s: '0x456',
        v: 27
      },
      accessList: [],
      authorizationList: null
    } as unknown as ethers.TransactionResponse;

    const mockBatchTxResponse = {
      hash: '0x123',
      wait: async () => ({
        status: 1,
        logs: [
          {
            topics: ['0x0', '0x0', '0x0', '0x1'],
            data: '0x'
          },
          {
            topics: ['0x0', '0x0', '0x0', '0x2'],
            data: '0x'
          }
        ]
      } as unknown as ethers.TransactionReceipt),
      toJSON: () => ({}),
      getBlock: async () => null,
      getTransaction: async () => null,
      gasLimit: BigInt(1000000),
      gasPrice: BigInt(1000000000),
      maxFeePerGas: BigInt(1000000000),
      maxPriorityFeePerGas: BigInt(1000000000),
      data: '0x',
      from: '0x123',
      to: '0x456',
      value: BigInt(0),
      nonce: 1,
      type: 2,
      chainId: 1,
      confirmations: 1,
      blockNumber: 1,
      blockHash: '0x789',
      index: 0,
      provider: provider,
      signature: {
        r: '0x123',
        s: '0x456',
        v: 27
      },
      accessList: [],
      authorizationList: null
    } as unknown as ethers.TransactionResponse;

    contract = {
      // Read functions
      tokenURI: jest.fn<() => Promise<string>>().mockResolvedValue(validTokenURI),
      isApprovedMarketplace: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      isRoyaltyEnforced: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getTransferValidator: jest.fn<() => Promise<string>>().mockResolvedValue(validAddress),
      generateUniqueTokenId: jest.fn<() => Promise<number>>().mockResolvedValue(1),
      // New trait-related mocks
      getTraitValue: jest.fn<() => Promise<string>>().mockResolvedValue('traitValue'),
      getTraitValues: jest.fn<() => Promise<string[]>>().mockResolvedValue(['traitValue1', 'traitValue2']),
      getTraitKeys: jest.fn<() => Promise<string[]>>().mockResolvedValue(['traitKey1', 'traitKey2']),
      getTraitName: jest.fn<() => Promise<string>>().mockResolvedValue('traitName'),
      getTraitMetadataURI: jest.fn<() => Promise<string>>().mockResolvedValue('traitMetadataURI'),
      // New contract URI mocks
      contractURI: jest.fn<() => Promise<string>>().mockResolvedValue('contractURI'),
      setContractURI: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      // New validation and royalty mocks
      getValidationStatus: jest.fn<() => Promise<{ isValidated: boolean; validator: string }>>().mockResolvedValue({ isValidated: true, validator: '0x123' }),
      royaltyInfo: jest.fn<() => Promise<{ receiver: string; royaltyAmount: number }>>().mockResolvedValue({ receiver: '0x123', royaltyAmount: 100 }),
      setToDefaultSecurityPolicy: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      // New transfer validation mocks
      getTransferValidationFunction: jest.fn<() => Promise<{ functionSignature: string; isViewFunction: boolean }>>().mockResolvedValue({ functionSignature: '0x123', isViewFunction: true }),
      // New supply and fund manager mocks
      totalSupply: jest.fn<() => Promise<number>>().mockResolvedValue(100),
      setFundManager: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      // Write functions
      mintAsset: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      burnAsset: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      burnBatchAssets: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockBatchTxResponse),
      updateMetadata: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      updateValidationStatus: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      addMinter: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      removeMinter: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setApprovedMarketplace: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setRoyaltyEnforcement: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setTransferValidator: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setDefaultValidator: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setValidatorRegistry: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setMetadataRenderer: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      runner: { provider },
      interface: {
        format: () => ({})
      }
    } as unknown as IDeedNFTContract;

    // Initialize transaction manager
    transactionManager = new TransactionManager(provider);
  });

  describe('mintAsset', () => {
    it('should mint a new asset successfully', async () => {
      const result = await mintAsset(
        contract,
        validAddress,
        0,
        validIpfsHash,
        'Definition',
        'Configuration',
        validAddress,
        1
      );

      expect(result).toBeDefined();
      expect(result.tokenId).toBe(1);
      expect(contract.mintAsset).toHaveBeenCalledWith(
        validAddress,
        0,
        validIpfsHash,
        'Definition',
        'Configuration',
        validAddress,
        1
      );
    });

    it('should handle transaction failure', async () => {
      jest.spyOn(contract, 'mintAsset').mockRejectedValue(new Error('Transaction failed'));

      await expect(mintAsset(
        contract,
        validAddress,
        0,
        validIpfsHash,
        'Definition',
        'Configuration',
        validAddress,
        1
      )).rejects.toThrow('Transaction failed');
    });
  });

  describe('burnAsset', () => {
    it('should burn asset successfully', async () => {
      await burnAsset(contract, validTokenId);
      expect(contract.burnAsset).toHaveBeenCalledWith(validTokenId);
    });

    it('should burn batch assets successfully', async () => {
      await burnBatchAssets(contract, validTokenIds);
      expect(contract.burnBatchAssets).toHaveBeenCalledWith(validTokenIds);
    });

    it('should update metadata successfully', async () => {
      await updateMetadata(
        contract,
        validTokenId,
        validTokenURI,
        'Operating Agreement',
        'Definition',
        'Configuration'
      );
      expect(contract.updateMetadata).toHaveBeenCalledWith(
        validTokenId,
        validTokenURI,
        'Operating Agreement',
        'Definition',
        'Configuration'
      );
    });

    it('should update validation status successfully', async () => {
      await updateValidationStatus(contract, validTokenId, true, validAddress);
      expect(contract.updateValidationStatus).toHaveBeenCalledWith(validTokenId, true, validAddress);
    });
  });

  describe('Minter Management', () => {
    it('should add minter successfully', async () => {
      await addMinter(contract, validAddress);
      expect(contract.addMinter).toHaveBeenCalledWith(validAddress);
    });

    it('should remove minter successfully', async () => {
      await removeMinter(contract, validAddress);
      expect(contract.removeMinter).toHaveBeenCalledWith(validAddress);
    });
  });

  describe('Marketplace Management', () => {
    it('should set approved marketplace successfully', async () => {
      await setApprovedMarketplace(contract, validAddress, true);
      expect(contract.setApprovedMarketplace).toHaveBeenCalledWith(validAddress, true);
    });

    it('should check if marketplace is approved successfully', async () => {
      const result = await isApprovedMarketplace(contract, validAddress);
      expect(result).toBe(true);
      expect(contract.isApprovedMarketplace).toHaveBeenCalledWith(validAddress);
    });
  });

  describe('Royalty Management', () => {
    it('should set royalty enforcement successfully', async () => {
      await setRoyaltyEnforcement(contract, true);
      expect(contract.setRoyaltyEnforcement).toHaveBeenCalledWith(true);
    });

    it('should check if royalty is enforced successfully', async () => {
      const result = await isRoyaltyEnforced(contract);
      expect(result).toBe(true);
      expect(contract.isRoyaltyEnforced).toHaveBeenCalled();
    });
  });

  describe('Transfer Validator Management', () => {
    it('should set transfer validator successfully', async () => {
      await setTransferValidator(contract, validAddress);
      expect(contract.setTransferValidator).toHaveBeenCalledWith(validAddress);
    });

    it('should get transfer validator successfully', async () => {
      const result = await getTransferValidator(contract);
      expect(result).toBe(validAddress);
      expect(contract.getTransferValidator).toHaveBeenCalled();
    });
  });

  describe('setDefaultValidator', () => {
    it('should set the default validator', async () => {
      const validator = '0x1234567890123456789012345678901234567890';
      await setDefaultValidator(contract, validator);
      expect(contract.setDefaultValidator).toHaveBeenCalledWith(validator);
    });
  });

  describe('setValidatorRegistry', () => {
    it('should set the validator registry', async () => {
      const registry = '0x1234567890123456789012345678901234567890';
      await setValidatorRegistry(contract, registry);
      expect(contract.setValidatorRegistry).toHaveBeenCalledWith(registry);
    });
  });

  describe('setMetadataRenderer', () => {
    it('should set the metadata renderer', async () => {
      const renderer = '0x1234567890123456789012345678901234567890';
      await setMetadataRenderer(contract, renderer);
      expect(contract.setMetadataRenderer).toHaveBeenCalledWith(renderer);
    });
  });

  describe('addMinter', () => {
    it('should add a minter', async () => {
      const minter = '0x1234567890123456789012345678901234567890';
      await addMinter(contract, minter);
      expect(contract.addMinter).toHaveBeenCalledWith(minter);
    });
  });

  describe('removeMinter', () => {
    it('should remove a minter', async () => {
      const minter = '0x1234567890123456789012345678901234567890';
      await removeMinter(contract, minter);
      expect(contract.removeMinter).toHaveBeenCalledWith(minter);
    });
  });

  describe('generateUniqueTokenId', () => {
    it('should generate a unique token ID', async () => {
      const owner = '0x1234567890123456789012345678901234567890';
      const assetType = 0;
      const definition = 'test';
      const salt = 1;
      const tokenId = await generateUniqueTokenId(contract, owner, assetType, definition, salt);
      expect(contract.generateUniqueTokenId).toHaveBeenCalledWith(owner, assetType, definition, salt);
      expect(tokenId).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle minting errors', async () => {
      jest.spyOn(contract, 'mintAsset').mockRejectedValue(new Error('Failed to mint'));
      await expect(mintAsset(
        contract,
        validAddress,
        0,
        validIpfsHash,
        'Definition',
        'Configuration',
        validAddress,
        1
      )).rejects.toThrow('Failed to mint');
    });

    it('should handle burning errors', async () => {
      jest.spyOn(contract, 'burnAsset').mockRejectedValue(new Error('Failed to burn asset'));
      await expect(burnAsset(contract, validTokenId))
        .rejects.toThrow('Failed to burn asset');
    });

    it('should handle validation status update errors', async () => {
      jest.spyOn(contract, 'updateValidationStatus').mockRejectedValue(new Error('Failed to update status'));
      await expect(updateValidationStatus(contract, validTokenId, true, validAddress))
        .rejects.toThrow('Failed to update status');
    });
  });

  describe('Trait Management', () => {
    it('should get trait value', async () => {
      const result = await getTraitValue(contract, 1, 'traitKey');
      expect(contract.getTraitValue).toHaveBeenCalledWith(1, '0xafdcf18ff8a2582df642e71a8e6ec23ceaf35f9b1fbb73dcb6b4b7a1d3300c28');
      expect(result).toBe('traitValue');
    });
    it('should get trait values', async () => {
      const result = await getTraitValues(contract, 1, ['traitKey1', 'traitKey2']);
      expect(contract.getTraitValues).toHaveBeenCalledWith(1, [
        '0x2f6908753f2129bd7c02162c8fdf37aa8f3c4f2bbd5c393e73665c3bfa3263ab',
        '0x90238fc0417424e3d44ccaf5894eb5bf43b6229e8229efd3c6ccbe497ef12421'
      ]);
      expect(result).toEqual(['traitValue1', 'traitValue2']);
    });
    it('should get trait keys', async () => {
      const result = await getTraitKeys(contract, 1);
      expect(contract.getTraitKeys).toHaveBeenCalledWith(1);
      expect(result).toEqual(['traitKey1', 'traitKey2']);
    });
    it('should get trait name', async () => {
      const result = await getTraitName(contract, 'traitKey');
      expect(contract.getTraitName).toHaveBeenCalledWith('0xafdcf18ff8a2582df642e71a8e6ec23ceaf35f9b1fbb73dcb6b4b7a1d3300c28');
      expect(result).toBe('traitName');
    });
    it('should get trait metadata URI', async () => {
      const result = await getTraitMetadataURI(contract);
      expect(contract.getTraitMetadataURI).toHaveBeenCalled();
      expect(result).toBe('traitMetadataURI');
    });
  });

  describe('Contract URI Management', () => {
    it('should get contract URI', async () => {
      const result = await contractURI(contract);
      expect(contract.contractURI).toHaveBeenCalled();
      expect(result).toBe('contractURI');
    });
    it('should set contract URI', async () => {
      await setContractURI(contract, 'newURI');
      expect(contract.setContractURI).toHaveBeenCalledWith('newURI');
    });
  });

  describe('Validation and Royalty', () => {
    it('should get validation status', async () => {
      const result = await getValidationStatus(contract, 1);
      expect(contract.getValidationStatus).toHaveBeenCalledWith(1);
      expect(result).toEqual({ isValidated: true, validator: '0x123' });
    });
    it('should get royalty info', async () => {
      const result = await royaltyInfo(contract, 1, 1000);
      expect(contract.royaltyInfo).toHaveBeenCalledWith(1, 1000);
      expect(result).toEqual({ receiver: '0x123', royaltyAmount: 100 });
    });
    it('should set to default security policy', async () => {
      await setToDefaultSecurityPolicy(contract);
      expect(contract.setToDefaultSecurityPolicy).toHaveBeenCalled();
    });
  });

  describe('Transfer Validation', () => {
    it('should get transfer validation function', async () => {
      const result = await getTransferValidationFunction(contract);
      expect(contract.getTransferValidationFunction).toHaveBeenCalled();
      expect(result).toEqual({ functionSignature: '0x123', isViewFunction: true });
    });
  });

  describe('Supply and Fund Manager', () => {
    it('should get total supply', async () => {
      const result = await totalSupply(contract);
      expect(contract.totalSupply).toHaveBeenCalled();
      expect(result).toBe(100);
    });
    it('should set fund manager', async () => {
      await setFundManager(contract, '0x123');
      expect(contract.setFundManager).toHaveBeenCalledWith('0x123');
    });
  });

  describe('Token URI Management', () => {
    /**
     * @description Tests successful retrieval of token URI from metadata renderer
     */
    it('should get token URI from metadata renderer successfully', async () => {
      const metadataRenderer = {
        tokenURI: jest.fn<() => Promise<string>>().mockResolvedValue('ipfs://metadata-renderer-uri')
      } as unknown as IMetadataRendererContract;
      jest.spyOn(contract, 'tokenURI').mockImplementation(async (...args: any[]) => {
        try {
          return await metadataRenderer.tokenURI(args[0]);
        } catch {
          return 'ipfs://fallback-uri';
        }
      });

      const result = await tokenURI(contract, validTokenId);
      expect(result).toBe('ipfs://metadata-renderer-uri');
      expect(metadataRenderer.tokenURI).toHaveBeenCalledWith(validTokenId);
    });

    /**
     * @description Tests fallback to default URI when metadata renderer fails
     */
    it('should fallback to default URI when metadata renderer fails', async () => {
      const metadataRenderer = {
        tokenURI: jest.fn<() => Promise<string>>().mockRejectedValue(new Error('Failed to get URI'))
      } as unknown as IMetadataRendererContract;
      jest.spyOn(contract, 'tokenURI').mockImplementation(async (...args: any[]) => {
        try {
          return await metadataRenderer.tokenURI(args[0]);
        } catch {
          return 'ipfs://fallback-uri';
        }
      });

      const result = await tokenURI(contract, validTokenId);
      expect(result).toBe('ipfs://fallback-uri');
      expect(metadataRenderer.tokenURI).toHaveBeenCalledWith(validTokenId);
    });
  });
}); 