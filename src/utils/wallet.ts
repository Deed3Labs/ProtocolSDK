import { 
  AppKit,
  createAppKit,
  type AppKitOptions
} from '@reown/appkit'
import { 
  WagmiAdapter 
} from '@reown/appkit-adapter-wagmi'
import { 
  type PublicClient, 
  type WalletClient, 
  createPublicClient, 
  http
} from 'viem'
import { ProtocolError, ErrorType } from './errors'
import type { WalletConfig } from '../types/config'

export class WalletManager {
  private publicClient: PublicClient | null = null
  private appKit: AppKit | null = null
  private walletClient: WalletClient | null = null

  constructor(private config: WalletConfig = {}) {
    this.initializeAppKit()
  }

  private initializeAppKit() {
    const projectId = this.config.walletConnectProjectId
    if (!projectId) {
      throw new ProtocolError(
        'WalletConnect project ID is required',
        ErrorType.INVALID_CONFIG
      )
    }

    const defaultRpcUrl = this.validateRpcUrl(this.config.fallbackRpcUrl)

    const mainnet = {
      id: 1,
      name: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      rpcUrls: {
        default: { http: [defaultRpcUrl] as [string] },
        public: { http: [defaultRpcUrl] as [string] }
      }
    } as const

    const additionalNetworks = (this.config.supportedChainIds || []).slice(1).map(id => ({
      id,
      name: `Chain ${id}`,
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      rpcUrls: {
        default: { http: [defaultRpcUrl] as [string] },
        public: { http: [defaultRpcUrl] as [string] }
      }
    }))

    const networks = [mainnet, ...additionalNetworks]

    const options: AppKitOptions = {
      projectId,
      networks: [networks[0], ...networks.slice(1)],
      adapters: [new WagmiAdapter({
        networks: [networks[0], ...networks.slice(1)],
        projectId
      })]
    }

    this.appKit = createAppKit(options)
  }

  async connect(): Promise<{ 
    publicClient: PublicClient; 
    walletClient: WalletClient 
  }> {
    try {
      if (!this.publicClient || !this.walletClient) {
        await this.appKit?.open()

        const rpcUrl = this.validateRpcUrl(this.config.fallbackRpcUrl)
        this.publicClient = createPublicClient({
          transport: http(rpcUrl)
        })

        const walletInfo = await this.appKit?.getWalletInfo()
        if (!walletInfo?.client) {
          throw new ProtocolError(
            'Failed to get wallet client',
            ErrorType.WALLET_CONNECTION
          )
        }
        this.walletClient = walletInfo.client as WalletClient
      }

      if (!this.publicClient || !this.walletClient) {
        throw new ProtocolError(
          'Connection failed',
          ErrorType.WALLET_CONNECTION
        )
      }

      return {
        publicClient: this.publicClient,
        walletClient: this.walletClient
      }
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.appKit) {
        await this.appKit.disconnect()
        this.cleanup()
      }
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  async switchNetwork(networkId: number): Promise<void> {
    try {
      if (!this.appKit) {
        throw new ProtocolError(
          'AppKit not initialized',
          ErrorType.WALLET_CONNECTION
        )
      }
      const network = {
        id: networkId,
        name: `Chain ${networkId}`,
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: {
          default: { http: [this.config.fallbackRpcUrl || ''] },
          public: { http: [this.config.fallbackRpcUrl || ''] }
        }
      }
      await this.appKit.switchNetwork(network)
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  async getNetwork(): Promise<{ chainId: number }> {
    try {
      if (!this.walletClient) {
        throw new ProtocolError(
          'Wallet not connected',
          ErrorType.UNAUTHORIZED
        )
      }
      const chainId = await this.walletClient.getChainId()
      return { chainId }
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  getPublicClient(): PublicClient | null {
    return this.publicClient
  }

  getClients(): { 
    publicClient: PublicClient | null; 
    walletClient: WalletClient | null 
  } {
    return {
      publicClient: this.publicClient,
      walletClient: this.walletClient
    }
  }

  private validateRpcUrl(fallbackRpcUrl?: string): string {
    const defaultRpcUrl = 'https://eth-mainnet.g.alchemy.com/v2/your-api-key'
    const rpcUrl = fallbackRpcUrl || defaultRpcUrl

    if (!rpcUrl.startsWith('http')) {
      throw new ProtocolError(
        'Invalid RPC URL format',
        ErrorType.INVALID_CONFIG
      )
    }

    return rpcUrl
  }

  private cleanup(): void {
    this.publicClient = null
    this.walletClient = null
  }
} 