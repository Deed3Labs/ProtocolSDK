/**
 * Unit tests for the predefined form schemas.
 * Tests cover field structure, types, validation rules, options, and edge cases.
 * 
 * @group FormSchemas
 * @group Unit
 */
import { DeedNFTFormSchema, ValidatorFormSchema, FundManagerFormSchema, MetadataRendererFormSchema, ValidatorRegistryFormSchema } from '../../forms/schemas';

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
      expect(ValidatorFormSchema.fields).toHaveLength(9);
      expect(ValidatorFormSchema.fields.map(f => f.name)).toEqual([
        'name',
        'description',
        'supportedAssetTypes',
        'baseUri',
        'defaultOperatingAgreement',
        'serviceFee',
        'royaltyFeePercentage',
        'royaltyReceiver',
        'fundManager'
      ]);
    });

    it('should have correct validation rules for royaltyFeePercentage', () => {
      const royaltyField = ValidatorFormSchema.fields.find(f => f.name === 'royaltyFeePercentage');
      expect(royaltyField?.validation).toEqual({
        min: 0,
        max: 1000,
        message: 'Royalty fee must be between 0 and 1000'
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
      expect(FundManagerFormSchema.fields).toHaveLength(4);
      expect(FundManagerFormSchema.fields.map(f => f.name)).toEqual([
        'feeReceiver',
        'commissionPercentage',
        'validatorRegistry',
        'deedNFT'
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
        max: 1000,
        message: 'Commission must be between 0 and 1000'
      });
    });

    it('should have helpText for all fields', () => {
      for (const field of FundManagerFormSchema.fields) {
        expect(field.helpText).toBeDefined();
      }
    });
  });

  /**
   * Tests for MetadataRenderer form schema
   * Verifies field structure, types, validation rules, and nested fields
   */
  describe('MetadataRendererFormSchema', () => {
    it('should have all required fields', () => {
      expect(MetadataRendererFormSchema.fields.map(f => f.name)).toEqual([
        'tokenId',
        'customMetadata',
        'features',
        'assetCondition',
        'legalInfo',
        'gallery',
        'animationURL',
        'externalLink'
      ]);
    });

    it('should have correct field types', () => {
      const tokenIdField = MetadataRendererFormSchema.fields.find(f => f.name === 'tokenId');
      expect(tokenIdField?.type).toBe('number');
      const customMetadataField = MetadataRendererFormSchema.fields.find(f => f.name === 'customMetadata');
      expect(customMetadataField?.type).toBe('textarea');
      const featuresField = MetadataRendererFormSchema.fields.find(f => f.name === 'features');
      expect(featuresField?.type).toBe('array');
      const assetConditionField = MetadataRendererFormSchema.fields.find(f => f.name === 'assetCondition');
      expect(assetConditionField?.type).toBe('object');
      const legalInfoField = MetadataRendererFormSchema.fields.find(f => f.name === 'legalInfo');
      expect(legalInfoField?.type).toBe('object');
      const galleryField = MetadataRendererFormSchema.fields.find(f => f.name === 'gallery');
      expect(galleryField?.type).toBe('array');
      const animationURLField = MetadataRendererFormSchema.fields.find(f => f.name === 'animationURL');
      expect(animationURLField?.type).toBe('text');
      const externalLinkField = MetadataRendererFormSchema.fields.find(f => f.name === 'externalLink');
      expect(externalLinkField?.type).toBe('text');
    });

    it('should validate customMetadata as JSON', () => {
      const customMetadataField = MetadataRendererFormSchema.fields.find(f => f.name === 'customMetadata');
      expect(customMetadataField?.validation?.custom && customMetadataField.validation.custom('{"foo":1}')).toBe(true);
      expect(customMetadataField?.validation?.custom && customMetadataField.validation.custom('not-json')).toBe(false);
    });

    it('should validate features as array of strings', () => {
      const featuresField = MetadataRendererFormSchema.fields.find(f => f.name === 'features');
      expect(featuresField?.validation?.custom && featuresField.validation.custom(['a', 'b'])).toBe(true);
      expect(featuresField?.validation?.custom && featuresField.validation.custom([1, 2])).toBe(false);
    });

    it('should validate gallery as array of URLs', () => {
      const galleryField = MetadataRendererFormSchema.fields.find(f => f.name === 'gallery');
      expect(galleryField?.validation?.custom && galleryField.validation.custom(['http://a.com', 'https://b.com'])).toBe(true);
      expect(galleryField?.validation?.custom && galleryField.validation.custom(['not-a-url'])).toBe(false);
    });

    it('should validate animationURL as video/gif file', () => {
      const animationURLField = MetadataRendererFormSchema.fields.find(f => f.name === 'animationURL');
      expect(animationURLField?.validation?.custom && animationURLField.validation.custom('https://a.com/vid.mp4')).toBe(true);
      expect(animationURLField?.validation?.custom && animationURLField.validation.custom('https://a.com/file.txt')).toBe(false);
    });

    it('should validate externalLink as URL', () => {
      const externalLinkField = MetadataRendererFormSchema.fields.find(f => f.name === 'externalLink');
      expect(externalLinkField?.validation?.custom && externalLinkField.validation.custom('https://a.com')).toBe(true);
      expect(externalLinkField?.validation?.custom && externalLinkField.validation.custom('not-a-url')).toBe(false);
    });

    it('should have nested fields for assetCondition and legalInfo', () => {
      const assetConditionField = MetadataRendererFormSchema.fields.find(f => f.name === 'assetCondition');
      expect(assetConditionField?.fields?.map(f => f.name)).toEqual([
        'generalCondition',
        'lastInspectionDate',
        'knownIssues',
        'improvements',
        'additionalNotes'
      ]);
      const legalInfoField = MetadataRendererFormSchema.fields.find(f => f.name === 'legalInfo');
      expect(legalInfoField?.fields?.map(f => f.name)).toEqual([
        'jurisdiction',
        'registrationNumber',
        'registrationDate',
        'documents',
        'restrictions',
        'additionalInfo'
      ]);
    });
  });

  describe('ValidatorRegistryFormSchema', () => {
    it('should have all required fields', () => {
      expect(ValidatorRegistryFormSchema.fields).toHaveLength(5);
      expect(ValidatorRegistryFormSchema.fields.map(f => f.name)).toEqual([
        'name',
        'description',
        'supportedAssetTypes',
        'fundManager',
        'activeValidators'
      ]);
    });

    it('should have correct field types', () => {
      const nameField = ValidatorRegistryFormSchema.fields.find(f => f.name === 'name');
      expect(nameField?.type).toBe('text');

      const descriptionField = ValidatorRegistryFormSchema.fields.find(f => f.name === 'description');
      expect(descriptionField?.type).toBe('textarea');

      const fundManagerField = ValidatorRegistryFormSchema.fields.find(f => f.name === 'fundManager');
      expect(fundManagerField?.type).toBe('address');

      const activeValidatorsField = ValidatorRegistryFormSchema.fields.find(f => f.name === 'activeValidators');
      expect(activeValidatorsField?.type).toBe('array');
    });

    it('should validate activeValidators as array of addresses', () => {
      const activeValidatorsField = ValidatorRegistryFormSchema.fields.find(f => f.name === 'activeValidators');
      expect(activeValidatorsField?.validation?.custom && activeValidatorsField.validation.custom([
        '0x1234567890123456789012345678901234567890',
        '0x0987654321098765432109876543210987654321'
      ])).toBe(true);
      expect(activeValidatorsField?.validation?.custom && activeValidatorsField.validation.custom([
        '0xinvalid',
        '0x1234567890123456789012345678901234567890'
      ])).toBe(false);
    });
  });
}); 