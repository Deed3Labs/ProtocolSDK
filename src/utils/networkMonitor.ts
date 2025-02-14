import { type PublicClient, watchChainId } from 'viem'
import { NetworkConfig } from '../config/types'
import { ProtocolError, ErrorType } from './errors'

export class NetworkMonitor {
  private unwatch: (() => void) | null = null
  private listeners: Set<(chainId: number) => void> = new Set()

  constructor(
    private publicClient: PublicClient,
    private networkConfig: NetworkConfig
  ) {
    this.setupChainWatcher()
  }

  private setupChainWatcher() {
    this.unwatch = watchChainId(this.publicClient, {
      onChainIdChanged: (chainId) => {
        this.listeners.forEach(callback => callback(chainId))
      }
    })
  }

  async validateNetwork(): Promise<void> {
    const chainId = await this.publicClient.getChainId()
    if (chainId !== this.networkConfig.chainId) {
      throw new ProtocolError(
        ErrorType.NETWORK_MISMATCH,
        `Wrong network. Please connect to ${this.networkConfig.name}`
      )
    }
  }

  onNetworkChange(callback: (chainId: number) => void): void {
    this.listeners.add(callback)
  }

  cleanup(): void {
    if (this.unwatch) {
      this.unwatch()
    }
    this.listeners.clear()
  }
} 