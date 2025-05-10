import { ethers } from 'ethers';
import { ValidationSystem } from '../utils/validation';
import { ValidationError } from '../types/errors';
import {
  FormSchema,
  FormState,
  FormField,
  FormOptions,
  FormEvent,
  FormError
} from './types';

/**
 * Handles form state management, validation, and submission
 * 
 * @example
 * ```typescript
 * const form = new FormHandler(schema, {
 *   validateOnChange: true,
 *   onSubmit: async (values) => {
 *     await submitToAPI(values);
 *   }
 * });
 * 
 * await form.setValue('name', 'John');
 * const isValid = await form.validateAll();
 * if (isValid) {
 *   await form.submit();
 * }
 * ```
 */
export class FormHandler {
  private schema: FormSchema;
  private state: FormState;
  private options: FormOptions;
  private eventListeners: ((event: FormEvent) => void)[] = [];

  /**
   * Creates a new form handler instance
   * 
   * @param schema - The form schema defining fields and validation rules
   * @param options - Configuration options for form behavior
   */
  constructor(schema: FormSchema, options: FormOptions = {}) {
    this.schema = schema;
    this.options = {
      validateOnChange: true,
      validateOnBlur: true,
      validateOnSubmit: true,
      ...options
    };
    this.state = {
      values: options.initialValues || {},
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
      isDirty: false
    };
  }

  /**
   * Sets a field value and triggers validation if configured
   * 
   * @param field - Name of the field to set
   * @param value - New value for the field
   * @throws {FormError} If field is not found in schema
   */
  async setValue(field: string, value: any): Promise<void> {
    const fieldSchema = this.getFieldSchema(field);
    if (!fieldSchema) {
      throw new FormError(`Field ${field} not found in schema`, field);
    }

    // Update value
    this.state.values[field] = value;
    this.state.touched[field] = true;
    this.state.isDirty = true;

    // Validate if needed
    if (this.options.validateOnChange) {
      await this.validateField(field);
    }

    // Check dependencies
    this.checkDependencies(field);

    // Notify listeners
    this.notifyListeners({
      type: 'change',
      field,
      value,
      errors: this.state.errors
    });

    // Update state
    this.updateState();
  }

  /**
   * Gets the current value of a field
   * 
   * @param field - Name of the field to get
   * @returns The current value of the field
   */
  getValue(field: string): any {
    return this.state.values[field];
  }

  /**
   * Gets all current form values
   * 
   * @returns Object containing all field values
   */
  getValues(): Record<string, any> {
    return { ...this.state.values };
  }

  /**
   * Gets the current error message for a field
   * 
   * @param field - Name of the field to get error for
   * @returns Error message if field has an error, undefined otherwise
   */
  getError(field: string): string | undefined {
    return this.state.errors[field];
  }

  /**
   * Gets all current form errors
   * 
   * @returns Object containing all field errors
   */
  getErrors(): Record<string, string> {
    return { ...this.state.errors };
  }

  /**
   * Validates a single field according to its schema rules
   * 
   * @param field - Name of the field to validate
   * @returns True if field is valid, false otherwise
   */
  async validateField(field: string): Promise<boolean> {
    const fieldSchema = this.getFieldSchema(field);
    if (!fieldSchema) return true;

    // Skip validation for disabled fields
    if (fieldSchema.disabled) {
      delete this.state.errors[field];
      return true;
    }

    try {
      const value = this.state.values[field];

      // Required check
      if (fieldSchema.required && (value === undefined || value === null || value === '')) {
        this.state.errors[field] = 'This field is required';
        return false;
      }

      // Skip validation if no value and not required
      if (!fieldSchema.required && (value === undefined || value === null || value === '')) {
        delete this.state.errors[field];
        return true;
      }

      // Type-specific validation
      switch (fieldSchema.type) {
        case 'address':
          ValidationSystem.validateAddress(value);
          break;
        case 'ipfs':
          ValidationSystem.validateIpfsHash(value, field);
          break;
        case 'number':
          if (fieldSchema.validation?.min !== undefined) {
            ValidationSystem.validateNumberRange(
              value,
              fieldSchema.validation.min,
              fieldSchema.validation.max || Infinity,
              field
            );
          }
          break;
      }

      // Custom validation
      if (fieldSchema.validation?.custom) {
        const isValid = await fieldSchema.validation.custom(value);
        if (!isValid) {
          this.state.errors[field] = fieldSchema.validation.message || 'Invalid value';
          return false;
        }
      }

      // Pattern validation
      if (fieldSchema.validation?.pattern) {
        if (!fieldSchema.validation.pattern.test(value)) {
          this.state.errors[field] = fieldSchema.validation.message || 'Invalid format';
          return false;
        }
      }

      delete this.state.errors[field];
      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        this.state.errors[field] = error.message;
      } else {
        this.state.errors[field] = 'Validation failed';
      }
      return false;
    }
  }

  /**
   * Validates all form fields and runs form-level validation
   * 
   * @returns True if all fields and form-level validation pass, false otherwise
   */
  async validateAll(): Promise<boolean> {
    let isValid = true;
    for (const field of this.schema.fields) {
      if (!(await this.validateField(field.name))) {
        isValid = false;
      }
    }

    // Run form-level validation if exists
    if (this.schema.validate) {
      try {
        const formValid = await this.schema.validate(this.state.values);
        if (!formValid) {
          isValid = false;
        }
      } catch (error) {
        isValid = false;
      }
    }

    this.state.isValid = isValid;
    return isValid;
  }

  /**
   * Submits the form, running validation and transformation if configured
   * 
   * @throws {FormError} If form validation fails
   * @throws {Error} If submission handler throws
   */
  async submit(): Promise<void> {
    if (this.state.isSubmitting) return;

    this.state.isSubmitting = true;
    this.updateState();

    try {
      if (this.options.validateOnSubmit) {
        const isValid = await this.validateAll();
        if (!isValid) {
          throw new FormError('Form validation failed');
        }
      }

      let values = this.state.values;
      if (this.schema.transform) {
        values = this.schema.transform(values);
      }

      if (this.options.onSubmit) {
        await this.options.onSubmit(values);
      }

      this.notifyListeners({ type: 'submit', errors: this.state.errors });
    } catch (error) {
      if (this.options.onError) {
        this.options.onError(this.state.errors);
      }
      throw error;
    } finally {
      this.state.isSubmitting = false;
      this.updateState();
    }
  }

  /**
   * Resets the form to its initial state
   */
  reset(): void {
    this.state = {
      values: this.options.initialValues || {},
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: false,
      isDirty: false
    };
    this.notifyListeners({ type: 'reset' });
    this.updateState();
  }

  /**
   * Adds an event listener for form events
   * 
   * @param listener - Function to call when form events occur
   */
  addEventListener(listener: (event: FormEvent) => void): void {
    this.eventListeners.push(listener);
  }

  /**
   * Removes an event listener
   * 
   * @param listener - The listener function to remove
   */
  removeEventListener(listener: (event: FormEvent) => void): void {
    this.eventListeners = this.eventListeners.filter(l => l !== listener);
  }

  /**
   * Gets the current form state
   * 
   * @returns Current form state
   */
  getState(): FormState {
    return { ...this.state };
  }

  /**
   * Gets the schema for a field
   * 
   * @param field - Name of the field
   * @returns Field schema if found, undefined otherwise
   */
  private getFieldSchema(field: string): FormField | undefined {
    return this.schema.fields.find(f => f.name === field);
  }

  /**
   * Checks and updates field dependencies
   * 
   * @param field - Name of the field that changed
   */
  private checkDependencies(field: string): void {
    for (const formField of this.schema.fields) {
      if (!formField.dependencies) continue;

      for (const dependency of formField.dependencies) {
        if (dependency.field === field) {
          const value = this.state.values[field];
          const shouldUpdate = value === dependency.value;

          switch (dependency.action) {
            case 'show':
              formField.hidden = !shouldUpdate;
              break;
            case 'hide':
              formField.hidden = shouldUpdate;
              break;
            case 'enable':
              formField.disabled = !shouldUpdate;
              break;
            case 'disable':
              formField.disabled = shouldUpdate;
              break;
          }
        }
      }
    }
  }

  /**
   * Notifies all event listeners of a form event
   * 
   * @param event - The event to notify listeners about
   */
  private notifyListeners(event: FormEvent): void {
    for (const listener of this.eventListeners) {
      listener(event);
    }
  }

  /**
   * Updates form state and notifies state change listeners
   */
  private updateState(): void {
    if (this.options.onStateChange) {
      this.options.onStateChange(this.getState());
    }
  }
} 