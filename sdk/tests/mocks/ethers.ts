import { ethers } from 'ethers';

export const mockProvider = {
  getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
  getTransaction: jest.fn(),
  waitForTransaction: jest.fn()
} as unknown as ethers.providers.Provider;

export const mockSigner = {
  getAddress: jest.fn().mockResolvedValue('0x123'),
  signMessage: jest.fn()
} as unknown as ethers.Signer; 