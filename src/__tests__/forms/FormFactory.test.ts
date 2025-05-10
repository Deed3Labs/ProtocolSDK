/**
 * Unit tests for the FormFactory class.
 * Tests cover singleton pattern, form creation, management, options, and edge cases.
 * 
 * @group FormFactory
 * @group Unit
 */
import { FormFactory } from '../../forms/FormFactory';
import { FormHandler } from '../../forms/FormHandler';
import { FormSchema } from '../../forms/types';
import { DeedNFTFormSchema, ValidatorFormSchema, FundManagerFormSchema } from '../../forms/schemas';

describe('FormFactory', () => {
  let formFactory: FormFactory;

  beforeEach(() => {
    formFactory = FormFactory.getInstance();
    formFactory.clearForms();
  });

  /**
   * Tests for singleton pattern implementation
   */
  describe('getInstance', () => {
    it('should return the same instance (singleton)', () => {
      const instance1 = FormFactory.getInstance();
      const instance2 = FormFactory.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  /**
   * Tests for form creation functionality
   * Covers creation of different form types and error handling
   */
  describe('createForm', () => {
    it('should create a DeedNFT form', () => {
      const form = formFactory.createForm('deedNFT');
      expect(form).toBeInstanceOf(FormHandler);
      expect(form.getValues()).toEqual({});
    });

    it('should create a Validator form', () => {
      const form = formFactory.createForm('validator');
      expect(form).toBeInstanceOf(FormHandler);
      expect(form.getValues()).toEqual({});
    });

    it('should create a FundManager form', () => {
      const form = formFactory.createForm('fundManager');
      expect(form).toBeInstanceOf(FormHandler);
      expect(form.getValues()).toEqual({});
    });

    it('should create a custom form', () => {
      const customSchema: FormSchema = {
        fields: [
          {
            name: 'customField',
            type: 'text',
            label: 'Custom Field',
            required: true
          }
        ]
      };

      const form = formFactory.createForm('custom', undefined, customSchema);
      expect(form).toBeInstanceOf(FormHandler);
      expect(form.getValues()).toEqual({});
    });

    it('should throw error for custom form without schema', () => {
      expect(() => formFactory.createForm('custom')).toThrow();
    });

    it('should throw error for unknown form type', () => {
      expect(() => formFactory.createForm('unknown' as any)).toThrow();
    });

    it('should allow concurrent creation of multiple forms', () => {
      const form1 = formFactory.createForm('deedNFT');
      const form2 = formFactory.createForm('validator');
      expect(form1).not.toBe(form2);
      expect(formFactory.getActiveForms().length).toBe(2);
    });
  });

  /**
   * Tests for form management functionality
   * Covers form retrieval, removal, and tracking
   */
  describe('form management', () => {
    it('should get form by ID', () => {
      const form = formFactory.createForm('deedNFT');
      const formId = formFactory.getActiveForms()[0];
      const retrievedForm = formFactory.getForm(formId);
      expect(retrievedForm).toBe(form);
    });

    it('should remove form and not retrieve it after removal', () => {
      const form = formFactory.createForm('deedNFT');
      const formId = formFactory.getActiveForms()[0];
      formFactory.removeForm(formId);
      expect(formFactory.getForm(formId)).toBeUndefined();
    });

    it('should clear all forms and leave none active', () => {
      formFactory.createForm('deedNFT');
      formFactory.createForm('validator');
      formFactory.clearForms();
      expect(formFactory.getActiveForms()).toHaveLength(0);
    });

    it('should track active forms correctly', () => {
      formFactory.createForm('deedNFT');
      formFactory.createForm('validator');
      const activeForms = formFactory.getActiveForms();
      expect(activeForms).toHaveLength(2);
      expect(activeForms[0]).toContain('deedNFT');
      expect(activeForms[1]).toContain('validator');
    });

    it('should clear forms after removal of all', () => {
      const form1 = formFactory.createForm('deedNFT');
      const form2 = formFactory.createForm('validator');
      const ids = formFactory.getActiveForms();
      formFactory.removeForm(ids[0]);
      formFactory.removeForm(ids[1]);
      expect(formFactory.getActiveForms()).toHaveLength(0);
    });
  });

  /**
   * Tests for form options handling
   * Covers initialization values and validation settings
   */
  describe('form options', () => {
    it('should apply form options (initialValues, validateOnChange, validateOnBlur)', () => {
      const options = {
        validateOnChange: false,
        validateOnBlur: true,
        initialValues: { test: 'value' }
      };

      const form = formFactory.createForm('deedNFT', options);
      expect(form.getValues()).toEqual({ test: 'value' });
    });

    it('should propagate options to FormHandler', async () => {
      const options = {
        validateOnChange: false,
        validateOnBlur: true,
        initialValues: { owner: '0xabc' },
        onSubmit: jest.fn()
      };
      const form = formFactory.createForm('deedNFT', options);
      await form.setValue('owner', '0xdef');
      expect(form.getValues().owner).toBe('0xdef');
    });
  });
}); 