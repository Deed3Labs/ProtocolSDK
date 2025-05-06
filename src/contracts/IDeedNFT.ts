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

export type IDeedNFTInterface = ethers.Interface;
export type IDeedNFTContract = ethers.Contract; 