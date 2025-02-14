import { NetworkConfig } from './types';
import { SUPPORTED_CHAINS as ChainId } from '.config/constants';

export const NETWORK_CONFIGS: Record<number, NetworkConfig> = {
  [ChainId.MAINNET]: {
    chainId: ChainId.MAINNET,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    contracts: {
      // Add mainnet contract addresses
    }
  },
  // Add other networks...
};
export async function validateNetwork(
  client: any, // TODO: Import PublicClient type when available
  expectedChainId: number
): Promise<boolean> {
  const chainId = await client.getChainId();
  return chainId === expectedChainId;
} 