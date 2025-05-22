import { ethers } from 'ethers';

export interface IValidatorRegistryInterface extends ethers.Interface {
  functions: {
    getValidatorOwner(validator: string): Promise<string>;
    getValidatorInfo(validator: string): Promise<{
      owner: string;
      name: string;
      isActive: boolean;
      supportedAssetTypes: number[];
    }>;
    getValidatorsForAssetType(assetTypeId: number): Promise<string[]>;
    isValidatorActive(validator: string): Promise<boolean>;
    isValidatorRegistered(validator: string): Promise<boolean>;
    getValidatorName(validator: string): Promise<string>;
    getValidatorAssetTypes(validator: string): Promise<number[]>;
    getSupportedAssetTypes(validator: string): Promise<number[]>;
    updateValidatorName(validator: string, newName: string): Promise<ethers.ContractTransaction>;
    updateValidatorStatus(validator: string, isActive: boolean): Promise<ethers.ContractTransaction>;
    removeValidator(validator: string): Promise<ethers.ContractTransaction>;
    registerValidator(
      validator: string,
      name: string,
      description: string,
      supportedAssetTypes: number[]
    ): Promise<ethers.ContractTransaction>;
    getActiveValidators(): Promise<string[]>;
    setFundManager(fundManager: string): Promise<ethers.ContractTransaction>;
  };
}

export type IValidatorRegistryContract = ethers.Contract & IValidatorRegistryInterface;

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
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "validator",
          type: "address"
        }
      ],
      name: "getValidatorAssetTypes",
      outputs: [],
      stateMutability: "nonpayable",
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
      name: "getSupportedAssetTypes",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]"
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
        },
        {
          internalType: "string",
          name: "newName",
          type: "string"
        }
      ],
      name: "updateValidatorName",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "validator",
          type: "address"
        },
        {
          internalType: "bool",
          name: "isActive",
          type: "bool"
        }
      ],
      name: "updateValidatorStatus",
      outputs: [],
      stateMutability: "nonpayable",
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
      name: "removeValidator",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "validator",
          type: "address"
        },
        {
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          internalType: "string",
          name: "description",
          type: "string"
        },
        {
          internalType: "uint8[]",
          name: "supportedAssetTypes",
          type: "uint8[]"
        }
      ],
      name: "registerValidator",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "getActiveValidators",
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
          name: "fundManager",
          type: "address"
        }
      ],
      name: "setFundManager",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ] as const,
  bytecode: "0x",
  deployedBytecode: "0x",
  linkReferences: {},
  deployedLinkReferences: {}
}; 