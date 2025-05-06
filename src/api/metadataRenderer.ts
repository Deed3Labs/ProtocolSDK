import { ethers } from 'ethers';
import { IMetadataRenderer as IMetadataRendererContract } from '../contracts/IMetadataRenderer';

export async function tokenURI(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.tokenURI(tokenId);
}

export async function syncTraitUpdate(contract: ethers.Contract, tokenId: number, traitKey: string, traitValue: string): Promise<void> {
  const tx = await contract.syncTraitUpdate(tokenId, traitKey, traitValue);
  await tx.wait();
}

export async function setTokenCustomMetadata(contract: ethers.Contract, tokenId: number, metadata: string): Promise<void> {
  const tx = await contract.setTokenCustomMetadata(tokenId, metadata);
  await tx.wait();
}

export async function setTokenFeatures(contract: ethers.Contract, tokenId: number, features: string[]): Promise<void> {
  const tx = await contract.setTokenFeatures(tokenId, features);
  await tx.wait();
}

export async function getTokenFeatures(contract: ethers.Contract, tokenId: number): Promise<string[]> {
  return await contract.getTokenFeatures(tokenId);
}

export async function setAssetCondition(
  contract: ethers.Contract,
  tokenId: number,
  generalCondition: string,
  lastInspectionDate: string,
  knownIssues: string[],
  improvements: string[],
  additionalNotes: string
): Promise<void> {
  const tx = await contract.setAssetCondition(tokenId, generalCondition, lastInspectionDate, knownIssues, improvements, additionalNotes);
  await tx.wait();
}

export async function getAssetCondition(contract: ethers.Contract, tokenId: number): Promise<[string, string, string[], string[], string]> {
  return await contract.getAssetCondition(tokenId);
}

export async function setTokenLegalInfo(
  contract: ethers.Contract,
  tokenId: number,
  jurisdiction: string,
  registrationNumber: string,
  registrationDate: string,
  documents: string[],
  restrictions: string[],
  additionalInfo: string
): Promise<void> {
  const tx = await contract.setTokenLegalInfo(tokenId, jurisdiction, registrationNumber, registrationDate, documents, restrictions, additionalInfo);
  await tx.wait();
}

export async function getTokenLegalInfo(contract: ethers.Contract, tokenId: number): Promise<[string, string, string, string[], string[], string]> {
  return await contract.getTokenLegalInfo(tokenId);
}

export async function manageTokenDocument(contract: ethers.Contract, tokenId: number, docType: string, documentURI: string, isRemove: boolean): Promise<void> {
  const tx = await contract.manageTokenDocument(tokenId, docType, documentURI, isRemove);
  await tx.wait();
}

export async function getTokenDocument(contract: ethers.Contract, tokenId: number, docType: string): Promise<string> {
  return await contract.getTokenDocument(tokenId, docType);
}

export async function getTokenDocumentTypes(contract: ethers.Contract, tokenId: number): Promise<string[]> {
  return await contract.getTokenDocumentTypes(tokenId);
}

export async function getTokenDocuments(contract: ethers.Contract, tokenId: number): Promise<any[]> {
  return await contract.getTokenDocuments(tokenId);
}

export async function setTokenGallery(contract: ethers.Contract, tokenId: number, imageUrls: string[]): Promise<void> {
  const tx = await contract.setTokenGallery(tokenId, imageUrls);
  await tx.wait();
}

export async function getTokenGallery(contract: ethers.Contract, tokenId: number): Promise<string[]> {
  return await contract.getTokenGallery(tokenId);
}

export async function setTokenAnimationURL(contract: ethers.Contract, tokenId: number, animationURL: string): Promise<void> {
  const tx = await contract.setTokenAnimationURL(tokenId, animationURL);
  await tx.wait();
}

export async function setTokenExternalLink(contract: ethers.Contract, tokenId: number, externalLink: string): Promise<void> {
  const tx = await contract.setTokenExternalLink(tokenId, externalLink);
  await tx.wait();
}

export async function getTokenAnimationURL(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.getTokenAnimationURL(tokenId);
}

export async function getTokenExternalLink(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.getTokenExternalLink(tokenId);
}

export async function setDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.setDeedNFT(deedNFT);
  await tx.wait();
}

export async function setAssetTypeImageURI(contract: ethers.Contract, assetType: number, imageURI: string): Promise<void> {
  const tx = await contract.setAssetTypeImageURI(assetType, imageURI);
  await tx.wait();
}

export async function setAssetTypeBackgroundColor(contract: ethers.Contract, assetType: number, backgroundColor: string): Promise<void> {
  const tx = await contract.setAssetTypeBackgroundColor(assetType, backgroundColor);
  await tx.wait();
}

export async function setInvalidatedImageURI(contract: ethers.Contract, imageURI: string): Promise<void> {
  const tx = await contract.setInvalidatedImageURI(imageURI);
  await tx.wait();
} 