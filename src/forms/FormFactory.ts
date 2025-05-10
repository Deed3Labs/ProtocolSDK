import { FormHandler } from './FormHandler';
import { FormSchema, FormOptions } from './types';
import { DeedNFTFormSchema, ValidatorFormSchema, FundManagerFormSchema } from './schemas';

/**
 * Factory class for creating and managing form instances
 * Implements the Singleton pattern to ensure a single instance manages all forms
 * 
 * @example
 * ```typescript
 * const factory = FormFactory.getInstance();
 * 
 * // Create a DeedNFT form
 * const deedNFTForm = factory.createForm('deedNFT', {
 *   validateOnChange: true
 * });
 * 
 * // Create a custom form
 * const customForm = factory.createForm('custom', {
 *   validateOnChange: true
 * }, {
 *   fields: [
 *     {
 *       name: 'customField',
 *       type: 'text',
 *       required: true
 *     }
 *   ]
 * });
 * ```
 */
export class FormFactory {
  private static instance: FormFactory;
  private formHandlers: Map<string, FormHandler>;

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.formHandlers = new Map();
  }

  /**
   * Gets the singleton instance of FormFactory
   * 
   * @returns The singleton FormFactory instance
   */
  public static getInstance(): FormFactory {
    if (!FormFactory.instance) {
      FormFactory.instance = new FormFactory();
    }
    return FormFactory.instance;
  }

  /**
   * Creates a new form instance with the specified type and options
   * 
   * @param formType - Type of form to create ('deedNFT', 'validator', 'fundManager', or 'custom')
   * @param options - Optional form configuration options
   * @param customSchema - Required schema for custom form type
   * @returns A new FormHandler instance
   * @throws {Error} If form type is unknown or custom schema is missing for custom form type
   */
  public createForm(
    formType: 'deedNFT' | 'validator' | 'fundManager' | 'custom',
    options?: FormOptions,
    customSchema?: FormSchema
  ): FormHandler {
    let schema: FormSchema;

    switch (formType) {
      case 'deedNFT':
        schema = DeedNFTFormSchema;
        break;
      case 'validator':
        schema = ValidatorFormSchema;
        break;
      case 'fundManager':
        schema = FundManagerFormSchema;
        break;
      case 'custom':
        if (!customSchema) {
          throw new Error('Custom schema is required for custom form type');
        }
        schema = customSchema;
        break;
      default:
        throw new Error(`Unknown form type: ${formType}`);
    }

    const formHandler = new FormHandler(schema, options);
    const formId = `${formType}_${Date.now()}`;
    this.formHandlers.set(formId, formHandler);

    return formHandler;
  }

  /**
   * Gets a form handler by its ID
   * 
   * @param formId - ID of the form to retrieve
   * @returns The FormHandler instance if found, undefined otherwise
   */
  public getForm(formId: string): FormHandler | undefined {
    return this.formHandlers.get(formId);
  }

  /**
   * Removes a form handler by its ID
   * 
   * @param formId - ID of the form to remove
   */
  public removeForm(formId: string): void {
    this.formHandlers.delete(formId);
  }

  /**
   * Removes all form handlers
   */
  public clearForms(): void {
    this.formHandlers.clear();
  }

  /**
   * Gets IDs of all active form handlers
   * 
   * @returns Array of form IDs
   */
  public getActiveForms(): string[] {
    return Array.from(this.formHandlers.keys());
  }
} 