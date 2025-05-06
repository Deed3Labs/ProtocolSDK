import { ethers } from 'ethers';
import { IDeedNFT } from '../contracts/IDeedNFT';
import { TransactionManager, TransactionResult } from '../utils/transactionManager';

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
  uri: string,
  operatingAgreement: string,
  definition: string,
  configuration: string,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.updateMetadata(tokenId, uri, operatingAgreement, definition, configuration);
  return await transactionManager.sendTransaction(tx);
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
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.addMinter(minter);
  return await transactionManager.sendTransaction(tx);
}

export async function removeMinter(
  contract: ethers.Contract, 
  minter: string,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.removeMinter(minter);
  return await transactionManager.sendTransaction(tx);
}

export async function hasRole(contract: ethers.Contract, role: string, account: string): Promise<boolean> {
  return await contract.hasRole(role, account);
}

export async function setApprovedMarketplace(
  contract: ethers.Contract, 
  marketplace: string, 
  approved: boolean,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.setApprovedMarketplace(marketplace, approved);
  return await transactionManager.sendTransaction(tx);
}

export async function isApprovedMarketplace(contract: ethers.Contract, marketplace: string): Promise<boolean> {
  return await contract.isApprovedMarketplace(marketplace);
}

export async function setRoyaltyEnforcement(
  contract: ethers.Contract, 
  enforced: boolean,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.setRoyaltyEnforcement(enforced);
  return await transactionManager.sendTransaction(tx);
}

export async function isRoyaltyEnforced(contract: ethers.Contract): Promise<boolean> {
  return await contract.isRoyaltyEnforced();
}

export async function getTransferValidator(contract: ethers.Contract): Promise<string> {
  return await contract.getTransferValidator();
}

export async function setTransferValidator(
  contract: ethers.Contract, 
  validator: string,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.setTransferValidator(validator);
  return await transactionManager.sendTransaction(tx);
} 