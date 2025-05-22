import { ethers } from 'ethers';

export interface IValidatorInterface extends ethers.Interface {
  functions: {
    validateDeed(tokenId: ethers.BigNumberish): Promise<ethers.ContractTransaction>;
    validateOperatingAgreement(uri: string): Promise<ethers.ContractTransaction>;
    getValidationCriteria(assetTypeId: number): Promise<{
      requiredTraits: string[];
      additionalCriteria: string;
      requireOperatingAgreement: boolean;
      requireDefinition: boolean;
    }>;
    setValidationCriteria(
      assetTypeId: number,
      requiredTraits: string[],
      additionalCriteria: string,
      requireOperatingAgreement: boolean,
      requireDefinition: boolean
    ): Promise<ethers.ContractTransaction>;
    registerOperatingAgreement(uri: string, name: string): Promise<ethers.ContractTransaction>;
    defaultOperatingAgreement(): Promise<string>;
    addWhitelistedToken(token: string): Promise<ethers.ContractTransaction>;
    removeWhitelistedToken(token: string): Promise<ethers.ContractTransaction>;
    isTokenWhitelisted(token: string): Promise<boolean>;
    getServiceFee(token: string): Promise<ethers.BigNumberish>;
    setServiceFee(token: string, fee: ethers.BigNumberish): Promise<ethers.ContractTransaction>;
    withdrawServiceFees(token: string): Promise<ethers.ContractTransaction>;
  };
}

export type IValidatorContract = ethers.Contract & IValidatorInterface;

export const IValidator = {
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "validateDeed",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "uri",
          type: "string"
        }
      ],
      name: "validateOperatingAgreement",
      outputs: [],
      stateMutability: "nonpayable",
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
      name: "getValidationCriteria",
      outputs: [
        {
          internalType: "string[]",
          name: "requiredTraits",
          type: "string[]"
        },
        {
          internalType: "string",
          name: "additionalCriteria",
          type: "string"
        },
        {
          internalType: "bool",
          name: "requireOperatingAgreement",
          type: "bool"
        },
        {
          internalType: "bool",
          name: "requireDefinition",
          type: "bool"
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
        },
        {
          internalType: "string[]",
          name: "requiredTraits",
          type: "string[]"
        },
        {
          internalType: "string",
          name: "additionalCriteria",
          type: "string"
        },
        {
          internalType: "bool",
          name: "requireOperatingAgreement",
          type: "bool"
        },
        {
          internalType: "bool",
          name: "requireDefinition",
          type: "bool"
        }
      ],
      name: "setValidationCriteria",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "uri",
          type: "string"
        },
        {
          internalType: "string",
          name: "name",
          type: "string"
        }
      ],
      name: "registerOperatingAgreement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "defaultOperatingAgreement",
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
          name: "token",
          type: "address"
        }
      ],
      name: "addWhitelistedToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address"
        }
      ],
      name: "removeWhitelistedToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address"
        }
      ],
      name: "isTokenWhitelisted",
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
          name: "token",
          type: "address"
        }
      ],
      name: "getServiceFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "fee",
          type: "uint256"
        }
      ],
      name: "setServiceFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address"
        }
      ],
      name: "withdrawServiceFees",
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