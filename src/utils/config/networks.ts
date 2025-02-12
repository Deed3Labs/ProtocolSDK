import { NetworkConfig } from '../../types';
import { SUPPORTED_NETWORKS } from '../constants';

export const NETWORKS: Record<string, NetworkConfig> = {
  [SUPPORTED_NETWORKS.MAINNET]: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/',
    contracts: {
      deedNFT: process.env.MAINNET_DEED_NFT_ADDRESS || '',
      subdivide: process.env.MAINNET_SUBDIVIDE_ADDRESS || '',
      fractionalize: process.env.MAINNET_FRACTIONALIZE_ADDRESS || '',
      validatorRegistry: process.env.MAINNET_VALIDATOR_REGISTRY_ADDRESS || '',
      fundManager: process.env.MAINNET_FUND_MANAGER_ADDRESS || ''
    }
  },
  [SUPPORTED_NETWORKS.GOERLI]: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: process.env.GOERLI_RPC_URL || 'https://goerli.infura.io/v3/',
    contracts: {
      // Goerli contract addresses
    }
  }
}; 