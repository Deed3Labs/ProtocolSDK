import { Validator } from '../api/validator';
import { ethers } from 'ethers';

describe('Validator API', () => {
  let validator: Validator;
  const mockProvider = new ethers.providers.JsonRpcProvider();
  const mockAddress = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    validator = new Validator(mockProvider, mockAddress);
  });

  describe('validateDeed', () => {
    it('should validate a deed', async () => {
      const tokenId = 1;
      const result = await validator.validateDeed(tokenId);
      expect(result).toBeDefined();
    });
  });

  describe('validateOperatingAgreement', () => {
    it('should validate an operating agreement', async () => {
      const agreement = 'test agreement';
      const result = await validator.validateOperatingAgreement(agreement);
      expect(result).toBeDefined();
    });
  });

  describe('getValidationCriteria', () => {
    it('should get validation criteria for an asset type', async () => {
      const assetTypeId = 1;
      const result = await validator.getValidationCriteria(assetTypeId);
      expect(result).toBeDefined();
      expect(result.requiredTraits).toBeDefined();
      expect(result.additionalCriteria).toBeDefined();
      expect(result.requireOperatingAgreement).toBeDefined();
      expect(result.requireDefinition).toBeDefined();
    });
  });
}); 