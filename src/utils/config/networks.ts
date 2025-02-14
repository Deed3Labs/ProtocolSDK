import { NetworkConfig } from '../../config/types';
import { SUPPORTED_CHAINS } from '../../config/constants';

export const NETWORKS: Record<number, NetworkConfig> = {
  [SUPPORTED_CHAINS.MAINNET]: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/',
    contracts: {
      deedNFT: (process.env.MAINNET_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.MAINNET_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.MAINNET_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.MAINNET_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.MAINNET_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  },
  [SUPPORTED_CHAINS.GOERLI]: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: process.env.GOERLI_RPC_URL || 'https://goerli.infura.io/v3/',
    contracts: {
      deedNFT: (process.env.GOERLI_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.GOERLI_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.GOERLI_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.GOERLI_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.GOERLI_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  }
}; 