import { ethers } from 'ethers';
import { MockProvider } from '@ethereum-waffle/provider';

export const testProvider = new MockProvider();
export const [wallet1, wallet2] = testProvider.getWallets();

export const TEST_TIMEOUT = 30000; // 30 seconds 