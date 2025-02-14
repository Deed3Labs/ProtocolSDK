import { type PublicClient, type WalletClient } from 'viem'
import { NetworkConfig, ContractAddresses, WalletConfig } from '../config/types'

export interface BaseConfig {
  publicClient: PublicClient;
  walletClient: WalletClient;
  network: NetworkConfig;
  contracts: ContractAddresses;
  walletConfig?: WalletConfig;
} 