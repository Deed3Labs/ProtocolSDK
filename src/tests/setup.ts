import { ethers } from 'ethers';

// Mock ethers provider
jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  ethers: {
    ...jest.requireActual('ethers').ethers,
    providers: {
      JsonRpcProvider: jest.fn().mockImplementation(() => ({
        getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
        getBlockNumber: jest.fn().mockResolvedValue(1000000),
      })),
    },
    Contract: jest.fn().mockImplementation(() => ({
      // Add mock contract methods here
    })),
  },
}));

// Global test setup
beforeAll(() => {
  // Add any global setup here
});

// Global test teardown
afterAll(() => {
  // Add any global teardown here
}); 