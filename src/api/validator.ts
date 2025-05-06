import { ethers } from 'ethers';
import { IValidator } from '../contracts/IValidator.json';

export async function validateDeed(contract: ethers.Contract, tokenId: number): Promise<boolean> {
  return await contract.validateDeed(tokenId);
}

export async function validateOperatingAgreement(contract: ethers.Contract, operatingAgreement: string): Promise<boolean> {
  return await contract.validateOperatingAgreement(operatingAgreement);
}

export async function getValidationCriteria(contract: ethers.Contract, assetTypeId: number): Promise<[string[], string, boolean, boolean]> {
  return await contract.getValidationCriteria(assetTypeId);
}

export async function setValidationCriteria(
  contract: ethers.Contract,
  assetTypeId: number,
  requiredTraits: string[],
  additionalCriteria: string,
  requireOperatingAgreement: boolean,
  requireDefinition: boolean
): Promise<void> {
  const tx = await contract.setValidationCriteria(assetTypeId, requiredTraits, additionalCriteria, requireOperatingAgreement, requireDefinition);
  await tx.wait();
}

export async function registerOperatingAgreement(contract: ethers.Contract, uri: string, name: string): Promise<void> {
  const tx = await contract.registerOperatingAgreement(uri, name);
  await tx.wait();
}

export async function operatingAgreementName(contract: ethers.Contract, uri: string): Promise<string> {
  return await contract.operatingAgreementName(uri);
}

export async function defaultOperatingAgreement(contract: ethers.Contract): Promise<string> {
  return await contract.defaultOperatingAgreement();
}

export async function addWhitelistedToken(contract: ethers.Contract, token: string): Promise<void> {
  const tx = await contract.addWhitelistedToken(token);
  await tx.wait();
}

export async function removeWhitelistedToken(contract: ethers.Contract, token: string): Promise<void> {
  const tx = await contract.removeWhitelistedToken(token);
  await tx.wait();
}

export async function isTokenWhitelisted(contract: ethers.Contract, token: string): Promise<boolean> {
  return await contract.isTokenWhitelisted(token);
}

export async function getServiceFee(contract: ethers.Contract, token: string): Promise<number> {
  return await contract.getServiceFee(token);
}

export async function setServiceFee(contract: ethers.Contract, token: string, fee: number): Promise<void> {
  const tx = await contract.setServiceFee(token, fee);
  await tx.wait();
}

export async function withdrawServiceFees(contract: ethers.Contract, token: string): Promise<void> {
  const tx = await contract.withdrawServiceFees(token);
  await tx.wait();
}

export async function getRoyaltyFeePercentage(contract: ethers.Contract, tokenId: number): Promise<number> {
  return await contract.getRoyaltyFeePercentage(tokenId);
}

export async function setRoyaltyFeePercentage(contract: ethers.Contract, percentage: number): Promise<void> {
  const tx = await contract.setRoyaltyFeePercentage(percentage);
  await tx.wait();
}

export async function getRoyaltyReceiver(contract: ethers.Contract): Promise<string> {
  return await contract.getRoyaltyReceiver();
}

export async function setRoyaltyReceiver(contract: ethers.Contract, receiver: string): Promise<void> {
  const tx = await contract.setRoyaltyReceiver(receiver);
  await tx.wait();
}

export async function setPrimaryDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.setPrimaryDeedNFT(deedNFT);
  await tx.wait();
}

export async function addCompatibleDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.addCompatibleDeedNFT(deedNFT);
  await tx.wait();
}

export async function removeCompatibleDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.removeCompatibleDeedNFT(deedNFT);
  await tx.wait();
}

export async function isCompatibleDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<boolean> {
  return await contract.isCompatibleDeedNFT(deedNFT);
} 