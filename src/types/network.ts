import { ethers } from 'ethers';

/**
 * Network configuration for the SDK
 */
export interface NetworkConfig {
  /** Chain ID of the network */
  chainId: number;
  /** Ethers provider instance */
  provider: ethers.Provider;
  /** Contract addresses for the network */
  contracts: {
    /** DeedNFT contract address */
    DeedNFT: string;
    /** FundManager contract address */
    FundManager: string;
    /** Validator contract address */
    Validator: string;
    /** ValidatorRegistry contract address */
    ValidatorRegistry: string;
    /** MetadataRenderer contract address */
    MetadataRenderer: string;
  };
}

/**
 * Common chain IDs for reference
 */
export enum ChainId {
  MAINNET = 1,
  ARBITRUM = 42161,
  BASE = 8453,
  BASE_SEPOLIA = 84532
}

/**
 * Error thrown when network configuration is invalid
 */
export class NetworkConfigError extends Error {
  constructor(message: string) {
    super(`Network Configuration Error: ${message}`);
    this.name = 'NetworkConfigError';
  }
} 