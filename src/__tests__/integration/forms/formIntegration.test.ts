/**
 * Integration tests for the form handling system.
 * Tests the interaction between FormHandler, FormFactory, and predefined schemas.
 * 
 * @group FormIntegration
 * @group Integration
 */
import { FormFactory } from '../../../forms/FormFactory';
import { FormHandler } from '../../../forms/FormHandler';
import { DeedNFTFormSchema, ValidatorFormSchema, FundManagerFormSchema } from '../../../forms/schemas';
import { ethers } from 'ethers';

describe('Form Integration Tests', () => {
  let formFactory: FormFactory;
  const mockProvider = new ethers.JsonRpcProvider('http://localhost:8545');
  const mockSigner = new ethers.Wallet('0x1234567890123456789012345678901234567890123456789012345678901234', mockProvider);

  beforeEach(() => {
    formFactory = FormFactory.getInstance();
    formFactory.clearForms();
  });

  /**
   * Tests for DeedNFT form integration
   * Verifies complete form submission flow and validation error handling
   */
  describe('DeedNFT Form Flow', () => {
    let deedNFTForm: FormHandler;

    beforeEach(() => {
      deedNFTForm = formFactory.createForm('deedNFT', {
        validateOnChange: true,
        validateOnBlur: true
      });
    });

    it('should handle complete DeedNFT form submission flow', async () => {
      let submittedValues: any = null;
      deedNFTForm = formFactory.createForm('deedNFT', {
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values) => {
          submittedValues = values;
        }
      });
      // Set valid values
      await deedNFTForm.setValue('owner', '0x1234567890123456789012345678901234567890');
      await deedNFTForm.setValue('assetType', 'Land');
      await deedNFTForm.setValue('ipfsDetailsHash', 'Qm' + 'a'.repeat(44));
      await deedNFTForm.setValue('definition', 'Test Definition');
      await deedNFTForm.setValue('configuration', 'Test Config');
      await deedNFTForm.setValue('validatorAddress', '0x9876543210987654321098765432109876543210');

      // Validate all fields
      const isValid = await deedNFTForm.validateAll();
      if (!isValid) {
        // Debug: log errors if validation fails
        // eslint-disable-next-line no-console
        console.log('DeedNFT form errors:', deedNFTForm.getErrors());
      }
      expect(isValid).toBe(true);

      // Submit form
      const submitPromise = deedNFTForm.submit();
      await expect(submitPromise).resolves.not.toThrow();

      // Check transformed values from onSubmit
      expect(submittedValues).toHaveProperty('salt');
      expect(typeof submittedValues.salt).toBe('bigint');
    });

    it('should handle validation errors in DeedNFT form', async () => {
      // Set invalid values
      await deedNFTForm.setValue('owner', 'invalid-address');
      await deedNFTForm.setValue('assetType', 'InvalidType');
      await deedNFTForm.setValue('ipfsDetailsHash', 'invalid-hash');

      // Validate all fields
      const isValid = await deedNFTForm.validateAll();
      expect(isValid).toBe(false);

      // Check error messages
      expect(deedNFTForm.getError('owner')).toBeTruthy();
      expect(deedNFTForm.getError('assetType')).toBeTruthy();
      expect(deedNFTForm.getError('ipfsDetailsHash')).toBeTruthy();
    });
  });

  /**
   * Tests for Validator form integration
   * Verifies complete form submission flow and validation error handling
   */
  describe('Validator Form Flow', () => {
    let validatorForm: FormHandler;

    beforeEach(() => {
      validatorForm = formFactory.createForm('validator', {
        validateOnChange: true,
        validateOnBlur: true
      });
    });

    it('should handle complete Validator form submission flow', async () => {
      // Set valid values
      await validatorForm.setValue('name', 'Test Validator');
      await validatorForm.setValue('description', 'Test Description');
      await validatorForm.setValue('supportedAssetTypes', ['Land', 'Building']);
      await validatorForm.setValue('commissionPercentage', 50);

      // Validate all fields
      const isValid = await validatorForm.validateAll();
      expect(isValid).toBe(true);

      // Submit form
      const submitPromise = validatorForm.submit();
      await expect(submitPromise).resolves.not.toThrow();
    });

    it('should handle validation errors in Validator form', async () => {
      // Set invalid values
      await validatorForm.setValue('name', '');
      await validatorForm.setValue('commissionPercentage', 150);

      // Validate all fields
      const isValid = await validatorForm.validateAll();
      expect(isValid).toBe(false);

      // Check error messages
      expect(validatorForm.getError('name')).toBe('This field is required');
      expect(validatorForm.getError('commissionPercentage')).toBe('commissionPercentage must be between 0 and 100');
    });
  });

  /**
   * Tests for FundManager form integration
   * Verifies complete form submission flow and validation error handling
   */
  describe('FundManager Form Flow', () => {
    let fundManagerForm: FormHandler;

    beforeEach(() => {
      fundManagerForm = formFactory.createForm('fundManager', {
        validateOnChange: true,
        validateOnBlur: true
      });
    });

    it('should handle complete FundManager form submission flow', async () => {
      // Set valid values
      await fundManagerForm.setValue('feeReceiver', '0x1234567890123456789012345678901234567890');
      await fundManagerForm.setValue('commissionPercentage', 25);
      await fundManagerForm.setValue('validatorRegistry', '0x9876543210987654321098765432109876543210');

      // Validate all fields
      const isValid = await fundManagerForm.validateAll();
      expect(isValid).toBe(true);

      // Submit form
      const submitPromise = fundManagerForm.submit();
      await expect(submitPromise).resolves.not.toThrow();
    });

    it('should handle validation errors in FundManager form', async () => {
      // Set invalid values
      await fundManagerForm.setValue('feeReceiver', 'invalid-address');
      await fundManagerForm.setValue('commissionPercentage', -10);

      // Validate all fields
      const isValid = await fundManagerForm.validateAll();
      expect(isValid).toBe(false);

      // Check error messages
      expect(fundManagerForm.getError('feeReceiver')).toBeTruthy();
      expect(fundManagerForm.getError('commissionPercentage')).toBe('commissionPercentage must be between 0 and 100');
    });
  });

  /**
   * Tests for FormFactory integration
   * Verifies multiple form instance management and cleanup
   */
  describe('Form Factory Integration', () => {
    it('should manage multiple form instances correctly', async () => {
      // Create multiple forms
      const deedNFTForm = formFactory.createForm('deedNFT');
      const validatorForm = formFactory.createForm('validator');
      const fundManagerForm = formFactory.createForm('fundManager');

      // Set values in each form
      await deedNFTForm.setValue('owner', '0x1234567890123456789012345678901234567890');
      await validatorForm.setValue('name', 'Test Validator');
      await fundManagerForm.setValue('feeReceiver', '0x9876543210987654321098765432109876543210');

      // Verify form values are maintained separately
      expect(deedNFTForm.getValue('owner')).toBe('0x1234567890123456789012345678901234567890');
      expect(validatorForm.getValue('name')).toBe('Test Validator');
      expect(fundManagerForm.getValue('feeReceiver')).toBe('0x9876543210987654321098765432109876543210');

      // Verify active forms tracking
      const activeForms = formFactory.getActiveForms();
      expect(activeForms).toHaveLength(3);
    });

    it('should handle form removal and cleanup', async () => {
      // Create forms
      const deedNFTForm = formFactory.createForm('deedNFT');
      const validatorForm = formFactory.createForm('validator');

      // Get form IDs
      const activeForms = formFactory.getActiveForms();
      const deedNFTFormId = activeForms[0];
      const validatorFormId = activeForms[1];

      // Remove one form
      formFactory.removeForm(deedNFTFormId);

      // Verify remaining form
      expect(formFactory.getForm(deedNFTFormId)).toBeUndefined();
      expect(formFactory.getForm(validatorFormId)).toBe(validatorForm);

      // Clear all forms
      formFactory.clearForms();
      expect(formFactory.getActiveForms()).toHaveLength(0);
    });
  });
}); 