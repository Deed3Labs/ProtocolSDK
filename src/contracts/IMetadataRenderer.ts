import { ethers } from 'ethers';

export interface IMetadataRendererInterface extends ethers.Interface {
  functions: {
    tokenURI(tokenId: ethers.BigNumberish): Promise<string>;
    syncTraitUpdate(
      tokenId: ethers.BigNumberish,
      traitKey: ethers.BytesLike,
      traitValue: ethers.BytesLike
    ): Promise<ethers.ContractTransaction>;
    setTokenCustomMetadata(tokenId: ethers.BigNumberish, metadata: string): Promise<ethers.ContractTransaction>;
    setTokenFeatures(tokenId: ethers.BigNumberish, features: string[]): Promise<ethers.ContractTransaction>;
    getTokenFeatures(tokenId: ethers.BigNumberish): Promise<string[]>;
    setAssetCondition(
      tokenId: ethers.BigNumberish,
      condition: string,
      lastInspectionDate: string,
      knownIssues: string,
      improvements: string,
      additionalNotes: string
    ): Promise<ethers.ContractTransaction>;
    getAssetCondition(tokenId: ethers.BigNumberish): Promise<{
      condition: string;
      lastInspectionDate: string;
      knownIssues: string;
      improvements: string;
      additionalNotes: string;
    }>;
    setTokenLegalInfo(
      tokenId: ethers.BigNumberish,
      jurisdiction: string,
      registrationNumber: string,
      registrationDate: string,
      documents: string[],
      restrictions: string[],
      additionalInfo: string
    ): Promise<ethers.ContractTransaction>;
    getTokenLegalInfo(tokenId: ethers.BigNumberish): Promise<{
      jurisdiction: string;
      registrationNumber: string;
      registrationDate: string;
      documents: string[];
      restrictions: string[];
      additionalInfo: string;
    }>;
    contractURI(): Promise<string>;
    manageTokenDocument(
      tokenId: ethers.BigNumberish,
      docType: string,
      documentURI: string,
      isRemove: boolean
    ): Promise<ethers.ContractTransaction>;
    getTokenDocument(tokenId: ethers.BigNumberish, docType: string): Promise<string>;
    getTokenDocumentTypes(tokenId: ethers.BigNumberish): Promise<string[]>;
    getTokenDocuments(tokenId: ethers.BigNumberish): Promise<Array<{ docType: string; documentURI: string }>>;
    setTokenGallery(tokenId: ethers.BigNumberish, imageUrls: string[]): Promise<ethers.ContractTransaction>;
    getTokenGallery(tokenId: ethers.BigNumberish): Promise<string[]>;
    setDeedNFT(deedNFT: string): Promise<ethers.ContractTransaction>;
    setAssetTypeImageURI(assetType: number, imageURI: string): Promise<ethers.ContractTransaction>;
    setAssetTypeBackgroundColor(assetType: number, backgroundColor: string): Promise<ethers.ContractTransaction>;
    setInvalidatedImageURI(imageURI: string): Promise<ethers.ContractTransaction>;
    setTokenAnimationURL(tokenId: ethers.BigNumberish, animationURL: string): Promise<ethers.ContractTransaction>;
    setTokenExternalLink(tokenId: ethers.BigNumberish, externalLink: string): Promise<ethers.ContractTransaction>;
    getTokenAnimationURL(tokenId: ethers.BigNumberish): Promise<string>;
    getTokenExternalLink(tokenId: ethers.BigNumberish): Promise<string>;
  };
}

export type IMetadataRendererContract = ethers.Contract & IMetadataRendererInterface;

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
        },
        {
          internalType: "bytes",
          name: "traitKey",
          type: "bytes"
        },
        {
          internalType: "bytes",
          name: "traitValue",
          type: "bytes"
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