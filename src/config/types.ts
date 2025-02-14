import { type PublicClient, type WalletClient, type Address } from 'viem'

export interface NetworkConfig {
  name: string
  chainId: number
  rpcUrl: string
  contracts: ContractAddresses
}

export interface ContractAddresses {
  deedNFT: Address
  subdivide: Address
  fractionalize: Address
  validatorRegistry: Address
  fundManager: Address
}

export interface WalletConfig {
  walletConnectProjectId?: string
  fallbackRpcUrl?: string
  supportedChainIds?: number[]
}

export interface SDKConfig {
  publicClient: PublicClient
  network: NetworkConfig
  walletConfig?: WalletConfig
} 