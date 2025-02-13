import { ethers } from 'ethers';

export interface TransactionConfig {
  gasLimit?: number;
  gasPrice?: ethers.BigNumber;
  nonce?: number;
  value?: ethers.BigNumber;
  maxFeePerGas?: ethers.BigNumber;
  maxPriorityFeePerGas?: ethers.BigNumber;
}

export interface TransactionResponse extends ethers.providers.TransactionResponse {
  wait: (confirmations?: number) => Promise<ethers.providers.TransactionReceipt>;
} 