import { SUPPORTED_CHAINS } from './constants';
import { NetworkConfig } from './types';
import { PublicClient } from 'viem';

export const NETWORKS: Record<number, NetworkConfig> = {
  [SUPPORTED_CHAINS.LOCALHOST]: {
    name: 'Localhost',
    chainId: SUPPORTED_CHAINS.LOCALHOST,
    rpcUrl: 'http://localhost:8545',
    contracts: {
      deedNFT: (process.env.LOCAL_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.LOCAL_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.LOCAL_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.LOCAL_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.LOCAL_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  },
  [SUPPORTED_CHAINS.MAINNET]: {
    chainId: SUPPORTED_CHAINS.MAINNET,
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
  [SUPPORTED_CHAINS.POLYGON]: {
    chainId: SUPPORTED_CHAINS.POLYGON,
    name: 'Polygon Mainnet',
    rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    contracts: {
      deedNFT: (process.env.POLYGON_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.POLYGON_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.POLYGON_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.POLYGON_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.POLYGON_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  },
  [SUPPORTED_CHAINS.OPTIMISM]: {
    chainId: SUPPORTED_CHAINS.OPTIMISM,
    name: 'Optimism Mainnet',
    rpcUrl: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
    contracts: {
      deedNFT: (process.env.OPTIMISM_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.OPTIMISM_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.OPTIMISM_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.OPTIMISM_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.OPTIMISM_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  },
  [SUPPORTED_CHAINS.ARBITRUM]: {
    chainId: SUPPORTED_CHAINS.ARBITRUM,
    name: 'Arbitrum One',
    rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    contracts: {
      deedNFT: (process.env.ARBITRUM_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.ARBITRUM_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.ARBITRUM_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.ARBITRUM_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.ARBITRUM_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  },
  [SUPPORTED_CHAINS.BASE]: {
    chainId: SUPPORTED_CHAINS.BASE,
    name: 'Base',
    rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
    contracts: {
      deedNFT: (process.env.BASE_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.BASE_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.BASE_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.BASE_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.BASE_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  },
  // Testnets
  [SUPPORTED_CHAINS.POLYGON_MUMBAI]: {
    chainId: SUPPORTED_CHAINS.POLYGON_MUMBAI,
    name: 'Polygon Mumbai',
    rpcUrl: process.env.MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
    contracts: {
      deedNFT: (process.env.MUMBAI_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.MUMBAI_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.MUMBAI_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.MUMBAI_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.MUMBAI_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  },
  [SUPPORTED_CHAINS.OPTIMISM_GOERLI]: {
    chainId: SUPPORTED_CHAINS.OPTIMISM_GOERLI,
    name: 'Optimism Goerli',
    rpcUrl: process.env.OPTIMISM_GOERLI_RPC_URL || 'https://goerli.optimism.io',
    contracts: {
      deedNFT: (process.env.OPTIMISM_GOERLI_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.OPTIMISM_GOERLI_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.OPTIMISM_GOERLI_FRACTIONALIZE_ADDRESS || '') as `0x${string}`,
      validatorRegistry: (process.env.OPTIMISM_GOERLI_VALIDATOR_REGISTRY_ADDRESS || '') as `0x${string}`,
      fundManager: (process.env.OPTIMISM_GOERLI_FUND_MANAGER_ADDRESS || '') as `0x${string}`
    }
  },
  [SUPPORTED_CHAINS.GNOSIS]: {
    chainId: SUPPORTED_CHAINS.GNOSIS,
    name: 'Gnosis Chain',
    rpcUrl: process.env.GNOSIS_RPC_URL || 'https://rpc.gnosischain.com',
    contracts: {
      deedNFT: (process.env.GNOSIS_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.GNOSIS_SUBDIVIDE_ADDRESS || '') as `0x${string}`,
      fractionalize: (process.env.GNOSIS_FRACTIONALIZE_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
      validatorRegistry: (process.env.GNOSIS_VALIDATOR_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
      fundManager: (process.env.GNOSIS_FUND_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`
    }
  },
  [SUPPORTED_CHAINS.GNOSIS_CHIADO]: {
    chainId: SUPPORTED_CHAINS.GNOSIS_CHIADO,
    name: 'Gnosis Chiado Testnet',
    rpcUrl: process.env.GNOSIS_CHIADO_RPC_URL || 'https://rpc.chiadochain.net',
    contracts: {
      deedNFT: (process.env.GNOSIS_CHIADO_DEED_NFT_ADDRESS || '') as `0x${string}`,
      subdivide: (process.env.GNOSIS_CHIADO_SUBDIVIDE_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
      fractionalize: (process.env.GNOSIS_CHIADO_FRACTIONALIZE_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
      validatorRegistry: (process.env.GNOSIS_CHIADO_VALIDATOR_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
      fundManager: (process.env.GNOSIS_CHIADO_FUND_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`
    }
  }
  // Add other testnets similarly...
};

export const DEFAULT_NETWORK = SUPPORTED_CHAINS.MAINNET;
export async function validateNetwork(
  client: PublicClient,
  expectedChainId: number
): Promise<boolean> {
  const chain = await client.getChainId();
  return chain === expectedChainId;
}