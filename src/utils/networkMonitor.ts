import { type PublicClient } from 'viem'
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
    this.unwatch = this.publicClient.transport.subscribe({
      params: ['eth_chainId'],
      onData: (chainId: string) => {
        const numericChainId = parseInt(chainId, 16)
        this.listeners.forEach(callback => callback(numericChainId))
      }
    })
  }

  async validateNetwork(): Promise<void> {
    const chainId = await this.publicClient.getChainId()
    if (chainId !== this.networkConfig.chainId) {
      throw new ProtocolError(
        `Wrong network. Please connect to ${this.networkConfig.name}`,
        ErrorType.NETWORK_MISMATCH
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