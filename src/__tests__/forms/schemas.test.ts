/**
 * Unit tests for the predefined form schemas.
 * Tests cover field structure, types, validation rules, options, and edge cases.
 * 
 * @group FormSchemas
 * @group Unit
 */
import { DeedNFTFormSchema, ValidatorFormSchema, FundManagerFormSchema } from '../../forms/schemas';

/**
 * Unit tests for the predefined form schemas.
 * Covers field structure, types, validation rules, options, and edge cases.
 */
describe('Form Schemas', () => {
  describe('DeedNFTFormSchema', () => {
    it('should have all required fields', () => {
      expect(DeedNFTFormSchema.fields).toHaveLength(6);
      expect(DeedNFTFormSchema.fields.map(f => f.name)).toEqual([
        'owner',
        'assetType',
        'ipfsDetailsHash',
        'definition',
        'configuration',
        'validatorAddress'
      ]);
    });

    it('should have correct field types', () => {
      const ownerField = DeedNFTFormSchema.fields.find(f => f.name === 'owner');
      expect(ownerField?.type).toBe('address');

      const assetTypeField = DeedNFTFormSchema.fields.find(f => f.name === 'assetType');
      expect(assetTypeField?.type).toBe('select');
      expect(assetTypeField?.options).toEqual(['Land', 'Building', 'Commercial']);

      const ipfsField = DeedNFTFormSchema.fields.find(f => f.name === 'ipfsDetailsHash');
      expect(ipfsField?.type).toBe('ipfs');
    });

    it('should have transform function that adds salt', () => {
      const values = {
        owner: '0x123',
        assetType: 'Land',
        ipfsDetailsHash: 'Qm123',
        definition: 'Test',
        configuration: 'Test',
        validatorAddress: '0x456'
      };
      const transformed = DeedNFTFormSchema.transform?.(values);
      expect(transformed).toHaveProperty('salt');
      expect(typeof transformed?.salt).toBe('bigint');
    });

    it('should have helpText and required for all fields', () => {
      for (const field of DeedNFTFormSchema.fields) {
        expect(field.required).toBe(true);
        expect(field.helpText).toBeDefined();
      }
    });
  });

  /**
   * Tests for Validator form schema
   * Verifies field structure, types, validation rules, and options
   */
  describe('ValidatorFormSchema', () => {
    it('should have all required fields', () => {
      expect(ValidatorFormSchema.fields).toHaveLength(4);
      expect(ValidatorFormSchema.fields.map(f => f.name)).toEqual([
        'name',
        'description',
        'supportedAssetTypes',
        'commissionPercentage'
      ]);
    });

    it('should have correct validation rules for commissionPercentage', () => {
      const commissionField = ValidatorFormSchema.fields.find(f => f.name === 'commissionPercentage');
      expect(commissionField?.validation).toEqual({
        min: 0,
        max: 100,
        message: 'Commission must be between 0 and 100'
      });
    });

    it('should have correct field types', () => {
      const nameField = ValidatorFormSchema.fields.find(f => f.name === 'name');
      expect(nameField?.type).toBe('text');

      const descriptionField = ValidatorFormSchema.fields.find(f => f.name === 'description');
      expect(descriptionField?.type).toBe('textarea');
    });

    it('should have options for supportedAssetTypes', () => {
      const supportedAssetTypesField = ValidatorFormSchema.fields.find(f => f.name === 'supportedAssetTypes');
      expect(supportedAssetTypesField?.options).toEqual(['Land', 'Building', 'Commercial']);
    });
  });

  /**
   * Tests for FundManager form schema
   * Verifies field structure, types, validation rules, and help text
   */
  describe('FundManagerFormSchema', () => {
    it('should have all required fields', () => {
      expect(FundManagerFormSchema.fields).toHaveLength(3);
      expect(FundManagerFormSchema.fields.map(f => f.name)).toEqual([
        'feeReceiver',
        'commissionPercentage',
        'validatorRegistry'
      ]);
    });

    it('should have correct field types', () => {
      const feeReceiverField = FundManagerFormSchema.fields.find(f => f.name === 'feeReceiver');
      expect(feeReceiverField?.type).toBe('address');

      const commissionField = FundManagerFormSchema.fields.find(f => f.name === 'commissionPercentage');
      expect(commissionField?.type).toBe('number');
    });

    it('should have correct validation rules for commissionPercentage', () => {
      const commissionField = FundManagerFormSchema.fields.find(f => f.name === 'commissionPercentage');
      expect(commissionField?.validation).toEqual({
        min: 0,
        max: 100,
        message: 'Commission must be between 0 and 100'
      });
    });

    it('should have helpText for all fields', () => {
      for (const field of FundManagerFormSchema.fields) {
        expect(field.helpText).toBeDefined();
      }
    });
  });
}); 