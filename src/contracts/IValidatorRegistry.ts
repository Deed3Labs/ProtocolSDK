import { ethers } from 'ethers';

export const IValidatorRegistry = {
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "validator",
          type: "address"
        }
      ],
      name: "getValidatorOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "validator",
          type: "address"
        }
      ],
      name: "getValidatorInfo",
      outputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          internalType: "bool",
          name: "isActive",
          type: "bool"
        },
        {
          internalType: "uint8[]",
          name: "supportedAssetTypes",
          type: "uint8[]"
        },
        {
          internalType: "uint256",
          name: "commissionPercentage",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint8",
          name: "assetTypeId",
          type: "uint8"
        }
      ],
      name: "getValidatorsForAssetType",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "validator",
          type: "address"
        }
      ],
      name: "isValidatorActive",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "validator",
          type: "address"
        }
      ],
      name: "isValidatorRegistered",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "validator",
          type: "address"
        }
      ],
      name: "getValidatorName",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ] as const,
  bytecode: "0x",
  deployedBytecode: "0x",
  linkReferences: {},
  deployedLinkReferences: {}
};

export type IValidatorRegistryInterface = ethers.Interface;
export type IValidatorRegistryContract = ethers.Contract; 