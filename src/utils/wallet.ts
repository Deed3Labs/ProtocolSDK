import { ethers } from 'ethers';
import { DynamicWallet } from '@dynamic-labs/sdk';
import WalletConnect from '@walletconnect/web3-provider';

export class WalletManager {
  private provider: ethers.providers.Web3Provider | null = null;
  private dynamic: DynamicWallet | null = null;
  
  constructor() {
    this.initializeDynamic();
  }

  private async initializeDynamic() {
    this.dynamic = new DynamicWallet({
      environmentId: 'YOUR_DYNAMIC_ENV_ID',
      walletConnectors: ['metamask', 'walletconnect']
    });
  }

  async connectWallet(walletType: 'metamask' | 'walletconnect' | 'dynamic') {
    switch(walletType) {
      case 'metamask':
        return this.connectMetaMask();
      case 'walletconnect':
        return this.connectWalletConnect();
      case 'dynamic':
        return this.connectDynamic();
    }
  }

  private async connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      return this.provider;
    }
    throw new Error('MetaMask not installed');
  }

  private async connectWalletConnect() {
    const walletConnect = new WalletConnect({
      infuraId: 'YOUR_INFURA_ID'
    });
    await walletConnect.enable();
    this.provider = new ethers.providers.Web3Provider(walletConnect);
    return this.provider;
  }

  private async connectDynamic() {
    const connection = await this.dynamic?.connect();
    if (connection) {
      this.provider = new ethers.providers.Web3Provider(connection);
      return this.provider;
    }
    throw new Error('Dynamic connection failed');
  }

  async getSigner() {
    if (!this.provider) {
      await this.connectWallet('metamask');
    }
    return this.provider!.getSigner();
  }
} 