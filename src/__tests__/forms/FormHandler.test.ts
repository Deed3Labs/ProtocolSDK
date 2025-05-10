/**
 * Unit tests for the FormHandler class.
 * Tests cover value management, validation, submission, events, state, and edge cases.
 * 
 * @group FormHandler
 * @group Unit
 */
import { FormHandler } from '../../forms/FormHandler';
import { FormSchema, FormField, FormError } from '../../forms/types';

describe('FormHandler', () => {
  let formHandler: FormHandler;
  /**
   * Mock schema used for testing form functionality
   * Includes fields for testing text validation, number ranges, and address validation
   */
  const mockSchema: FormSchema = {
    fields: [
      {
        name: 'testField',
        type: 'text',
        label: 'Test Field',
        required: true,
        validation: {
          pattern: /^[A-Za-z]+$/,
          message: 'Only letters are allowed'
        }
      },
      {
        name: 'numberField',
        type: 'number',
        label: 'Number Field',
        required: true,
        validation: {
          min: 0,
          max: 100,
          message: 'Must be between 0 and 100'
        }
      },
      {
        name: 'addressField',
        type: 'address',
        label: 'Address Field',
        required: true
      }
    ]
  };

  beforeEach(() => {
    formHandler = new FormHandler(mockSchema);
  });

  /**
   * Tests for setting field values and validation on change
   */
  describe('setValue', () => {
    it('should set a field value', async () => {
      await formHandler.setValue('testField', 'abc');
      expect(formHandler.getValue('testField')).toBe('abc');
    });

    it('should validate field on change when validateOnChange is true', async () => {
      await formHandler.setValue('testField', '123');
      expect(formHandler.getError('testField')).toBe('Only letters are allowed');
    });

    it('should throw error for non-existent field', async () => {
      await expect(formHandler.setValue('nonExistent', 'value'))
        .rejects
        .toThrow(FormError);
    });
  });

  /**
   * Tests for field validation functionality
   * Covers required fields, number ranges, address format, and async validation
   */
  describe('validation', () => {
    it('should validate required fields (empty value)', async () => {
      await formHandler.validateField('testField');
      expect(formHandler.getError('testField')).toBe('This field is required');
    });

    it('should validate number range (out of bounds)', async () => {
      await formHandler.setValue('numberField', 150);
      await formHandler.validateField('numberField');
      expect(formHandler.getError('numberField')).toBe('numberField must be between 0 and 100');
    });

    it('should validate address format (invalid address)', async () => {
      await formHandler.setValue('addressField', 'invalid-address');
      await formHandler.validateField('addressField');
      expect(formHandler.getError('addressField')).toBeTruthy();
    });

    it('should validate all fields (all valid)', async () => {
      await formHandler.setValue('testField', 'abc');
      await formHandler.setValue('numberField', 50);
      await formHandler.setValue('addressField', '0x1234567890123456789012345678901234567890');
      
      const isValid = await formHandler.validateAll();
      expect(isValid).toBe(true);
    });

    it('should support async custom validation', async () => {
      const asyncSchema: FormSchema = {
        fields: [
          {
            name: 'asyncField',
            type: 'text',
            label: 'Async Field',
            required: true,
            validation: {
              custom: async (value) => {
                await new Promise(res => setTimeout(res, 10));
                return value === 'pass';
              },
              message: 'Async validation failed'
            }
          }
        ]
      };
      const asyncHandler = new FormHandler(asyncSchema);
      await asyncHandler.setValue('asyncField', 'fail');
      await asyncHandler.validateField('asyncField');
      expect(asyncHandler.getError('asyncField')).toBe('Async validation failed');
      await asyncHandler.setValue('asyncField', 'pass');
      await asyncHandler.validateField('asyncField');
      expect(asyncHandler.getError('asyncField')).toBeUndefined();
    });
  });

  /**
   * Tests for field dependencies and disabled/hidden field behavior
   */
  describe('dependencies and disabled/hidden fields', () => {
    it('should handle field dependencies (show/hide)', async () => {
      const depSchema: FormSchema = {
        fields: [
          {
            name: 'toggle',
            type: 'select',
            label: 'Toggle',
            required: true,
            options: ['show', 'hide'],
            defaultValue: 'show'
          },
          {
            name: 'dependent',
            type: 'text',
            label: 'Dependent',
            required: true,
            dependencies: [
              { field: 'toggle', value: 'hide', action: 'hide' },
              { field: 'toggle', value: 'show', action: 'show' }
            ]
          }
        ]
      };
      const depHandler = new FormHandler(depSchema);
      await depHandler.setValue('toggle', 'hide');
      // The dependent field should be hidden
      const depField = depSchema.fields.find(f => f.name === 'dependent');
      expect(depField?.hidden).toBe(true);
      await depHandler.setValue('toggle', 'show');
      expect(depField?.hidden).toBe(false);
    });

    it('should not validate disabled fields', async () => {
      const disabledSchema: FormSchema = {
        fields: [
          {
            name: 'disabledField',
            type: 'text',
            label: 'Disabled',
            required: true,
            disabled: true
          }
        ]
      };
      const disabledHandler = new FormHandler(disabledSchema);
      await disabledHandler.validateField('disabledField');
      // Should not set error for disabled field
      expect(disabledHandler.getError('disabledField')).toBeUndefined();
    });
  });

  /**
   * Tests for form submission functionality
   * Covers valid/invalid submission, onSubmit callback, and form reset
   */
  describe('form submission', () => {
    it('should submit valid form and call onSubmit', async () => {
      const mockSubmit = jest.fn();
      formHandler = new FormHandler(mockSchema, {
        onSubmit: mockSubmit
      });

      await formHandler.setValue('testField', 'abc');
      await formHandler.setValue('numberField', 50);
      await formHandler.setValue('addressField', '0x1234567890123456789012345678901234567890');

      await formHandler.submit();
      expect(mockSubmit).toHaveBeenCalled();
    });

    it('should not submit invalid form and not call onSubmit', async () => {
      const mockSubmit = jest.fn();
      formHandler = new FormHandler(mockSchema, {
        onSubmit: mockSubmit
      });

      await formHandler.setValue('testField', '123');
      await expect(formHandler.submit()).rejects.toThrow();
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should reset form state after submission and reset', async () => {
      await formHandler.setValue('testField', 'abc');
      await formHandler.setValue('numberField', 50);
      await formHandler.setValue('addressField', '0x1234567890123456789012345678901234567890');
      await formHandler.submit();
      formHandler.reset();
      const state = formHandler.getState();
      expect(state.values).toEqual({});
      expect(state.errors).toEqual({});
      expect(state.isDirty).toBe(false);
    });
  });

  /**
   * Tests for form event handling
   * Covers field change and form reset events
   */
  describe('event handling', () => {
    it('should notify listeners on field change', async () => {
      const mockListener = jest.fn();
      formHandler.addEventListener(mockListener);

      await formHandler.setValue('testField', 'abc');
      expect(mockListener).toHaveBeenCalledWith(expect.objectContaining({
        type: 'change',
        field: 'testField',
        value: 'abc'
      }));
    });

    it('should notify listeners on form reset', () => {
      const mockListener = jest.fn();
      formHandler.addEventListener(mockListener);

      formHandler.reset();
      expect(mockListener).toHaveBeenCalledWith(expect.objectContaining({
        type: 'reset'
      }));
    });
  });

  /**
   * Tests for form state management
   * Covers state tracking and reset functionality
   */
  describe('form state', () => {
    it('should track form state correctly and call onStateChange', async () => {
      const stateListener = jest.fn();
      formHandler = new FormHandler(mockSchema, {
        onStateChange: stateListener
      });

      await formHandler.setValue('testField', 'abc');
      expect(stateListener).toHaveBeenCalledWith(expect.objectContaining({
        values: expect.objectContaining({
          testField: 'abc'
        }),
        isDirty: true
      }));
    });

    it('should reset form state to initial values', () => {
      formHandler.reset();
      const state = formHandler.getState();
      expect(state.values).toEqual({});
      expect(state.errors).toEqual({});
      expect(state.isDirty).toBe(false);
    });
  });
}); 