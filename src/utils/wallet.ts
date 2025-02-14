import { createWeb3Modal } from '@reown/appkit-wagmi-react-native'
import { createAuthClient } from '@reown/appkit-auth-wagmi-react-native'
import { createCoinbaseConnector } from '@reown/appkit-coinbase-wagmi-react-native'
import { createSiweClient } from '@reown/appkit-siwe-react-native'
import { type PublicClient, type WalletClient, createPublicClient, http } from 'viem'
import { ProtocolError, ErrorType } from './errors'
import type { WalletConfig } from '../types/config'

export class WalletManager {
  private publicClient: PublicClient | null = null
  private modal: any | null = null
  private walletClient: WalletClient | null = null
  private authClient: any | null = null
  private siweClient: any | null = null

  constructor(private config: WalletConfig = {}) {
    this.initializeWeb3Modal()
  }

  private initializeWeb3Modal() {
    const projectId = this.config.walletConnectProjectId
    if (!projectId) {
      throw new ProtocolError(
        ErrorType.WALLET_CONNECTION,
        'WalletConnect project ID is required'
      )
    }

    this.authClient = createAuthClient({
      projectId,
      chains: this.config.supportedChainIds || [1]
    })

    this.siweClient = createSiweClient({
      authClient: this.authClient
    })

    const coinbaseConnector = createCoinbaseConnector()

    this.modal = createWeb3Modal({
      projectId,
      chains: this.config.supportedChainIds || [1],
      connectors: [coinbaseConnector],
      authClient: this.authClient,
      siweClient: this.siweClient
    })
  }

  async connect(): Promise<{ publicClient: PublicClient; walletClient: WalletClient }> {
    try {
      if (!this.publicClient || !this.walletClient) {
        await this.modal.open()
        const rpcUrl = this.config.fallbackRpcUrl || 'https://eth-mainnet.g.alchemy.com/v2/'
        this.publicClient = createPublicClient({
          transport: http(rpcUrl)
        })
        this.walletClient = await this.modal.getWalletClient()
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
    if (this.modal) {
      await this.modal.disconnect()
      this.publicClient = null
      this.walletClient = null
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    try {
      await this.modal.switchNetwork({ chainId })
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  getPublicClient(): PublicClient | null {
    return this.publicClient
  }

  getClients(): { publicClient: PublicClient | null; walletClient: WalletClient | null } {
    return {
      publicClient: this.publicClient,
      walletClient: this.walletClient
    }
  }
} 