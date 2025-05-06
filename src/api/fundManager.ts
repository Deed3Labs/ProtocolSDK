import { ethers } from 'ethers';
import { IFundManager } from '../contracts/IFundManager';

export async function mintDeedNFT(
  contract: ethers.Contract,
  owner: string,
  assetType: number,
  ipfsDetailsHash: string,
  definition: string,
  configuration: string,
  validatorContract: string,
  token: string,
  salt: number
): Promise<number> {
  const tx = await contract.mintDeedNFT(owner, assetType, ipfsDetailsHash, definition, configuration, validatorContract, token, salt);
  await tx.wait();
  return tx.tokenId;
}

export async function mintBatchDeedNFT(contract: ethers.Contract, deeds: any[]): Promise<number[]> {
  const tx = await contract.mintBatchDeedNFT(deeds);
  await tx.wait();
  return tx.tokenIds;
}

export async function withdrawValidatorFees(contract: ethers.Contract, validatorContract: string, token: string): Promise<void> {
  const tx = await contract.withdrawValidatorFees(validatorContract, token);
  await tx.wait();
}

export async function getCommissionBalance(contract: ethers.Contract, validatorContract: string, token: string): Promise<number> {
  return await contract.getCommissionBalance(validatorContract, token);
}

export async function setCommissionPercentage(contract: ethers.Contract, percentage: number): Promise<void> {
  const tx = await contract.setCommissionPercentage(percentage);
  await tx.wait();
}

export async function setFeeReceiver(contract: ethers.Contract, feeReceiver: string): Promise<void> {
  const tx = await contract.setFeeReceiver(feeReceiver);
  await tx.wait();
}

export async function setValidatorRegistry(contract: ethers.Contract, validatorRegistry: string): Promise<void> {
  const tx = await contract.setValidatorRegistry(validatorRegistry);
  await tx.wait();
}

export async function setDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.setDeedNFT(deedNFT);
  await tx.wait();
} 