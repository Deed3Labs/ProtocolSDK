import { NetworkConfig } from '../../types/config';
import { SUPPORTED_NETWORKS } from './constants';

export const NETWORK_CONFIGS: Record<number, NetworkConfig> = {
  [SUPPORTED_NETWORKS.MAINNET]: {
    chainId: SUPPORTED_NETWORKS.MAINNET,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    contracts: {
      // Add mainnet contract addresses
    }
  },
  // Add other networks...
};

export async function validateNetwork(
  provider: ethers.providers.Provider,
  expectedChainId: number
): Promise<boolean> {
  const network = await provider.getNetwork();
  return network.chainId === expectedChainId;
} 