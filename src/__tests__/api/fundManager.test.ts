import { expect, jest } from '@jest/globals';
import { ethers } from 'ethers';
import {
  mintDeedNFT,
  mintBatchDeedNFT,
  withdrawValidatorFees,
  getCommissionBalance,
  setCommissionPercentage,
  setFeeReceiver,
  setValidatorRegistry,
  setDeedNFT
} from '../../api/fundManager';
import { TEST_CONFIG, provider } from '../setup';

describe('FundManager API', () => {
  let contract: ethers.Contract;
  const validOwner = '0x1234567890123456789012345678901234567890';
  const validAssetType = 1;
  const validIpfsHash = 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';
  const validDefinition = 'Test Definition';
  const validConfiguration = 'Test Configuration';
  const validValidatorContract = '0x0987654321098765432109876543210987654321';
  const validToken = '0xabcdef1234567890abcdef1234567890abcdef12';
  const validSalt = 123;
  const validTokenId = 1;
  const validTokenIds = [1, 2, 3];
  const validCommissionBalance = 1000;
  const validCommissionPercentage = 5;
  const validFeeReceiver = '0xfedcba9876543210fedcba9876543210fedcba98';
  const validValidatorRegistry = '0x9876543210abcdef9876543210abcdef98765432';
  const validDeedNFT = '0xabcdef9876543210abcdef9876543210abcdef98';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock transaction response
    const mockTxResponse = {
      hash: '0x123',
      wait: async () => ({
        status: 1,
        logs: [{
          topics: ['0x0', '0x0', '0x0', '0x1'],
          data: '0x'
        }]
      } as unknown as ethers.TransactionReceipt),
      tokenId: validTokenId,
      tokenIds: validTokenIds
    } as unknown as ethers.TransactionResponse;

    // Create mock contract with proper types
    contract = {
      // Read functions
      getCommissionBalance: jest.fn<() => Promise<number>>().mockResolvedValue(validCommissionBalance),

      // Write functions
      mintDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      mintBatchDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      withdrawValidatorFees: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setCommissionPercentage: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setFeeReceiver: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setValidatorRegistry: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),

      interface: {
        format: () => ({})
      }
    } as unknown as ethers.Contract;
  });

  describe('DeedNFT Minting', () => {
    it('should mint single DeedNFT successfully', async () => {
      const result = await mintDeedNFT(
        contract,
        validOwner,
        validAssetType,
        validIpfsHash,
        validDefinition,
        validConfiguration,
        validValidatorContract,
        validToken,
        validSalt
      );

      expect(result).toBe(validTokenId);
      expect(contract.mintDeedNFT).toHaveBeenCalledWith(
        validOwner,
        validAssetType,
        validIpfsHash,
        validDefinition,
        validConfiguration,
        validValidatorContract,
        validToken,
        validSalt
      );
    });

    it('should mint batch DeedNFTs successfully', async () => {
      const deeds = [
        {
          owner: validOwner,
          assetType: validAssetType,
          ipfsDetailsHash: validIpfsHash,
          definition: validDefinition,
          configuration: validConfiguration,
          validatorContract: validValidatorContract,
          token: validToken,
          salt: validSalt
        }
      ];

      const result = await mintBatchDeedNFT(contract, deeds);
      expect(result).toEqual(validTokenIds);
      expect(contract.mintBatchDeedNFT).toHaveBeenCalledWith(deeds);
    });

    it('should handle empty batch minting', async () => {
      const emptyBatchResponse = {
        hash: '0x123',
        wait: async () => ({
          status: 1,
          logs: []
        } as unknown as ethers.TransactionReceipt),
        tokenIds: []
      } as unknown as ethers.TransactionResponse;

      jest.spyOn(contract, 'mintBatchDeedNFT').mockResolvedValueOnce(emptyBatchResponse);
      const result = await mintBatchDeedNFT(contract, []);
      expect(result).toEqual([]);
    });

    it('should handle multiple DeedNFTs in batch', async () => {
      const deeds = [
        {
          owner: validOwner,
          assetType: validAssetType,
          ipfsDetailsHash: validIpfsHash,
          definition: validDefinition,
          configuration: validConfiguration,
          validatorContract: validValidatorContract,
          token: validToken,
          salt: validSalt
        },
        {
          owner: validOwner,
          assetType: validAssetType + 1,
          ipfsDetailsHash: validIpfsHash,
          definition: validDefinition + ' 2',
          configuration: validConfiguration + ' 2',
          validatorContract: validValidatorContract,
          token: validToken,
          salt: validSalt + 1
        }
      ];

      const result = await mintBatchDeedNFT(contract, deeds);
      expect(result).toEqual(validTokenIds);
      expect(contract.mintBatchDeedNFT).toHaveBeenCalledWith(deeds);
    });
  });

  describe('Fee Management', () => {
    it('should withdraw validator fees successfully', async () => {
      await withdrawValidatorFees(contract, validValidatorContract, validToken);
      expect(contract.withdrawValidatorFees).toHaveBeenCalledWith(validValidatorContract, validToken);
    });

    it('should get commission balance successfully', async () => {
      const result = await getCommissionBalance(contract, validValidatorContract, validToken);
      expect(result).toBe(validCommissionBalance);
      expect(contract.getCommissionBalance).toHaveBeenCalledWith(validValidatorContract, validToken);
    });

    it('should set commission percentage successfully', async () => {
      await setCommissionPercentage(contract, validCommissionPercentage);
      expect(contract.setCommissionPercentage).toHaveBeenCalledWith(validCommissionPercentage);
    });

    it('should set fee receiver successfully', async () => {
      await setFeeReceiver(contract, validFeeReceiver);
      expect(contract.setFeeReceiver).toHaveBeenCalledWith(validFeeReceiver);
    });

    it('should handle zero commission balance', async () => {
      jest.spyOn(contract, 'getCommissionBalance').mockResolvedValueOnce(0);
      const result = await getCommissionBalance(contract, validValidatorContract, validToken);
      expect(result).toBe(0);
    });

    it('should handle maximum commission percentage', async () => {
      const maxPercentage = 100;
      await setCommissionPercentage(contract, maxPercentage);
      expect(contract.setCommissionPercentage).toHaveBeenCalledWith(maxPercentage);
    });
  });

  describe('Contract Configuration', () => {
    it('should set validator registry successfully', async () => {
      await setValidatorRegistry(contract, validValidatorRegistry);
      expect(contract.setValidatorRegistry).toHaveBeenCalledWith(validValidatorRegistry);
    });

    it('should set DeedNFT contract successfully', async () => {
      await setDeedNFT(contract, validDeedNFT);
      expect(contract.setDeedNFT).toHaveBeenCalledWith(validDeedNFT);
    });

    it('should handle setting same validator registry', async () => {
      await setValidatorRegistry(contract, validValidatorRegistry);
      await setValidatorRegistry(contract, validValidatorRegistry);
      expect(contract.setValidatorRegistry).toHaveBeenCalledTimes(2);
      expect(contract.setValidatorRegistry).toHaveBeenCalledWith(validValidatorRegistry);
    });

    it('should handle setting same DeedNFT contract', async () => {
      await setDeedNFT(contract, validDeedNFT);
      await setDeedNFT(contract, validDeedNFT);
      expect(contract.setDeedNFT).toHaveBeenCalledTimes(2);
      expect(contract.setDeedNFT).toHaveBeenCalledWith(validDeedNFT);
    });
  });

  describe('Error Handling', () => {
    it('should handle minting errors', async () => {
      jest.spyOn(contract, 'mintDeedNFT').mockRejectedValue(new Error('Failed to mint DeedNFT'));
      await expect(mintDeedNFT(
        contract,
        validOwner,
        validAssetType,
        validIpfsHash,
        validDefinition,
        validConfiguration,
        validValidatorContract,
        validToken,
        validSalt
      )).rejects.toThrow('Failed to mint DeedNFT');
    });

    it('should handle fee withdrawal errors', async () => {
      jest.spyOn(contract, 'withdrawValidatorFees').mockRejectedValue(new Error('Failed to withdraw fees'));
      await expect(withdrawValidatorFees(contract, validValidatorContract, validToken))
        .rejects.toThrow('Failed to withdraw fees');
    });

    it('should handle commission balance query errors', async () => {
      jest.spyOn(contract, 'getCommissionBalance').mockRejectedValue(new Error('Failed to get commission balance'));
      await expect(getCommissionBalance(contract, validValidatorContract, validToken))
        .rejects.toThrow('Failed to get commission balance');
    });

    it('should handle commission percentage setting errors', async () => {
      jest.spyOn(contract, 'setCommissionPercentage').mockRejectedValue(new Error('Failed to set commission percentage'));
      await expect(setCommissionPercentage(contract, validCommissionPercentage))
        .rejects.toThrow('Failed to set commission percentage');
    });

    it('should handle fee receiver setting errors', async () => {
      jest.spyOn(contract, 'setFeeReceiver').mockRejectedValue(new Error('Failed to set fee receiver'));
      await expect(setFeeReceiver(contract, validFeeReceiver))
        .rejects.toThrow('Failed to set fee receiver');
    });

    it('should handle validator registry setting errors', async () => {
      jest.spyOn(contract, 'setValidatorRegistry').mockRejectedValue(new Error('Failed to set validator registry'));
      await expect(setValidatorRegistry(contract, validValidatorRegistry))
        .rejects.toThrow('Failed to set validator registry');
    });

    it('should handle DeedNFT contract setting errors', async () => {
      jest.spyOn(contract, 'setDeedNFT').mockRejectedValue(new Error('Failed to set DeedNFT contract'));
      await expect(setDeedNFT(contract, validDeedNFT))
        .rejects.toThrow('Failed to set DeedNFT contract');
    });
  });
}); 