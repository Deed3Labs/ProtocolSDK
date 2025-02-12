import { ethers } from 'ethers';
import { DeedNFTEvents, SubdivideEvents, FractionalizeEvents } from '../types/events';

export class EventManager {
  private contracts: {
    deedNFT: ethers.Contract;
    subdivide: ethers.Contract;
    fractionalize: ethers.Contract;
  };

  private listeners: Map<string, ethers.providers.Listener> = new Map();

  constructor(contracts: {
    deedNFT: ethers.Contract;
    subdivide: ethers.Contract;
    fractionalize: ethers.Contract;
  }) {
    this.contracts = contracts;
  }

  listenToDeedEvents(callbacks: Partial<DeedNFTEvents>) {
    Object.entries(callbacks).forEach(([event, callback]) => {
      const listener = (...args: any[]) => callback(...args);
      this.contracts.deedNFT.on(event, listener);
      this.listeners.set(`deedNFT:${event}`, listener);
    });
  }

  listenToSubdivideEvents(callbacks: Partial<SubdivideEvents>) {
    if (!this.contracts.subdivide) return;

    Object.entries(callbacks).forEach(([event, callback]) => {
      this.contracts.subdivide?.on(event, (...args) => {
        callback(...args);
      });
    });
  }

  removeAllListeners() {
    this.listeners.forEach((listener, key) => {
      const [contract, event] = key.split(':');
      this.contracts[contract as keyof typeof this.contracts].off(event, listener);
    });
    this.listeners.clear();
  }
} 