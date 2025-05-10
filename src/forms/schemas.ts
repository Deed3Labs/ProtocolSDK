import { FormSchema } from './types';

/**
 * Schema for DeedNFT form
 * Defines fields and validation rules for creating a new DeedNFT
 * 
 * @example
 * ```typescript
 * const form = formFactory.createForm('deedNFT');
 * await form.setValue('owner', '0x123...');
 * await form.setValue('assetType', 'Land');
 * await form.setValue('ipfsDetailsHash', 'Qm...');
 * ```
 */
export const DeedNFTFormSchema: FormSchema = {
  fields: [
    {
      name: 'owner',
      type: 'address',
      label: 'Owner Address',
      required: true,
      placeholder: '0x...',
      helpText: 'The address that will own the DeedNFT',
      validation: {
        pattern: /^0x[a-fA-F0-9]{40}$/,
        message: 'Invalid Ethereum address'
      }
    },
    {
      name: 'assetType',
      type: 'select',
      label: 'Asset Type',
      required: true,
      options: ['Land', 'Building', 'Commercial'],
      helpText: 'The type of asset being tokenized',
      validation: {
        custom: (value) => ['Land', 'Building', 'Commercial'].includes(value),
        message: 'Invalid asset type'
      }
    },
    {
      name: 'ipfsDetailsHash',
      type: 'ipfs',
      label: 'IPFS Details Hash',
      required: true,
      placeholder: 'Qm...',
      helpText: 'IPFS hash containing the asset details',
      validation: {
        pattern: /^Qm[a-zA-Z0-9]{44}$/,
        message: 'Invalid IPFS hash format'
      }
    },
    {
      name: 'definition',
      type: 'textarea',
      label: 'Asset Definition',
      required: true,
      placeholder: 'Enter asset definition...',
      helpText: 'Detailed description of the asset'
    },
    {
      name: 'configuration',
      type: 'textarea',
      label: 'Asset Configuration',
      required: true,
      placeholder: 'Enter asset configuration...',
      helpText: 'Configuration details for the asset'
    },
    {
      name: 'validatorAddress',
      type: 'address',
      label: 'Validator Address',
      required: true,
      placeholder: '0x...',
      helpText: 'Address of the validator for this asset',
      validation: {
        pattern: /^0x[a-fA-F0-9]{40}$/,
        message: 'Invalid Ethereum address'
      }
    }
  ],
  validate: async (values) => {
    // Add any form-level validation here
    return true;
  },
  transform: (values) => {
    // Transform values before submission if needed
    return {
      ...values,
      salt: BigInt(Date.now())
    };
  }
};

/**
 * Schema for Validator form
 * Defines fields and validation rules for registering a new Validator
 * 
 * @example
 * ```typescript
 * const form = formFactory.createForm('validator');
 * await form.setValue('name', 'My Validator');
 * await form.setValue('supportedAssetTypes', ['Land', 'Building']);
 * await form.setValue('commissionPercentage', 50);
 * ```
 */
export const ValidatorFormSchema: FormSchema = {
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Validator Name',
      required: true,
      placeholder: 'Enter validator name...',
      helpText: 'Name of the validator'
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
      placeholder: 'Enter validator description...',
      helpText: 'Description of the validator\'s services'
    },
    {
      name: 'supportedAssetTypes',
      type: 'select',
      label: 'Supported Asset Types',
      required: true,
      options: ['Land', 'Building', 'Commercial'],
      helpText: 'Types of assets this validator can validate',
      validation: {
        custom: (value) => Array.isArray(value) && value.every(v => ['Land', 'Building', 'Commercial'].includes(v)),
        message: 'Invalid asset type selection'
      }
    },
    {
      name: 'commissionPercentage',
      type: 'number',
      label: 'Commission Percentage',
      required: true,
      validation: {
        min: 0,
        max: 100,
        message: 'Commission must be between 0 and 100'
      },
      helpText: 'Commission percentage for validation services'
    }
  ]
};

/**
 * Schema for FundManager form
 * Defines fields and validation rules for configuring a FundManager
 * 
 * @example
 * ```typescript
 * const form = formFactory.createForm('fundManager');
 * await form.setValue('feeReceiver', '0x123...');
 * await form.setValue('commissionPercentage', 25);
 * await form.setValue('validatorRegistry', '0x456...');
 * ```
 */
export const FundManagerFormSchema: FormSchema = {
  fields: [
    {
      name: 'feeReceiver',
      type: 'address',
      label: 'Fee Receiver Address',
      required: true,
      placeholder: '0x...',
      helpText: 'Address that will receive collected fees',
      validation: {
        pattern: /^0x[a-fA-F0-9]{40}$/,
        message: 'Invalid Ethereum address'
      }
    },
    {
      name: 'commissionPercentage',
      type: 'number',
      label: 'Commission Percentage',
      required: true,
      validation: {
        min: 0,
        max: 100,
        message: 'Commission must be between 0 and 100'
      },
      helpText: 'Default commission percentage for validators'
    },
    {
      name: 'validatorRegistry',
      type: 'address',
      label: 'Validator Registry Address',
      required: true,
      placeholder: '0x...',
      helpText: 'Address of the validator registry contract',
      validation: {
        pattern: /^0x[a-fA-F0-9]{40}$/,
        message: 'Invalid Ethereum address'
      }
    }
  ]
}; 