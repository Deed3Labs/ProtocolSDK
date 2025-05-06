import { ethers } from 'ethers';
import { IDeedNFT } from '../contracts/IDeedNFT.json';

export async function mintAsset(
  contract: ethers.Contract,
  owner: string,
  assetType: number,
  ipfsDetailsHash: string,
  definition: string,
  configuration: string,
  validatorAddress: string,
  salt: number
): Promise<number> {
  const tx = await contract.mintAsset(owner, assetType, ipfsDetailsHash, definition, configuration, validatorAddress, salt);
  await tx.wait();
  return tx.tokenId;
}

export async function burnAsset(contract: ethers.Contract, tokenId: number): Promise<void> {
  const tx = await contract.burnAsset(tokenId);
  await tx.wait();
}

export async function burnBatchAssets(contract: ethers.Contract, tokenIds: number[]): Promise<void> {
  const tx = await contract.burnBatchAssets(tokenIds);
  await tx.wait();
}

export async function transferFrom(contract: ethers.Contract, from: string, to: string, tokenId: number): Promise<void> {
  const tx = await contract.transferFrom(from, to, tokenId);
  await tx.wait();
}

export async function safeTransferFrom(contract: ethers.Contract, from: string, to: string, tokenId: number): Promise<void> {
  const tx = await contract.safeTransferFrom(from, to, tokenId);
  await tx.wait();
}

export async function updateMetadata(
  contract: ethers.Contract,
  tokenId: number,
  uri: string,
  operatingAgreement: string,
  definition: string,
  configuration: string
): Promise<void> {
  const tx = await contract.updateMetadata(tokenId, uri, operatingAgreement, definition, configuration);
  await tx.wait();
}

export async function tokenURI(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.tokenURI(tokenId);
}

export async function updateValidationStatus(
  contract: ethers.Contract,
  tokenId: number,
  isValid: boolean,
  validatorAddress: string
): Promise<void> {
  const tx = await contract.updateValidationStatus(tokenId, isValid, validatorAddress);
  await tx.wait();
}

export async function addMinter(contract: ethers.Contract, minter: string): Promise<void> {
  const tx = await contract.addMinter(minter);
  await tx.wait();
}

export async function removeMinter(contract: ethers.Contract, minter: string): Promise<void> {
  const tx = await contract.removeMinter(minter);
  await tx.wait();
}

export async function hasRole(contract: ethers.Contract, role: string, account: string): Promise<boolean> {
  return await contract.hasRole(role, account);
}

export async function setApprovedMarketplace(contract: ethers.Contract, marketplace: string, approved: boolean): Promise<void> {
  const tx = await contract.setApprovedMarketplace(marketplace, approved);
  await tx.wait();
}

export async function isApprovedMarketplace(contract: ethers.Contract, marketplace: string): Promise<boolean> {
  return await contract.isApprovedMarketplace(marketplace);
}

export async function setRoyaltyEnforcement(contract: ethers.Contract, enforced: boolean): Promise<void> {
  const tx = await contract.setRoyaltyEnforcement(enforced);
  await tx.wait();
}

export async function isRoyaltyEnforced(contract: ethers.Contract): Promise<boolean> {
  return await contract.isRoyaltyEnforced();
}

export async function getTransferValidator(contract: ethers.Contract): Promise<string> {
  return await contract.getTransferValidator();
}

export async function setTransferValidator(contract: ethers.Contract, validator: string): Promise<void> {
  const tx = await contract.setTransferValidator(validator);
  await tx.wait();
} 