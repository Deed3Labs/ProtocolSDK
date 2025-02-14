// Temporary placeholder ABI for development
const PLACEHOLDER_ABI = [
  // Basic NFT functions
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
] as const

// Only export the placeholder ABIs
const DeedNFTABI = PLACEHOLDER_ABI
const SubdivideABI = PLACEHOLDER_ABI
const FractionalizeABI = PLACEHOLDER_ABI
const ValidatorABI = PLACEHOLDER_ABI
const ValidatorRegistryABI = PLACEHOLDER_ABI
const FundManagerABI = PLACEHOLDER_ABI

export {
  DeedNFTABI,
  SubdivideABI,
  FractionalizeABI,
  ValidatorABI,
  ValidatorRegistryABI,
  FundManagerABI
}

/* After deployment, replace with:
import { default as DeedNFTABI } from './DeedNFTABI'
import { default as SubdivideABI } from './SubdivideABI'
import { default as FractionalizeABI } from './FractionalizeABI'
import { default as ValidatorRegistryABI } from './ValidatorRegistryABI'
import { default as FundManagerABI } from './FundManagerABI'

export {
  DeedNFTABI,
  SubdivideABI,
  FractionalizeABI,
  ValidatorRegistryABI,
  FundManagerABI
}
*/