import { ethers } from 'ethers';
import { AssetType } from '../types/contracts';

export const IDeedNFT = {
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "uint8",
          name: "assetType",
          type: "uint8"
        },
        {
          internalType: "string",
          name: "ipfsDetailsHash",
          type: "string"
        },
        {
          internalType: "string",
          name: "definition",
          type: "string"
        },
        {
          internalType: "string",
          name: "configuration",
          type: "string"
        },
        {
          internalType: "address",
          name: "validatorAddress",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "salt",
          type: "uint256"
        }
      ],
      name: "mintAsset",
      outputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
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
      name: "burnAsset",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]"
        }
      ],
      name: "burnBatchAssets",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "safeTransferFrom",
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
          name: "uri",
          type: "string"
        },
        {
          internalType: "string",
          name: "operatingAgreement",
          type: "string"
        },
        {
          internalType: "string",
          name: "definition",
          type: "string"
        },
        {
          internalType: "string",
          name: "configuration",
          type: "string"
        }
      ],
      name: "updateMetadata",
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
          internalType: "bool",
          name: "isValid",
          type: "bool"
        },
        {
          internalType: "address",
          name: "validatorAddress",
          type: "address"
        }
      ],
      name: "updateValidationStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "minter",
          type: "address"
        }
      ],
      name: "addMinter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "minter",
          type: "address"
        }
      ],
      name: "removeMinter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "hasRole",
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
          name: "marketplace",
          type: "address"
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool"
        }
      ],
      name: "setApprovedMarketplace",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "marketplace",
          type: "address"
        }
      ],
      name: "isApprovedMarketplace",
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
          internalType: "bool",
          name: "enforced",
          type: "bool"
        }
      ],
      name: "setRoyaltyEnforcement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "isRoyaltyEnforced",
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
      inputs: [],
      name: "getTransferValidator",
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
      name: "setTransferValidator",
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

export interface IDeedNFTInterface extends ethers.Interface {
  functions: {
    mintAsset(
      owner: string,
      assetType: AssetType,
      ipfsDetailsHash: string,
      definition: string,
      configuration: string,
      validatorAddress: string,
      salt: ethers.BigNumberish
    ): Promise<ethers.ContractTransaction>;
    
    burnAsset(
      tokenId: ethers.BigNumberish
    ): Promise<ethers.ContractTransaction>;
    
    burnBatchAssets(
      tokenIds: ethers.BigNumberish[]
    ): Promise<ethers.ContractTransaction>;
    
    transferFrom(
      from: string,
      to: string,
      tokenId: ethers.BigNumberish
    ): Promise<ethers.ContractTransaction>;
    
    safeTransferFrom(
      from: string,
      to: string,
      tokenId: ethers.BigNumberish
    ): Promise<ethers.ContractTransaction>;
    
    updateMetadata(
      tokenId: ethers.BigNumberish,
      uri: string,
      operatingAgreement: string,
      definition: string,
      configuration: string
    ): Promise<ethers.ContractTransaction>;
    
    tokenURI(
      tokenId: ethers.BigNumberish
    ): Promise<string>;
    
    updateValidationStatus(
      tokenId: ethers.BigNumberish,
      isValid: boolean,
      validatorAddress: string
    ): Promise<ethers.ContractTransaction>;
    
    addMinter(
      minter: string
    ): Promise<ethers.ContractTransaction>;
    
    removeMinter(
      minter: string
    ): Promise<ethers.ContractTransaction>;
    
    hasRole(
      role: string,
      account: string
    ): Promise<boolean>;
    
    setApprovedMarketplace(
      marketplace: string,
      approved: boolean
    ): Promise<ethers.ContractTransaction>;
    
    isApprovedMarketplace(
      marketplace: string
    ): Promise<boolean>;
    
    setRoyaltyEnforcement(
      enforced: boolean
    ): Promise<ethers.ContractTransaction>;
    
    isRoyaltyEnforced(): Promise<boolean>;
    
    getTransferValidator(): Promise<string>;
    
    setTransferValidator(
      validator: string
    ): Promise<ethers.ContractTransaction>;
    
    ownerOf(
      tokenId: ethers.BigNumberish
    ): Promise<string>;
    
    getTraitValue(
      tokenId: ethers.BigNumberish,
      traitKey: string
    ): Promise<string>;
  };
}

export type IDeedNFTContract = ethers.Contract & IDeedNFTInterface; 