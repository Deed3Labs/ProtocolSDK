import { ethers } from 'ethers';
import { AssetType } from '../types/contracts';

export const IFundManager = {
  abi: [
    {
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'assetType', type: 'uint8' },
        { name: 'ipfsDetailsHash', type: 'string' },
        { name: 'definition', type: 'string' },
        { name: 'configuration', type: 'string' },
        { name: 'validatorContract', type: 'address' },
        { name: 'token', type: 'address' },
        { name: 'salt', type: 'uint256' }
      ],
      name: 'mintDeedNFT',
      outputs: [{ name: 'tokenId', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { name: 'deeds', type: 'tuple[]', components: [
          { name: 'owner', type: 'address' },
          { name: 'assetType', type: 'uint8' },
          { name: 'ipfsDetailsHash', type: 'string' },
          { name: 'definition', type: 'string' },
          { name: 'configuration', type: 'string' },
          { name: 'validatorContract', type: 'address' },
          { name: 'token', type: 'address' },
          { name: 'salt', type: 'uint256' }
        ]}
      ],
      name: 'mintBatchDeedNFT',
      outputs: [{ name: 'tokenIds', type: 'uint256[]' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { name: 'validator', type: 'address' },
        { name: 'token', type: 'address' }
      ],
      name: 'getCommissionBalance',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { name: 'validator', type: 'address' },
        { name: 'token', type: 'address' }
      ],
      name: 'withdrawValidatorFees',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ name: 'percentage', type: 'uint256' }],
      name: 'setCommissionPercentage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ name: 'receiver', type: 'address' }],
      name: 'setFeeReceiver',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ name: 'registry', type: 'address' }],
      name: 'setValidatorRegistry',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ name: 'deedNFT', type: 'address' }],
      name: 'setDeedNFT',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ],
  bytecode: '',
  linkReferences: {}
} as const;

export type IFundManagerInterface = typeof IFundManager.abi;
export type IFundManagerContract = typeof IFundManager; 