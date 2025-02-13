import { ethers } from 'ethers';

export interface ContractAddresses {
  deedNFT: string;
  subdivide: string;
  fractionalize: string;
  validatorRegistry: string;
  fundManager: string;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  contracts: ContractAddresses;
}

export interface WalletConfig {
  dynamicEnvId?: string;
  infuraId?: string;
  defaultProvider?: ethers.providers.JsonRpcProvider;
}

export interface IPFSConfig {
  host: string;
  port: number;
  protocol: string;
  gateway: string;
}

export interface SDKConfig {
  provider: ethers.providers.Provider;
  network: NetworkConfig;
  contracts: ContractAddresses;
  walletConfig?: WalletConfig;
  autoSwitchNetwork?: boolean;
  defaultChainId?: number;
} 