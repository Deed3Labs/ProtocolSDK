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
      placeholder: 'Qm... or b... or B... or z... or F...',
      helpText: 'IPFS hash containing the asset details (CID v0 or v1)',
      validation: {
        pattern: /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})$/,
        message: 'Invalid IPFS hash format. Must be a valid CID v0 (Qm...) or CID v1 (b..., B..., z..., or F...)'
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
      name: 'baseUri',
      type: 'text',
      label: 'Base URI',
      required: true,
      placeholder: 'https://...',
      helpText: 'Base URI for token metadata',
      validation: {
        pattern: /^https?:\/\/.+/,
        message: 'Must be a valid HTTP(S) URL'
      }
    },
    {
      name: 'defaultOperatingAgreement',
      type: 'text',
      label: 'Default Operating Agreement URI',
      required: true,
      placeholder: 'https://...',
      helpText: 'URI for the default operating agreement',
      validation: {
        pattern: /^https?:\/\/.+/,
        message: 'Must be a valid HTTP(S) URL'
      }
    },
    {
      name: 'serviceFee',
      type: 'number',
      label: 'Service Fee',
      required: true,
      validation: {
        min: 0,
        message: 'Service fee must be non-negative'
      },
      helpText: 'Service fee for validation (in wei)'
    },
    {
      name: 'royaltyFeePercentage',
      type: 'number',
      label: 'Royalty Fee Percentage',
      required: true,
      validation: {
        min: 0,
        max: 1000,
        message: 'Royalty fee must be between 0 and 1000'
      },
      helpText: 'Royalty fee percentage (in basis points, 1000 = 100%)'
    },
    {
      name: 'royaltyReceiver',
      type: 'address',
      label: 'Royalty Receiver Address',
      required: true,
      placeholder: '0x...',
      helpText: 'Address that will receive royalty fees',
      validation: {
        pattern: /^0x[a-fA-F0-9]{40}$/,
        message: 'Invalid Ethereum address'
      }
    },
    {
      name: 'fundManager',
      type: 'address',
      label: 'Fund Manager Address',
      required: true,
      placeholder: '0x...',
      helpText: 'Address of the FundManager contract',
      validation: {
        pattern: /^0x[a-fA-F0-9]{40}$/,
        message: 'Invalid Ethereum address'
      }
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
        max: 1000,
        message: 'Commission must be between 0 and 1000'
      },
      helpText: 'Default commission percentage for validators (in basis points, 1000 = 100%)'
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
    },
    {
      name: 'deedNFT',
      type: 'address',
      label: 'DeedNFT Contract Address',
      required: true,
      placeholder: '0x...',
      helpText: 'Address of the DeedNFT contract',
      validation: {
        pattern: /^0x[a-fA-F0-9]{40}$/,
        message: 'Invalid Ethereum address'
      }
    }
  ]
};

/**
 * Schema for MetadataRenderer form
 * Defines fields and validation rules for configuring metadata rendering
 * 
 * @example
 * ```typescript
 * const form = formFactory.createForm('metadataRenderer');
 * await form.setValue('tokenId', 1);
 * await form.setValue('customMetadata', '{"name": "Asset #1"}');
 * await form.setValue('features', ['Feature 1', 'Feature 2']);
 * ```
 */
export const MetadataRendererFormSchema: FormSchema = {
  fields: [
    {
      name: 'tokenId',
      type: 'number',
      label: 'Token ID',
      required: true,
      helpText: 'ID of the token to update',
      validation: {
        min: 0,
        message: 'Token ID must be non-negative'
      }
    },
    {
      name: 'customMetadata',
      type: 'textarea',
      label: 'Custom Metadata',
      required: false,
      placeholder: 'Enter custom metadata in JSON format...',
      helpText: 'Custom metadata for the token',
      validation: {
        custom: (value) => {
          try {
            JSON.parse(value);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Invalid JSON format'
      }
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      required: false,
      placeholder: 'Enter features...',
      helpText: 'Array of features for the token',
      validation: {
        custom: (value) => Array.isArray(value) && value.every(v => typeof v === 'string'),
        message: 'Features must be an array of strings'
      }
    },
    {
      name: 'assetCondition',
      type: 'object',
      label: 'Asset Condition',
      required: false,
      fields: [
        {
          name: 'generalCondition',
          type: 'text',
          label: 'General Condition',
          required: true,
          helpText: 'General condition rating of the asset'
        },
        {
          name: 'lastInspectionDate',
          type: 'date',
          label: 'Last Inspection Date',
          required: true,
          helpText: 'Date of last inspection'
        },
        {
          name: 'knownIssues',
          type: 'array',
          label: 'Known Issues',
          required: false,
          helpText: 'Array of known issues'
        },
        {
          name: 'improvements',
          type: 'array',
          label: 'Improvements',
          required: false,
          helpText: 'Array of improvements made'
        },
        {
          name: 'additionalNotes',
          type: 'textarea',
          label: 'Additional Notes',
          required: false,
          helpText: 'Additional notes about the condition'
        }
      ]
    },
    {
      name: 'legalInfo',
      type: 'object',
      label: 'Legal Information',
      required: false,
      fields: [
        {
          name: 'jurisdiction',
          type: 'text',
          label: 'Jurisdiction',
          required: true,
          helpText: 'Legal jurisdiction'
        },
        {
          name: 'registrationNumber',
          type: 'text',
          label: 'Registration Number',
          required: true,
          helpText: 'Official registration number'
        },
        {
          name: 'registrationDate',
          type: 'date',
          label: 'Registration Date',
          required: true,
          helpText: 'Date of registration'
        },
        {
          name: 'documents',
          type: 'array',
          label: 'Documents',
          required: false,
          helpText: 'Array of legal documents'
        },
        {
          name: 'restrictions',
          type: 'array',
          label: 'Restrictions',
          required: false,
          helpText: 'Array of legal restrictions'
        },
        {
          name: 'additionalInfo',
          type: 'textarea',
          label: 'Additional Information',
          required: false,
          helpText: 'Additional legal information'
        }
      ]
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      required: false,
      placeholder: 'Enter image URLs...',
      helpText: 'Array of image URLs for the token gallery',
      validation: {
        custom: (value) => Array.isArray(value) && value.every(v => typeof v === 'string' && v.startsWith('http')),
        message: 'Gallery must be an array of valid URLs'
      }
    },
    {
      name: 'animationURL',
      type: 'text',
      label: 'Animation URL',
      required: false,
      placeholder: 'Enter animation URL...',
      helpText: 'URL for the token animation',
      validation: {
        custom: (value) => !value || (typeof value === 'string' && Boolean(value.match(/\.(mp4|webm|gif)$/i))),
        message: 'Animation URL must be a valid video or GIF file'
      }
    },
    {
      name: 'externalLink',
      type: 'text',
      label: 'External Link',
      required: false,
      placeholder: 'Enter external link...',
      helpText: 'External link for the token',
      validation: {
        custom: (value) => !value || (typeof value === 'string' && value.startsWith('http')),
        message: 'External link must be a valid URL'
      }
    }
  ],
  validate: async (values) => {
    // Add any form-level validation here
    return true;
  },
  transform: (values) => {
    // Transform values before submission if needed
    return values;
  }
};

export const ValidatorRegistryFormSchema: FormSchema = {
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
      name: 'fundManager',
      type: 'address',
      label: 'Fund Manager Address',
      required: true,
      placeholder: '0x...',
      helpText: 'Address of the FundManager contract',
      validation: {
        pattern: /^0x[a-fA-F0-9]{40}$/,
        message: 'Invalid Ethereum address'
      }
    },
    {
      name: 'activeValidators',
      type: 'array',
      label: 'Active Validators',
      required: false,
      placeholder: 'Enter validator addresses...',
      helpText: 'List of active validator addresses',
      validation: {
        custom: (value) => Array.isArray(value) && value.every(v => /^0x[a-fA-F0-9]{40}$/.test(v)),
        message: 'Each validator address must be a valid Ethereum address'
      }
    }
  ],
  validate: async (values) => {
    // Add any form-level validation here
    return true;
  },
  transform: (values) => {
    // Transform values before submission if needed
    return values;
  }
}; 