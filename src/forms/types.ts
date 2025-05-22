import { ethers } from 'ethers';

/**
 * Supported field types for form inputs
 */
export type FieldType = 
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'address'
  | 'ipfs'
  | 'array'
  | 'object';

/**
 * Validation rules for form fields
 */
export interface ValidationRule {
  /** Minimum value for number fields */
  min?: number;
  /** Maximum value for number fields */
  max?: number;
  /** Regular expression pattern for text validation */
  pattern?: RegExp;
  /** Custom validation function */
  custom?: (value: any) => boolean | Promise<boolean>;
  /** Error message to display when validation fails */
  message?: string;
}

/**
 * Configuration for a form field
 */
export interface FormField {
  /** Unique identifier for the field */
  name: string;
  /** Type of input field */
  type: FieldType;
  /** Display label for the field */
  label: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the field is required */
  required: boolean;
  /** Validation rules for the field */
  validation?: ValidationRule;
  /** Options for select fields */
  options?: string[];
  /** Default value for the field */
  defaultValue?: any;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is hidden */
  hidden?: boolean;
  /** Help text to display below the field */
  helpText?: string;
  /** Field dependencies for conditional rendering/behavior */
  dependencies?: {
    /** Name of the field this depends on */
    field: string;
    /** Value that triggers the dependency */
    value: any;
    /** Action to take when dependency is met */
    action: 'show' | 'hide' | 'enable' | 'disable';
  }[];
  fields?: FormField[]; // For object type fields
}

/**
 * Schema defining the structure and behavior of a form
 */
export interface FormSchema {
  /** Array of form fields */
  fields: FormField[];
  /** Custom validation function for the entire form */
  validate?: (values: Record<string, any>) => boolean | Promise<boolean>;
  /** Function to transform form values before submission */
  transform?: (values: Record<string, any>) => Record<string, any>;
}

/**
 * Current state of a form
 */
export interface FormState {
  /** Current values of all form fields */
  values: Record<string, any>;
  /** Current validation errors */
  errors: Record<string, string>;
  /** Fields that have been interacted with */
  touched: Record<string, boolean>;
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Whether the form is currently valid */
  isValid: boolean;
  /** Whether any field has been modified */
  isDirty: boolean;
}

/**
 * Events that can occur during form interaction
 */
export interface FormEvent {
  /** Type of event */
  type: 'change' | 'blur' | 'submit' | 'reset';
  /** Name of the field that triggered the event */
  field?: string;
  /** New value of the field */
  value?: any;
  /** Current validation errors */
  errors?: Record<string, string>;
}

/**
 * Configuration options for form behavior
 */
export interface FormOptions {
  /** Whether to validate on field change */
  validateOnChange?: boolean;
  /** Whether to validate on field blur */
  validateOnBlur?: boolean;
  /** Whether to validate on form submission */
  validateOnSubmit?: boolean;
  /** Initial values for form fields */
  initialValues?: Record<string, any>;
  /** Handler for form submission */
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  /** Handler for validation errors */
  onError?: (errors: Record<string, string>) => void;
  /** Handler for form state changes */
  onStateChange?: (state: FormState) => void;
}

/**
 * Custom error class for form-related errors
 */
export class FormError extends Error {
  /**
   * @param message - Error message
   * @param field - Name of the field that caused the error
   * @param code - Error code for programmatic handling
   * @param context - Additional error context
   */
  constructor(
    message: string,
    public field?: string,
    public code?: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'FormError';
  }
} 