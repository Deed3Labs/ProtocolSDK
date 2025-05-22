/**
 * @file ValidatorRegistry API Test Suite
 * @description This test suite verifies the functionality of the ValidatorRegistry contract API.
 * It tests validator registration, status management, and asset type validation.
 * The suite uses mocked contract methods to simulate blockchain interactions.
 * 
 * @module ValidatorRegistryAPITest
 */

import { expect, jest } from '@jest/globals';
import { ethers } from 'ethers';
import { IValidatorRegistryContract } from '../../contracts';
import {
  getValidatorOwner,
  getValidatorInfo,
  getValidatorsForAssetType,
  isValidatorActive,
  isValidatorRegistered,
  getValidatorName,
  registerValidator,
  getActiveValidators,
  setFundManager
} from '../../api/validatorRegistry';
import { TEST_CONFIG, provider } from '../setup';
import * as validatorRegistryApi from '../../api/validatorRegistry';
import { TransactionManager } from '../../utils/transactionManager';

/**
 * @description Test suite for the ValidatorRegistry contract API
 */
describe('ValidatorRegistry API', () => {
  let contract: IValidatorRegistryContract;
  let transactionManager: TransactionManager;
  const validValidatorAddress = '0x1234567890123456789012345678901234567890';
  const validOwnerAddress = '0x0987654321098765432109876543210987654321';
  const validAssetTypeId = 1;
  const validValidatorName = 'Test Validator';
  const zeroAddress = '0x0000000000000000000000000000000000000000';

  /**
   * @description Sets up the test environment before each test
   * - Resets all mocks
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
      wait: async () => ({
        status: 1,
        logs: [{
          topics: ['0x0', '0x0', '0x0', '0x1'],
          data: '0x'
        }]
      } as unknown as ethers.TransactionReceipt)
    } as ethers.TransactionResponse;

    // Create mock contract with proper types
    contract = {
      // Read functions
      getValidatorOwner: jest.fn<() => Promise<string>>().mockResolvedValue(validOwnerAddress),
      getValidatorInfo: jest.fn<() => Promise<any>>().mockResolvedValue({
        name: validValidatorName,
        owner: validOwnerAddress,
        isActive: true
      }),
      getValidatorsForAssetType: jest.fn<() => Promise<string[]>>()
        .mockResolvedValue([validValidatorAddress]),
      isValidatorActive: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      isValidatorRegistered: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getValidatorName: jest.fn<() => Promise<string>>().mockResolvedValue(validValidatorName),
      getValidatorAssetTypes: jest.fn<() => Promise<number[]>>().mockResolvedValue([validAssetTypeId]),
      getSupportedAssetTypes: jest.fn<() => Promise<number[]>>().mockResolvedValue([validAssetTypeId]),
      getActiveValidators: jest.fn<() => Promise<string[]>>().mockResolvedValue([validValidatorAddress]),

      // Write functions
      updateValidatorName: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      updateValidatorStatus: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      removeValidator: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      registerValidator: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setFundManager: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),

      interface: {
        format: () => ({})
      },
      runner: { provider: provider }
    } as unknown as IValidatorRegistryContract;
  });

  /**
   * @description Test suite for validator information retrieval
   */
  describe('Validator Information', () => {
    /**
     * @description Tests successful retrieval of validator owner
     */
    it('should get validator owner successfully', async () => {
      const result = await getValidatorOwner(contract, validValidatorAddress);
      expect(result).toBe(validOwnerAddress);
      expect(contract.getValidatorOwner).toHaveBeenCalledWith(validValidatorAddress);
    });

    /**
     * @description Tests successful retrieval of validator information
     */
    it('should get validator info successfully', async () => {
      const result = await getValidatorInfo(contract, validValidatorAddress);
      expect(result).toEqual({
        name: validValidatorName,
        owner: validOwnerAddress,
        isActive: true
      });
      expect(contract.getValidatorInfo).toHaveBeenCalledWith(validValidatorAddress);
    });

    /**
     * @description Tests successful retrieval of validator name
     */
    it('should get validator name successfully', async () => {
      const result = await getValidatorName(contract, validValidatorAddress);
      expect(result).toBe(validValidatorName);
      expect(contract.getValidatorName).toHaveBeenCalledWith(validValidatorAddress);
    });

    /**
     * @description Tests handling of empty validator information
     */
    it('should handle empty validator info', async () => {
      jest.spyOn(contract, 'getValidatorInfo').mockResolvedValueOnce({
        name: '',
        owner: zeroAddress,
        isActive: false
      });
      const result = await getValidatorInfo(contract, validValidatorAddress);
      expect(result).toEqual({
        name: '',
        owner: zeroAddress,
        isActive: false
      });
    });
  });

  /**
   * @description Test suite for validator status checks
   */
  describe('Validator Status', () => {
    /**
     * @description Tests successful check of validator active status
     */
    it('should check if validator is active successfully', async () => {
      const result = await isValidatorActive(contract, validValidatorAddress);
      expect(result).toBe(true);
      expect(contract.isValidatorActive).toHaveBeenCalledWith(validValidatorAddress);
    });

    /**
     * @description Tests successful check of validator registration status
     */
    it('should check if validator is registered successfully', async () => {
      const result = await isValidatorRegistered(contract, validValidatorAddress);
      expect(result).toBe(true);
      expect(contract.isValidatorRegistered).toHaveBeenCalledWith(validValidatorAddress);
    });

    /**
     * @description Tests handling of inactive validator status
     */
    it('should handle inactive validator', async () => {
      jest.spyOn(contract, 'isValidatorActive').mockResolvedValueOnce(false);
      const result = await isValidatorActive(contract, validValidatorAddress);
      expect(result).toBe(false);
    });

    /**
     * @description Tests handling of unregistered validator status
     */
    it('should handle unregistered validator', async () => {
      jest.spyOn(contract, 'isValidatorRegistered').mockResolvedValueOnce(false);
      const result = await isValidatorRegistered(contract, validValidatorAddress);
      expect(result).toBe(false);
    });
  });

  /**
   * @description Test suite for asset type validator management
   */
  describe('Asset Type Validators', () => {
    /**
     * @description Tests successful retrieval of validators for an asset type
     */
    it('should get validators for asset type successfully', async () => {
      const result = await getValidatorsForAssetType(contract, validAssetTypeId);
      expect(result).toEqual([validValidatorAddress]);
      expect(contract.getValidatorsForAssetType).toHaveBeenCalledWith(validAssetTypeId);
    });

    /**
     * @description Tests handling of empty validator list for an asset type
     */
    it('should handle empty validator list for asset type', async () => {
      jest.spyOn(contract, 'getValidatorsForAssetType').mockResolvedValueOnce([]);
      const result = await getValidatorsForAssetType(contract, validAssetTypeId);
      expect(result).toEqual([]);
    });

    /**
     * @description Tests handling of multiple validators for an asset type
     */
    it('should handle multiple validators for asset type', async () => {
      const multipleValidators = [
        validValidatorAddress,
        '0x0987654321098765432109876543210987654321',
        '0xabcdef1234567890abcdef1234567890abcdef12'
      ];
      jest.spyOn(contract, 'getValidatorsForAssetType').mockResolvedValueOnce(multipleValidators);
      const result = await getValidatorsForAssetType(contract, validAssetTypeId);
      expect(result).toEqual(multipleValidators);
    });
  });

  /**
   * @description Test suite for error handling scenarios
   */
  describe('Error Handling', () => {
    /**
     * @description Tests handling of validator owner query errors
     */
    it('should handle validator owner query error', async () => {
      jest.spyOn(contract, 'getValidatorOwner').mockRejectedValue(new Error('Failed to get validator owner'));
      await expect(getValidatorOwner(contract, validValidatorAddress))
        .rejects.toThrow('Failed to get validator owner');
    });

    /**
     * @description Tests handling of validator info query errors
     */
    it('should handle validator info query error', async () => {
      jest.spyOn(contract, 'getValidatorInfo').mockRejectedValue(new Error('Failed to get validator info'));
      await expect(getValidatorInfo(contract, validValidatorAddress))
        .rejects.toThrow('Failed to get validator info');
    });

    /**
     * @description Tests handling of validator status query errors
     */
    it('should handle validator status query error', async () => {
      jest.spyOn(contract, 'isValidatorActive').mockRejectedValue(new Error('Failed to check validator status'));
      await expect(isValidatorActive(contract, validValidatorAddress))
        .rejects.toThrow('Failed to check validator status');
    });

    /**
     * @description Tests handling of validator name query errors
     */
    it('should handle validator name query error', async () => {
      jest.spyOn(contract, 'getValidatorName').mockRejectedValue(new Error('Failed to get validator name'));
      await expect(getValidatorName(contract, validValidatorAddress))
        .rejects.toThrow('Failed to get validator name');
    });

    /**
     * @description Tests handling of asset type validators query errors
     */
    it('should handle asset type validators query error', async () => {
      jest.spyOn(contract, 'getValidatorsForAssetType').mockRejectedValue(new Error('Failed to get validators'));
      await expect(getValidatorsForAssetType(contract, validAssetTypeId))
        .rejects.toThrow('Failed to get validators');
    });
  });

  describe('Additional ValidatorRegistry API Coverage', () => {
    let contract: any;
    beforeEach(() => {
      contract = {
        getValidatorAssetTypes: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        getSupportedAssetTypes: jest.fn<() => Promise<number[]>>().mockResolvedValue([1, 2]),
        updateValidatorName: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        updateValidatorStatus: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        removeValidator: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        runner: { provider }
      };
    });

    it('should get validator asset types', async () => {
      await validatorRegistryApi.getValidatorAssetTypes(contract, '0xabc');
      expect(contract.getValidatorAssetTypes).toHaveBeenCalledWith('0xabc');
    });

    it('should get supported asset types', async () => {
      const result = await validatorRegistryApi.getSupportedAssetTypes(contract, '0xabc');
      expect(contract.getSupportedAssetTypes).toHaveBeenCalledWith('0xabc');
      expect(result).toEqual([1, 2]);
    });

    it('should update validator name', async () => {
      await validatorRegistryApi.updateValidatorName(contract, '0xabc', 'New Name');
      expect(contract.updateValidatorName).toHaveBeenCalledWith('0xabc', 'New Name');
    });

    it('should update validator status', async () => {
      await validatorRegistryApi.updateValidatorStatus(contract, '0xabc', true);
      expect(contract.updateValidatorStatus).toHaveBeenCalledWith('0xabc', true);
    });

    it('should remove validator', async () => {
      await validatorRegistryApi.removeValidator(contract, '0xabc');
      expect(contract.removeValidator).toHaveBeenCalledWith('0xabc');
    });
  });

  describe('Validator Registration', () => {
    it('should register validator successfully', async () => {
      const name = 'New Validator';
      const description = 'Test Description';
      const supportedAssetTypes = [1, 2];
      await registerValidator(contract, validValidatorAddress, name, description, supportedAssetTypes);
      expect(contract.registerValidator).toHaveBeenCalledWith(
        validValidatorAddress,
        name,
        description,
        supportedAssetTypes
      );
    });

    it('should handle empty supported asset types in registration', async () => {
      const name = 'New Validator';
      const description = 'Test Description';
      await registerValidator(contract, validValidatorAddress, name, description, []);
      expect(contract.registerValidator).toHaveBeenCalledWith(
        validValidatorAddress,
        name,
        description,
        []
      );
    });
  });

  describe('Active Validators', () => {
    it('should get active validators successfully', async () => {
      const result = await getActiveValidators(contract);
      expect(result).toEqual([validValidatorAddress]);
      expect(contract.getActiveValidators).toHaveBeenCalled();
    });

    it('should handle empty active validators list', async () => {
      jest.spyOn(contract, 'getActiveValidators').mockResolvedValueOnce([]);
      const result = await getActiveValidators(contract);
      expect(result).toEqual([]);
    });
  });

  describe('Fund Manager Management', () => {
    it('should set fund manager successfully', async () => {
      const fundManager = '0x1234567890123456789012345678901234567890';
      await setFundManager(contract, fundManager);
      expect(contract.setFundManager).toHaveBeenCalledWith(fundManager);
    });

    it('should handle invalid fund manager address', async () => {
      const invalidAddress = '0xinvalid';
      jest.spyOn(contract, 'setFundManager').mockRejectedValueOnce(new Error('Invalid fund manager address'));
      await expect(setFundManager(contract, invalidAddress))
        .rejects.toThrow('Invalid fund manager address');
    });
  });
}); 