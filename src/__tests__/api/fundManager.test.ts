/**
 * @file FundManager API Test Suite
 * @description This test suite verifies the functionality of the FundManager contract API.
 * It tests fee management, commission handling, and fund distribution.
 * The suite uses mocked contract methods to simulate blockchain interactions.
 * 
 * @module FundManagerAPITest
 */

import { expect, jest } from '@jest/globals';
import { ethers } from 'ethers';
import { IFundManagerContract } from '../../contracts';
import {
  mintDeedNFT,
  mintBatchDeedNFT,
  withdrawValidatorFees,
  getCommissionBalance,
  setCommissionPercentage,
  setFeeReceiver,
  setValidatorRegistry,
  setDeedNFT,
  getCommissionPercentage,
  commissionPercentage,
  deedNFT,
  formatFee,
  collectCommission
} from '../../api/fundManager';
import { TEST_CONFIG, provider } from '../setup';
import { TransactionManager } from '../../utils/transactionManager';

/**
 * @description Test suite for the FundManager contract API
 */
describe('FundManager API', () => {
  let contract: IFundManagerContract;
  let transactionManager: TransactionManager;
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
  const validFundId = 1;
  const validAddress = '0x1234567890123456789012345678901234567890';
  const validAmount = ethers.parseEther('1.0');

  /**
   * @description Sets up the test environment before each test
   * - Resets all mocks
   * - Creates mock transaction response
   * - Initializes mock contract with all required functions
   */
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Initialize transaction manager
    transactionManager = new TransactionManager(provider);

    // Create mock transaction response
    const mockTxResponse = {
      hash: '0x123',
      from: '0x123',
      to: '0x456',
      status: 'confirmed' as const,
      receipt: {
        status: 1,
        logs: [{
          args: {
            tokenId: validTokenId
          }
        }]
      } as unknown as ethers.TransactionReceipt,
      wait: async () => ({
        status: 1,
        logs: [{
          args: {
            tokenId: validTokenId
          }
        }]
      } as unknown as ethers.TransactionReceipt)
    } as unknown as ethers.TransactionResponse;

    const mockBatchTxResponse = {
      hash: '0x123',
      from: '0x123',
      to: '0x456',
      status: 'confirmed' as const,
      receipt: {
        status: 1,
        logs: [{
          args: {
            tokenIds: validTokenIds
          }
        }]
      } as unknown as ethers.TransactionReceipt,
      wait: async () => ({
        status: 1,
        logs: [{
          args: {
            tokenIds: validTokenIds
          }
        }]
      } as unknown as ethers.TransactionReceipt)
    } as unknown as ethers.TransactionResponse;

    // Create mock contract with proper types
    contract = {
      // Read functions
      getCommissionBalance: jest.fn<() => Promise<number>>().mockResolvedValue(validCommissionBalance),
      getCommissionPercentage: jest.fn<() => Promise<number>>().mockResolvedValue(validCommissionPercentage),
      commissionPercentage: jest.fn<() => Promise<number>>().mockResolvedValue(validCommissionPercentage),
      deedNFT: jest.fn<() => Promise<string>>().mockResolvedValue(validDeedNFT),
      formatFee: jest.fn<() => Promise<string>>().mockResolvedValue('100'),

      // Write functions
      mintDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      mintBatchDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockBatchTxResponse),
      withdrawValidatorFees: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setCommissionPercentage: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setFeeReceiver: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setValidatorRegistry: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      collectCommission: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),

      interface: {
        format: () => ({})
      }
    } as unknown as IFundManagerContract;
  });

  /**
   * @description Test suite for DeedNFT minting operations
   */
  describe('DeedNFT Minting', () => {
    /**
     * @description Tests successful minting of a single DeedNFT
     */
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

      if (!result.receipt) throw new Error('Transaction receipt is null');
      const log = result.receipt.logs[0] as ethers.Log & { args: { tokenId: number } };
      const tokenId = log.args.tokenId;
      expect(tokenId).toBe(validTokenId);
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

    /**
     * @description Tests successful batch minting of DeedNFTs
     */
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

      const tx = await mintBatchDeedNFT(contract, deeds);
      if (!tx.receipt) throw new Error('Transaction receipt is null');
      const log = tx.receipt.logs[0] as ethers.Log & { args: { tokenIds: number[] } };
      const tokenIds = log.args.tokenIds;
      expect(tokenIds).toEqual(validTokenIds);
      expect(contract.mintBatchDeedNFT).toHaveBeenCalledWith(deeds);
    });

    /**
     * @description Tests handling of empty batch minting
     */
    it('should handle empty batch minting', async () => {
      const mockReceipt = {
        status: 1,
        logs: [{
          args: {
            tokenIds: []
          }
        }]
      } as unknown as ethers.TransactionReceipt;

      const mockTx = {
        hash: '0x123',
        from: '0x123',
        to: '0x456',
        status: 'confirmed' as const,
        receipt: mockReceipt,
        wait: async () => mockReceipt
      } as unknown as ethers.TransactionResponse;

      jest.spyOn(contract, 'mintBatchDeedNFT').mockResolvedValueOnce(mockTx);
      const tx = await mintBatchDeedNFT(contract, []);
      if (!tx.receipt) throw new Error('Transaction receipt is null');
      const log = tx.receipt.logs[0] as ethers.Log & { args: { tokenIds: number[] } };
      const tokenIds = log.args.tokenIds;
      expect(tokenIds).toEqual([]);
    });

    /**
     * @description Tests successful batch minting of multiple DeedNFTs
     */
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

      const tx = await mintBatchDeedNFT(contract, deeds);
      if (!tx.receipt) throw new Error('Transaction receipt is null');
      const log = tx.receipt.logs[0] as ethers.Log & { args: { tokenIds: number[] } };
      const tokenIds = log.args.tokenIds;
      expect(tokenIds).toEqual(validTokenIds);
      expect(contract.mintBatchDeedNFT).toHaveBeenCalledWith(deeds);
    });
  });

  /**
   * @description Test suite for fee management operations
   */
  describe('Fee Management', () => {
    /**
     * @description Tests successful withdrawal of validator fees
     */
    it('should withdraw validator fees successfully', async () => {
      await withdrawValidatorFees(contract, validValidatorContract, validToken);
      expect(contract.withdrawValidatorFees).toHaveBeenCalledWith(validValidatorContract, validToken);
    });

    /**
     * @description Tests successful retrieval of commission balance
     */
    it('should get commission balance successfully', async () => {
      const result = await getCommissionBalance(contract, validValidatorContract, validToken);
      expect(result).toBe(validCommissionBalance);
      expect(contract.getCommissionBalance).toHaveBeenCalledWith(validValidatorContract, validToken);
    });

    /**
     * @description Tests successful setting of commission percentage
     */
    it('should set commission percentage successfully', async () => {
      await setCommissionPercentage(contract, validCommissionPercentage);
      expect(contract.setCommissionPercentage).toHaveBeenCalledWith(validCommissionPercentage);
    });

    /**
     * @description Tests successful setting of fee receiver
     */
    it('should set fee receiver successfully', async () => {
      await setFeeReceiver(contract, validFeeReceiver);
      expect(contract.setFeeReceiver).toHaveBeenCalledWith(validFeeReceiver);
    });

    /**
     * @description Tests handling of zero commission balance
     */
    it('should handle zero commission balance', async () => {
      jest.spyOn(contract, 'getCommissionBalance').mockResolvedValueOnce(0);
      const result = await getCommissionBalance(contract, validValidatorContract, validToken);
      expect(result).toBe(0);
    });

    /**
     * @description Tests handling of maximum commission percentage
     */
    it('should handle maximum commission percentage', async () => {
      const maxPercentage = 100;
      await setCommissionPercentage(contract, maxPercentage);
      expect(contract.setCommissionPercentage).toHaveBeenCalledWith(maxPercentage);
    });
  });

  /**
   * @description Test suite for contract configuration operations
   */
  describe('Contract Configuration', () => {
    /**
     * @description Tests successful setting of validator registry
     */
    it('should set validator registry successfully', async () => {
      await setValidatorRegistry(contract, validValidatorRegistry);
      expect(contract.setValidatorRegistry).toHaveBeenCalledWith(validValidatorRegistry);
    });

    /**
     * @description Tests successful setting of DeedNFT contract
     */
    it('should set DeedNFT contract successfully', async () => {
      await setDeedNFT(contract, validDeedNFT);
      expect(contract.setDeedNFT).toHaveBeenCalledWith(validDeedNFT);
    });

    /**
     * @description Tests handling of setting the same validator registry multiple times
     */
    it('should handle setting same validator registry', async () => {
      await setValidatorRegistry(contract, validValidatorRegistry);
      await setValidatorRegistry(contract, validValidatorRegistry);
      expect(contract.setValidatorRegistry).toHaveBeenCalledTimes(2);
      expect(contract.setValidatorRegistry).toHaveBeenCalledWith(validValidatorRegistry);
    });

    /**
     * @description Tests handling of setting the same DeedNFT contract multiple times
     */
    it('should handle setting same DeedNFT contract', async () => {
      await setDeedNFT(contract, validDeedNFT);
      await setDeedNFT(contract, validDeedNFT);
      expect(contract.setDeedNFT).toHaveBeenCalledTimes(2);
      expect(contract.setDeedNFT).toHaveBeenCalledWith(validDeedNFT);
    });
  });

  /**
   * @description Test suite for error handling scenarios
   */
  describe('Error Handling', () => {
    /**
     * @description Tests handling of DeedNFT minting errors
     */
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

    /**
     * @description Tests handling of fee withdrawal errors
     */
    it('should handle fee withdrawal errors', async () => {
      jest.spyOn(contract, 'withdrawValidatorFees').mockRejectedValue(new Error('Failed to withdraw fees'));
      await expect(withdrawValidatorFees(contract, validValidatorContract, validToken))
        .rejects.toThrow('Failed to withdraw fees');
    });

    /**
     * @description Tests handling of commission balance query errors
     */
    it('should handle commission balance query errors', async () => {
      jest.spyOn(contract, 'getCommissionBalance').mockRejectedValue(new Error('Failed to get commission balance'));
      await expect(getCommissionBalance(contract, validValidatorContract, validToken))
        .rejects.toThrow('Failed to get commission balance');
    });

    /**
     * @description Tests handling of commission percentage setting errors
     */
    it('should handle commission percentage setting errors', async () => {
      jest.spyOn(contract, 'setCommissionPercentage').mockRejectedValue(new Error('Failed to set commission percentage'));
      await expect(setCommissionPercentage(contract, validCommissionPercentage))
        .rejects.toThrow('Failed to set commission percentage');
    });

    /**
     * @description Tests handling of fee receiver setting errors
     */
    it('should handle fee receiver setting errors', async () => {
      jest.spyOn(contract, 'setFeeReceiver').mockRejectedValue(new Error('Failed to set fee receiver'));
      await expect(setFeeReceiver(contract, validFeeReceiver))
        .rejects.toThrow('Failed to set fee receiver');
    });

    /**
     * @description Tests handling of validator registry setting errors
     */
    it('should handle validator registry setting errors', async () => {
      jest.spyOn(contract, 'setValidatorRegistry').mockRejectedValue(new Error('Failed to set validator registry'));
      await expect(setValidatorRegistry(contract, validValidatorRegistry))
        .rejects.toThrow('Failed to set validator registry');
    });

    /**
     * @description Tests handling of DeedNFT contract setting errors
     */
    it('should handle DeedNFT contract setting errors', async () => {
      jest.spyOn(contract, 'setDeedNFT').mockRejectedValue(new Error('Failed to set DeedNFT contract'));
      await expect(setDeedNFT(contract, validDeedNFT))
        .rejects.toThrow('Failed to set DeedNFT contract');
    });
  });

  describe('getCommissionPercentage', () => {
    it('should get the commission percentage', async () => {
      const percentage = await getCommissionPercentage(contract);
      expect(contract.getCommissionPercentage).toHaveBeenCalled();
      expect(percentage).toBeDefined();
    });
  });

  describe('commissionPercentage', () => {
    it('should get the commission percentage', async () => {
      const percentage = await commissionPercentage(contract);
      expect(contract.commissionPercentage).toHaveBeenCalled();
      expect(percentage).toBeDefined();
    });
  });

  describe('deedNFT', () => {
    it('should get the DeedNFT contract address', async () => {
      const address = await deedNFT(contract);
      expect(contract.deedNFT).toHaveBeenCalled();
      expect(address).toBeDefined();
    });
  });

  describe('formatFee', () => {
    it('should format the fee', async () => {
      const amount = 100;
      const formattedFee = await formatFee(contract, amount);
      expect(contract.formatFee).toHaveBeenCalledWith(amount);
      expect(formattedFee).toBeDefined();
    });
  });

  describe('collectCommission', () => {
    it('should collect commission', async () => {
      const tokenId = 1;
      const amount = 100;
      const token = '0x1234567890123456789012345678901234567890';
      await collectCommission(contract, tokenId, amount, token);
      expect(contract.collectCommission).toHaveBeenCalledWith(tokenId, amount, token);
    });
  });

  describe('mintDeedNFT', () => {
    it('should mint a deed NFT', async () => {
      const owner = '0x1234567890123456789012345678901234567890';
      const assetType = 0;
      const ipfsDetailsHash = 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';
      const definition = 'test';
      const configuration = 'test';
      const validatorContract = '0x1234567890123456789012345678901234567890';
      const token = '0x1234567890123456789012345678901234567890';
      const salt = 1;
      const tokenId = await mintDeedNFT(contract, owner, assetType, ipfsDetailsHash, definition, configuration, validatorContract, token, salt);
      expect(contract.mintDeedNFT).toHaveBeenCalledWith(owner, assetType, ipfsDetailsHash, definition, configuration, validatorContract, token, salt);
      expect(tokenId).toBeDefined();
    });
  });

  describe('mintBatchDeedNFT', () => {
    it('should mint multiple deed NFTs', async () => {
      const deeds = [
        {
          owner: '0x1234567890123456789012345678901234567890',
          assetType: 0,
          ipfsDetailsHash: 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t',
          definition: 'test',
          configuration: 'test',
          validatorContract: '0x1234567890123456789012345678901234567890',
          token: '0x1234567890123456789012345678901234567890',
          salt: 1
        }
      ];
      const tx = await mintBatchDeedNFT(contract, deeds);
      expect(contract.mintBatchDeedNFT).toHaveBeenCalledWith(deeds);
      expect(tx).toBeDefined();
    });
  });

  describe('getCommissionBalance', () => {
    it('should get the commission balance', async () => {
      const validator = '0x1234567890123456789012345678901234567890';
      const token = '0x1234567890123456789012345678901234567890';
      const balance = await getCommissionBalance(contract, validator, token);
      expect(contract.getCommissionBalance).toHaveBeenCalledWith(validator, token);
      expect(balance).toBeDefined();
    });
  });

  describe('withdrawValidatorFees', () => {
    it('should withdraw validator fees', async () => {
      const validatorContract = '0x1234567890123456789012345678901234567890';
      const token = '0x1234567890123456789012345678901234567890';
      await withdrawValidatorFees(contract, validatorContract, token);
      expect(contract.withdrawValidatorFees).toHaveBeenCalledWith(validatorContract, token);
    });
  });

  describe('setCommissionPercentage', () => {
    it('should set the commission percentage', async () => {
      const percentage = 5;
      await setCommissionPercentage(contract, percentage);
      expect(contract.setCommissionPercentage).toHaveBeenCalledWith(percentage);
    });
  });

  describe('setFeeReceiver', () => {
    it('should set the fee receiver', async () => {
      const feeReceiver = '0x1234567890123456789012345678901234567890';
      await setFeeReceiver(contract, feeReceiver);
      expect(contract.setFeeReceiver).toHaveBeenCalledWith(feeReceiver);
    });
  });
}); 