import { ethers } from 'ethers';
import { NetworkConfig } from '../types';

export class NetworkMonitor {
  private provider: ethers.providers.Provider;
  private networkConfig: NetworkConfig;
  private listeners: Set<(chainId: number) => void>;

  constructor(provider: ethers.providers.Provider, networkConfig: NetworkConfig) {
    this.provider = provider;
    this.networkConfig = networkConfig;
    this.listeners = new Set();
  }

  async validateNetwork() {
    const network = await this.provider.getNetwork();
    if (network.chainId !== this.networkConfig.chainId) {
      throw new Error(`Wrong network. Please connect to ${this.networkConfig.name}`);
    }
  }

  onNetworkChange(callback: (chainId: number) => void) {
    this.listeners.add(callback);
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId: string) => {
        callback(parseInt(chainId));
      });
    }
  }

  cleanup() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('chainChanged');
    }
    this.listeners.clear();
  }
} 