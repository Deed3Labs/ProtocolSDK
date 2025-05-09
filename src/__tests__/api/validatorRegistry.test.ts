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
import {
  getValidatorOwner,
  getValidatorInfo,
  getValidatorsForAssetType,
  isValidatorActive,
  isValidatorRegistered,
  getValidatorName
} from '../../api/validatorRegistry';
import { TEST_CONFIG, provider } from '../setup';

/**
 * @description Test suite for the ValidatorRegistry contract API
 */
describe('ValidatorRegistry API', () => {
  let contract: ethers.Contract;
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

      interface: {
        format: () => ({})
      }
    } as unknown as ethers.Contract;
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
}); 