import { type PublicClient, type WalletClient } from 'viem'
import { NetworkConfig, WalletConfig } from '../config/types'

export interface SDKConfig {
  publicClient: PublicClient
  walletClient?: WalletClient
  network: NetworkConfig
  walletConfig?: WalletConfig
} 