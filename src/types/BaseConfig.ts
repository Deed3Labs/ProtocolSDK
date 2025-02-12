import { ethers } from 'ethers';
import { NetworkConfig, ContractAddresses, WalletConfig } from './config';

export interface BaseConfig {
  provider: ethers.providers.Provider;
  network: NetworkConfig;
  contracts: ContractAddresses;
  walletConfig?: WalletConfig;
} 