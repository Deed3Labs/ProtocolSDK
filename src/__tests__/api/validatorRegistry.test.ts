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

describe('ValidatorRegistry API', () => {
  let contract: ethers.Contract;
  const validValidatorAddress = '0x1234567890123456789012345678901234567890';
  const validOwnerAddress = '0x0987654321098765432109876543210987654321';
  const validAssetTypeId = 1;
  const validValidatorName = 'Test Validator';
  const zeroAddress = '0x0000000000000000000000000000000000000000';

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

  describe('Validator Information', () => {
    it('should get validator owner successfully', async () => {
      const result = await getValidatorOwner(contract, validValidatorAddress);
      expect(result).toBe(validOwnerAddress);
      expect(contract.getValidatorOwner).toHaveBeenCalledWith(validValidatorAddress);
    });

    it('should get validator info successfully', async () => {
      const result = await getValidatorInfo(contract, validValidatorAddress);
      expect(result).toEqual({
        name: validValidatorName,
        owner: validOwnerAddress,
        isActive: true
      });
      expect(contract.getValidatorInfo).toHaveBeenCalledWith(validValidatorAddress);
    });

    it('should get validator name successfully', async () => {
      const result = await getValidatorName(contract, validValidatorAddress);
      expect(result).toBe(validValidatorName);
      expect(contract.getValidatorName).toHaveBeenCalledWith(validValidatorAddress);
    });

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

  describe('Validator Status', () => {
    it('should check if validator is active successfully', async () => {
      const result = await isValidatorActive(contract, validValidatorAddress);
      expect(result).toBe(true);
      expect(contract.isValidatorActive).toHaveBeenCalledWith(validValidatorAddress);
    });

    it('should check if validator is registered successfully', async () => {
      const result = await isValidatorRegistered(contract, validValidatorAddress);
      expect(result).toBe(true);
      expect(contract.isValidatorRegistered).toHaveBeenCalledWith(validValidatorAddress);
    });

    it('should handle inactive validator', async () => {
      jest.spyOn(contract, 'isValidatorActive').mockResolvedValueOnce(false);
      const result = await isValidatorActive(contract, validValidatorAddress);
      expect(result).toBe(false);
    });

    it('should handle unregistered validator', async () => {
      jest.spyOn(contract, 'isValidatorRegistered').mockResolvedValueOnce(false);
      const result = await isValidatorRegistered(contract, validValidatorAddress);
      expect(result).toBe(false);
    });
  });

  describe('Asset Type Validators', () => {
    it('should get validators for asset type successfully', async () => {
      const result = await getValidatorsForAssetType(contract, validAssetTypeId);
      expect(result).toEqual([validValidatorAddress]);
      expect(contract.getValidatorsForAssetType).toHaveBeenCalledWith(validAssetTypeId);
    });

    it('should handle empty validator list for asset type', async () => {
      jest.spyOn(contract, 'getValidatorsForAssetType').mockResolvedValueOnce([]);
      const result = await getValidatorsForAssetType(contract, validAssetTypeId);
      expect(result).toEqual([]);
    });

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

  describe('Error Handling', () => {
    it('should handle validator owner query error', async () => {
      jest.spyOn(contract, 'getValidatorOwner').mockRejectedValue(new Error('Failed to get validator owner'));
      await expect(getValidatorOwner(contract, validValidatorAddress))
        .rejects.toThrow('Failed to get validator owner');
    });

    it('should handle validator info query error', async () => {
      jest.spyOn(contract, 'getValidatorInfo').mockRejectedValue(new Error('Failed to get validator info'));
      await expect(getValidatorInfo(contract, validValidatorAddress))
        .rejects.toThrow('Failed to get validator info');
    });

    it('should handle validator status query error', async () => {
      jest.spyOn(contract, 'isValidatorActive').mockRejectedValue(new Error('Failed to check validator status'));
      await expect(isValidatorActive(contract, validValidatorAddress))
        .rejects.toThrow('Failed to check validator status');
    });

    it('should handle validator name query error', async () => {
      jest.spyOn(contract, 'getValidatorName').mockRejectedValue(new Error('Failed to get validator name'));
      await expect(getValidatorName(contract, validValidatorAddress))
        .rejects.toThrow('Failed to get validator name');
    });

    it('should handle asset type validators query error', async () => {
      jest.spyOn(contract, 'getValidatorsForAssetType').mockRejectedValue(new Error('Failed to get validators'));
      await expect(getValidatorsForAssetType(contract, validAssetTypeId))
        .rejects.toThrow('Failed to get validators');
    });
  });
}); 