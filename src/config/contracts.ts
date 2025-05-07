import { ChainId } from '../types/network';

/**
 * Contract addresses for each supported network
 */
export const CONTRACT_ADDRESSES: Record<ChainId, {
  DeedNFT: string;
  FundManager: string;
  Validator: string;
  ValidatorRegistry: string;
  MetadataRenderer: string;
}> = {
  [ChainId.MAINNET]: {
    // Add mainnet addresses when deployed
    DeedNFT: '',
    FundManager: '',
    Validator: '',
    ValidatorRegistry: '',
    MetadataRenderer: ''
  },
  [ChainId.ARBITRUM]: {
    // Add arbitrum addresses when deployed
    DeedNFT: '',
    FundManager: '',
    Validator: '',
    ValidatorRegistry: '',
    MetadataRenderer: ''
  },
  [ChainId.BASE]: {
    // Add base mainnet addresses when deployed
    DeedNFT: '',
    FundManager: '',
    Validator: '',
    ValidatorRegistry: '',
    MetadataRenderer: ''
  },
  [ChainId.BASE_SEPOLIA]: {
    DeedNFT: '0xB131eaae640d9C8e47A74Fc03A4e1688225A0312',
    FundManager: '0xFF09E012224d1cd37a32492C1ae173C4aF9cf7E7',
    Validator: '0x10A782c9F9061107B167CEeADd3604094950C67A',
    ValidatorRegistry: '0x8259c14EdFC19b686A6764c153c723507d794CD4',
    MetadataRenderer: '0x1Ef98925E362c28b5E37A3d8e2416a99b6589f83'
  }
} as const;

/**
 * Get contract addresses for a specific network
 * @param chainId The chain ID to get addresses for
 * @returns Contract addresses for the specified network
 * @throws NetworkConfigError if the network is not supported
 */
export function getContractAddresses(chainId: ChainId) {
  const addresses = CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(`Network ${chainId} is not supported`);
  }
  return addresses;
} 