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
import {
  mintAsset,
  mintDeedNFT,
  mintBatchDeedNFT,
  getTransferValidator,
  burnAsset,
  burnBatchAssets,
  transferFrom,
  safeTransferFrom,
  updateMetadata,
  tokenURI,
  updateValidationStatus,
  addMinter,
  removeMinter,
  isMinter,
  addApprovedMarketplace,
  removeApprovedMarketplace,
  isApprovedMarketplace,
  setRoyaltyEnforcement,
  isRoyaltyEnforced,
  setTransferValidator
} from '../../api/deedNFT';
import { TEST_CONFIG, provider, wallet } from '../setup';
import { ValidationError } from '../../types/errors';
import { TransactionManager } from '../../utils/transactionManager';

describe('DeedNFT API', () => {
  let contract: ethers.Contract;
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
          topics: ['0x0', '0x0', '0x0', '0x1'],
          data: '0x'
        }]
      } as unknown as ethers.TransactionReceipt)
    } as ethers.TransactionResponse;

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
      } as unknown as ethers.TransactionReceipt)
    } as ethers.TransactionResponse;

    contract = {
      // Read functions
      tokenURI: jest.fn<() => Promise<string>>().mockResolvedValue(validTokenURI),
      isMinter: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      isApprovedMarketplace: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      isRoyaltyEnforced: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getTransferValidator: jest.fn<() => Promise<string>>().mockResolvedValue(validAddress),

      // Write functions
      mintAsset: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      mintDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      mintBatchDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockBatchTxResponse),
      burnAsset: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      burnBatchAssets: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockBatchTxResponse),
      transferFrom: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      safeTransferFrom: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      updateMetadata: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      updateValidationStatus: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      addMinter: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      removeMinter: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      addApprovedMarketplace: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      removeApprovedMarketplace: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setRoyaltyEnforcement: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setTransferValidator: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),

      interface: {
        format: () => ({})
      }
    } as unknown as ethers.Contract;

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
        1,
        transactionManager
      );

      expect(result).toBeDefined();
      expect(result.hash).toBe('0x123');
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
        1,
        transactionManager
      )).rejects.toThrow('Transaction failed');
    });
  });

  describe('mintDeedNFT', () => {
    it('should mint a new DeedNFT successfully', async () => {
      const result = await mintDeedNFT(
        contract,
        validAddress,
        0,
        validIpfsHash,
        'Definition',
        'Configuration',
        validAddress,
        validAddress,
        1
      );

      expect(result).toBeDefined();
      expect(result).toBe(1); // Token ID from mock
      expect(contract.mintDeedNFT).toHaveBeenCalledWith(
        validAddress,
        0,
        validIpfsHash,
        'Definition',
        'Configuration',
        validAddress,
        validAddress,
        1
      );
    });

    it('should handle transaction failure', async () => {
      jest.spyOn(contract, 'mintDeedNFT').mockRejectedValue(new Error('Transaction failed'));

      await expect(mintDeedNFT(
        contract,
        validAddress,
        0,
        validIpfsHash,
        'Definition',
        'Configuration',
        validAddress,
        validAddress,
        1
      )).rejects.toThrow('Transaction failed');
    });
  });

  describe('mintBatchDeedNFT', () => {
    it('should mint multiple DeedNFTs successfully', async () => {
      const deeds = [
        {
          owner: validAddress,
          assetType: 0,
          ipfsDetailsHash: validIpfsHash,
          definition: 'Definition 1',
          configuration: 'Configuration 1',
          validatorContract: validAddress,
          token: validAddress,
          salt: 1
        },
        {
          owner: validAddress,
          assetType: 1,
          ipfsDetailsHash: validIpfsHash,
          definition: 'Definition 2',
          configuration: 'Configuration 2',
          validatorContract: validAddress,
          token: validAddress,
          salt: 2
        }
      ];

      const result = await mintBatchDeedNFT(contract, deeds);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result).toEqual([1, 2]); // Token IDs from mock
      expect(contract.mintBatchDeedNFT).toHaveBeenCalledWith(deeds);
    });

    it('should handle empty batch', async () => {
      const emptyBatchResponse = {
        hash: '0x123',
        wait: async () => ({
          status: 1,
          logs: []
        } as unknown as ethers.TransactionReceipt)
      } as ethers.TransactionResponse;

      jest.spyOn(contract, 'mintBatchDeedNFT').mockResolvedValueOnce(emptyBatchResponse);
      const result = await mintBatchDeedNFT(contract, []);
      expect(result).toHaveLength(0);
    });

    it('should handle transaction failure', async () => {
      jest.spyOn(contract, 'mintBatchDeedNFT').mockRejectedValue(new Error('Transaction failed'));

      await expect(mintBatchDeedNFT(contract, [{
        owner: validAddress,
        assetType: 0,
        ipfsDetailsHash: validIpfsHash,
        definition: 'Definition',
        configuration: 'Configuration',
        validatorContract: validAddress,
        token: validAddress,
        salt: 1
      }])).rejects.toThrow('Transaction failed');
    });
  });

  describe('getTransferValidator', () => {
    it('should return the transfer validator address', async () => {
      const result = await getTransferValidator(contract);
      expect(result).toBe(validAddress);
      expect(contract.getTransferValidator).toHaveBeenCalled();
    });

    it('should handle contract call failure', async () => {
      jest.spyOn(contract, 'getTransferValidator').mockRejectedValue(new Error('Contract call failed'));

      await expect(getTransferValidator(contract)).rejects.toThrow('Contract call failed');
    });
  });

  describe('Asset Management', () => {
    it('should burn asset successfully', async () => {
      const result = await burnAsset(contract, validTokenId, transactionManager);
      expect(result).toBeDefined();
      expect(result.hash).toBe('0x123');
      expect(contract.burnAsset).toHaveBeenCalledWith(validTokenId);
    });

    it('should burn batch assets successfully', async () => {
      const result = await burnBatchAssets(contract, validTokenIds, transactionManager);
      expect(result).toBeDefined();
      expect(result.hash).toBe('0x123');
      expect(contract.burnBatchAssets).toHaveBeenCalledWith(validTokenIds);
    });

    it('should transfer asset successfully', async () => {
      const from = validAddress;
      const to = '0x0987654321098765432109876543210987654321';
      const result = await transferFrom(contract, from, to, validTokenId, transactionManager);
      expect(result).toBeDefined();
      expect(result.hash).toBe('0x123');
      expect(contract.transferFrom).toHaveBeenCalledWith(from, to, validTokenId);
    });

    it('should safe transfer asset successfully', async () => {
      const from = validAddress;
      const to = '0x0987654321098765432109876543210987654321';
      const result = await safeTransferFrom(contract, from, to, validTokenId, transactionManager);
      expect(result).toBeDefined();
      expect(result.hash).toBe('0x123');
      expect(contract.safeTransferFrom).toHaveBeenCalledWith(from, to, validTokenId);
    });

    it('should update metadata successfully', async () => {
      await updateMetadata(contract, validTokenId, validIpfsHash);
      expect(contract.updateMetadata).toHaveBeenCalledWith(validTokenId, validIpfsHash);
    });

    it('should get token URI successfully', async () => {
      const result = await tokenURI(contract, validTokenId);
      expect(result).toBe(validTokenURI);
      expect(contract.tokenURI).toHaveBeenCalledWith(validTokenId);
    });
  });

  describe('Validation Management', () => {
    it('should update validation status successfully', async () => {
      const result = await updateValidationStatus(
        contract,
        validTokenId,
        true,
        validAddress,
        transactionManager
      );
      expect(result).toBeDefined();
      expect(result.hash).toBe('0x123');
      expect(contract.updateValidationStatus).toHaveBeenCalledWith(
        validTokenId,
        true,
        validAddress
      );
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

    it('should check if address is minter successfully', async () => {
      const result = await isMinter(contract, validAddress);
      expect(result).toBe(true);
      expect(contract.isMinter).toHaveBeenCalledWith(validAddress);
    });
  });

  describe('Marketplace Management', () => {
    it('should add approved marketplace successfully', async () => {
      await addApprovedMarketplace(contract, validAddress);
      expect(contract.addApprovedMarketplace).toHaveBeenCalledWith(validAddress);
    });

    it('should remove approved marketplace successfully', async () => {
      await removeApprovedMarketplace(contract, validAddress);
      expect(contract.removeApprovedMarketplace).toHaveBeenCalledWith(validAddress);
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

    it('should set transfer validator successfully', async () => {
      await setTransferValidator(contract, validAddress);
      expect(contract.setTransferValidator).toHaveBeenCalledWith(validAddress);
    });
  });

  describe('Error Handling', () => {
    it('should handle burn asset errors', async () => {
      jest.spyOn(contract, 'burnAsset').mockRejectedValue(new Error('Failed to burn asset'));
      await expect(burnAsset(contract, validTokenId, transactionManager))
        .rejects.toThrow('Failed to burn asset');
    });

    it('should handle transfer errors', async () => {
      jest.spyOn(contract, 'transferFrom').mockRejectedValue(new Error('Failed to transfer'));
      await expect(transferFrom(
        contract,
        validAddress,
        '0x0987654321098765432109876543210987654321',
        validTokenId,
        transactionManager
      )).rejects.toThrow('Failed to transfer');
    });

    it('should handle validation status update errors', async () => {
      jest.spyOn(contract, 'updateValidationStatus').mockRejectedValue(new Error('Failed to update status'));
      await expect(updateValidationStatus(
        contract,
        validTokenId,
        true,
        validAddress,
        transactionManager
      )).rejects.toThrow('Failed to update status');
    });
  });
}); 