import { ethers } from 'ethers';
import { IDeedNFT } from '../contracts/IDeedNFT';
import { TransactionManager, TransactionResult } from '../utils/transactionManager';

interface TransactionLog {
  topics: string[];
}

export async function mintAsset(
  contract: ethers.Contract,
  owner: string,
  assetType: number,
  ipfsDetailsHash: string,
  definition: string,
  configuration: string,
  validatorAddress: string,
  salt: number,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.mintAsset(owner, assetType, ipfsDetailsHash, definition, configuration, validatorAddress, salt);
  return await transactionManager.sendTransaction(tx);
}

export async function burnAsset(
  contract: ethers.Contract, 
  tokenId: number,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.burnAsset(tokenId);
  return await transactionManager.sendTransaction(tx);
}

export async function burnBatchAssets(
  contract: ethers.Contract, 
  tokenIds: number[],
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.burnBatchAssets(tokenIds);
  return await transactionManager.sendTransaction(tx);
}

export async function transferFrom(
  contract: ethers.Contract, 
  from: string, 
  to: string, 
  tokenId: number,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.transferFrom(from, to, tokenId);
  return await transactionManager.sendTransaction(tx);
}

export async function safeTransferFrom(
  contract: ethers.Contract, 
  from: string, 
  to: string, 
  tokenId: number,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.safeTransferFrom(from, to, tokenId);
  return await transactionManager.sendTransaction(tx);
}

export async function updateMetadata(
  contract: ethers.Contract,
  tokenId: number,
  ipfsDetailsHash: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.updateMetadata(tokenId, ipfsDetailsHash);
  await tx.wait();
}

export async function tokenURI(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.tokenURI(tokenId);
}

export async function updateValidationStatus(
  contract: ethers.Contract,
  tokenId: number,
  isValid: boolean,
  validatorAddress: string,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.updateValidationStatus(tokenId, isValid, validatorAddress);
  return await transactionManager.sendTransaction(tx);
}

export async function addMinter(
  contract: ethers.Contract,
  minter: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.addMinter(minter);
  await tx.wait();
}

export async function removeMinter(
  contract: ethers.Contract,
  minter: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.removeMinter(minter);
  await tx.wait();
}

export async function isMinter(
  contract: ethers.Contract,
  minter: string
): Promise<boolean> {
  return await contract.isMinter(minter);
}

export async function addApprovedMarketplace(
  contract: ethers.Contract,
  marketplace: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.addApprovedMarketplace(marketplace);
  await tx.wait();
}

export async function removeApprovedMarketplace(
  contract: ethers.Contract,
  marketplace: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.removeApprovedMarketplace(marketplace);
  await tx.wait();
}

export async function isApprovedMarketplace(
  contract: ethers.Contract,
  marketplace: string
): Promise<boolean> {
  return await contract.isApprovedMarketplace(marketplace);
}

export async function setRoyaltyEnforcement(
  contract: ethers.Contract,
  enforce: boolean,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.setRoyaltyEnforcement(enforce);
  await tx.wait();
}

export async function isRoyaltyEnforced(
  contract: ethers.Contract
): Promise<boolean> {
  return await contract.isRoyaltyEnforced();
}

export async function getTransferValidator(
  contract: ethers.Contract
): Promise<string> {
  return await contract.getTransferValidator();
}

export async function setTransferValidator(
  contract: ethers.Contract,
  validator: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.setTransferValidator(validator);
  await tx.wait();
}

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
  const receipt = await tx.wait();
  const event = receipt.logs[0] as TransactionLog;
  return Number(event.topics[3]);
}

export async function mintBatchDeedNFT(
  contract: ethers.Contract,
  deeds: Array<{
    owner: string;
    assetType: number;
    ipfsDetailsHash: string;
    definition: string;
    configuration: string;
    validatorContract: string;
    token: string;
    salt: number;
  }>
): Promise<number[]> {
  const tx = await contract.mintBatchDeedNFT(deeds);
  const receipt = await tx.wait();
  const events = receipt.logs as TransactionLog[];
  return events.map(event => Number(event.topics[3]));
} 