import { ethers } from 'ethers';

export const IMetadataRenderer = {
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "tokenURI",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "syncTraitUpdate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "metadata",
          type: "string"
        }
      ],
      name: "setTokenCustomMetadata",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "string[]",
          name: "features",
          type: "string[]"
        }
      ],
      name: "setTokenFeatures",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "getTokenFeatures",
      outputs: [
        {
          internalType: "string[]",
          name: "",
          type: "string[]"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "condition",
          type: "string"
        },
        {
          internalType: "string",
          name: "lastInspectionDate",
          type: "string"
        },
        {
          internalType: "string",
          name: "knownIssues",
          type: "string"
        },
        {
          internalType: "string",
          name: "improvements",
          type: "string"
        },
        {
          internalType: "string",
          name: "additionalNotes",
          type: "string"
        }
      ],
      name: "setAssetCondition",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "getAssetCondition",
      outputs: [
        {
          internalType: "string",
          name: "condition",
          type: "string"
        },
        {
          internalType: "string",
          name: "lastInspectionDate",
          type: "string"
        },
        {
          internalType: "string",
          name: "knownIssues",
          type: "string"
        },
        {
          internalType: "string",
          name: "improvements",
          type: "string"
        },
        {
          internalType: "string",
          name: "additionalNotes",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "jurisdiction",
          type: "string"
        },
        {
          internalType: "string",
          name: "registrationNumber",
          type: "string"
        },
        {
          internalType: "string",
          name: "registrationDate",
          type: "string"
        },
        {
          internalType: "string[]",
          name: "documents",
          type: "string[]"
        },
        {
          internalType: "string[]",
          name: "restrictions",
          type: "string[]"
        },
        {
          internalType: "string",
          name: "additionalInfo",
          type: "string"
        }
      ],
      name: "setTokenLegalInfo",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "getTokenLegalInfo",
      outputs: [
        {
          internalType: "string",
          name: "jurisdiction",
          type: "string"
        },
        {
          internalType: "string",
          name: "registrationNumber",
          type: "string"
        },
        {
          internalType: "string",
          name: "registrationDate",
          type: "string"
        },
        {
          internalType: "string[]",
          name: "documents",
          type: "string[]"
        },
        {
          internalType: "string[]",
          name: "restrictions",
          type: "string[]"
        },
        {
          internalType: "string",
          name: "additionalInfo",
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

export type IMetadataRendererInterface = ethers.Interface;
export type IMetadataRendererContract = ethers.Contract; 