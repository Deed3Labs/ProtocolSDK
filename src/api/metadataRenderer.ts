/**
 * @file MetadataRenderer API
 * @description This module provides functions to interact with the MetadataRenderer smart contract.
 * It handles all operations related to metadata rendering, trait management, and document handling.
 * 
 * @module MetadataRenderer
 */

import { ethers } from 'ethers';
import { IMetadataRendererContract } from '../contracts';
import { TransactionManager, TransactionResult } from '../utils/transactionManager';

/**
 * @function tokenURI
 * @description Gets the metadata URI for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string>} The metadata URI
 */
export async function tokenURI(contract: IMetadataRendererContract, tokenId: number): Promise<string> {
  return await contract.tokenURI(tokenId);
}

/**
 * @function contractURI
 * @description Gets the contract URI
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @returns {Promise<string>} The contract URI
 */
export async function contractURI(contract: IMetadataRendererContract): Promise<string> {
  return await contract.contractURI();
}

/**
 * @function setTokenCustomMetadata
 * @description Sets custom metadata for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} metadata - The custom metadata
 * @returns {Promise<TransactionResult>}
 */
export async function setTokenCustomMetadata(
  contract: IMetadataRendererContract,
  tokenId: number,
  metadata: string
): Promise<TransactionResult> {
  const tx = await contract.setTokenCustomMetadata(tokenId, metadata);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setTokenFeatures
 * @description Sets features for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string[]} features - Array of feature strings
 * @returns {Promise<TransactionResult>}
 */
export async function setTokenFeatures(
  contract: IMetadataRendererContract,
  tokenId: number,
  features: string[]
): Promise<TransactionResult> {
  const tx = await contract.setTokenFeatures(tokenId, features);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getTokenFeatures
 * @description Gets features for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string[]>} Array of feature strings
 */
export async function getTokenFeatures(
  contract: IMetadataRendererContract,
  tokenId: number
): Promise<string[]> {
  return await contract.getTokenFeatures(tokenId);
}

/**
 * @function setAssetCondition
 * @description Sets condition information for an asset
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} generalCondition - General condition rating
 * @param {string} lastInspectionDate - Date of last inspection
 * @param {string[]} knownIssues - Array of known issues
 * @param {string[]} improvements - Array of improvements
 * @param {string} additionalNotes - Additional notes
 * @returns {Promise<TransactionResult>}
 */
export async function setAssetCondition(
  contract: IMetadataRendererContract,
  tokenId: number,
  generalCondition: string,
  lastInspectionDate: string,
  knownIssues: string[],
  improvements: string[],
  additionalNotes: string
): Promise<TransactionResult> {
  const tx = await contract.setAssetCondition(
    tokenId,
    generalCondition,
    lastInspectionDate,
    knownIssues,
    improvements,
    additionalNotes
  );
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getAssetCondition
 * @description Gets condition information for an asset
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<{
 *   generalCondition: string,
 *   lastInspectionDate: string,
 *   knownIssues: string[],
 *   improvements: string[],
 *   additionalNotes: string
 * }>} The condition information
 */
export async function getAssetCondition(
  contract: IMetadataRendererContract,
  tokenId: number
): Promise<{
  generalCondition: string;
  lastInspectionDate: string;
  knownIssues: string[];
  improvements: string[];
  additionalNotes: string;
}> {
  return await contract.getAssetCondition(tokenId);
}

/**
 * @function setTokenLegalInfo
 * @description Sets legal information for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} jurisdiction - Legal jurisdiction
 * @param {string} registrationNumber - Official registration number
 * @param {string} registrationDate - Date of registration
 * @param {string[]} documents - Array of legal documents
 * @param {string[]} restrictions - Array of legal restrictions
 * @param {string} additionalInfo - Additional legal information
 * @returns {Promise<TransactionResult>}
 */
export async function setTokenLegalInfo(
  contract: IMetadataRendererContract,
  tokenId: number,
  jurisdiction: string,
  registrationNumber: string,
  registrationDate: string,
  documents: string[],
  restrictions: string[],
  additionalInfo: string
): Promise<TransactionResult> {
  const tx = await contract.setTokenLegalInfo(
    tokenId,
    jurisdiction,
    registrationNumber,
    registrationDate,
    documents,
    restrictions,
    additionalInfo
  );
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getTokenLegalInfo
 * @description Gets legal information for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<{
 *   jurisdiction: string,
 *   registrationNumber: string,
 *   registrationDate: string,
 *   documents: string[],
 *   restrictions: string[],
 *   additionalInfo: string
 * }>} The legal information
 */
export async function getTokenLegalInfo(
  contract: IMetadataRendererContract,
  tokenId: number
): Promise<{
  jurisdiction: string;
  registrationNumber: string;
  registrationDate: string;
  documents: string[];
  restrictions: string[];
  additionalInfo: string;
}> {
  return await contract.getTokenLegalInfo(tokenId);
}

/**
 * @function manageTokenDocument
 * @description Manages a token's document
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} docType - The document type
 * @param {string} documentURI - The document URI
 * @param {boolean} isRemove - Whether to remove the document
 * @returns {Promise<TransactionResult>}
 */
export async function manageTokenDocument(
  contract: IMetadataRendererContract,
  tokenId: number,
  docType: string,
  documentURI: string,
  isRemove: boolean
): Promise<TransactionResult> {
  const tx = await contract.manageTokenDocument(tokenId, docType, documentURI, isRemove);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getTokenDocument
 * @description Gets a token's document URI
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} docType - The document type
 * @returns {Promise<string>} The document URI
 */
export async function getTokenDocument(
  contract: IMetadataRendererContract,
  tokenId: number,
  docType: string
): Promise<string> {
  return await contract.getTokenDocument(tokenId, docType);
}

/**
 * @function getTokenDocumentTypes
 * @description Gets all document types for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string[]>} Array of document types
 */
export async function getTokenDocumentTypes(
  contract: IMetadataRendererContract,
  tokenId: number
): Promise<string[]> {
  return await contract.getTokenDocumentTypes(tokenId);
}

/**
 * @function getTokenDocuments
 * @description Gets all documents for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<Array<{docType: string, documentURI: string}>>} Array of documents
 */
export async function getTokenDocuments(
  contract: IMetadataRendererContract,
  tokenId: number
): Promise<Array<{ docType: string; documentURI: string }>> {
  return await contract.getTokenDocuments(tokenId);
}

/**
 * @function setTokenGallery
 * @description Sets the token gallery
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {Promise<TransactionResult>}
 */
export async function setTokenGallery(
  contract: IMetadataRendererContract,
  tokenId: number,
  imageUrls: string[]
): Promise<TransactionResult> {
  const tx = await contract.setTokenGallery(tokenId, imageUrls);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getTokenGallery
 * @description Gets the token gallery
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string[]>} Array of image URLs
 */
export async function getTokenGallery(
  contract: IMetadataRendererContract,
  tokenId: number
): Promise<string[]> {
  return await contract.getTokenGallery(tokenId);
}

/**
 * @function setDeedNFT
 * @description Sets the DeedNFT contract address
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {string} deedNFT - The DeedNFT contract address
 * @returns {Promise<TransactionResult>}
 */
export async function setDeedNFT(
  contract: IMetadataRendererContract,
  deedNFT: string
): Promise<TransactionResult> {
  const tx = await contract.setDeedNFT(deedNFT);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setAssetTypeImageURI
 * @description Sets the default image URI for an asset type
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} assetType - The asset type
 * @param {string} imageURI - The image URI
 * @returns {Promise<TransactionResult>}
 */
export async function setAssetTypeImageURI(
  contract: IMetadataRendererContract,
  assetType: number,
  imageURI: string
): Promise<TransactionResult> {
  const tx = await contract.setAssetTypeImageURI(assetType, imageURI);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setAssetTypeBackgroundColor
 * @description Sets the default background color for an asset type
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} assetType - The asset type
 * @param {string} backgroundColor - The background color
 * @returns {Promise<TransactionResult>}
 */
export async function setAssetTypeBackgroundColor(
  contract: IMetadataRendererContract,
  assetType: number,
  backgroundColor: string
): Promise<TransactionResult> {
  const tx = await contract.setAssetTypeBackgroundColor(assetType, backgroundColor);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setInvalidatedImageURI
 * @description Sets the default image URI for invalidated assets
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {string} imageURI - The image URI
 * @returns {Promise<TransactionResult>}
 */
export async function setInvalidatedImageURI(
  contract: IMetadataRendererContract,
  imageURI: string
): Promise<TransactionResult> {
  const tx = await contract.setInvalidatedImageURI(imageURI);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setTokenAnimationURL
 * @description Sets the animation URL for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} animationURL - The animation URL
 * @returns {Promise<TransactionResult>}
 */
export async function setTokenAnimationURL(
  contract: IMetadataRendererContract,
  tokenId: number,
  animationURL: string
): Promise<TransactionResult> {
  const tx = await contract.setTokenAnimationURL(tokenId, animationURL);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setTokenExternalLink
 * @description Sets the external link for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} externalLink - The external link
 * @returns {Promise<TransactionResult>}
 */
export async function setTokenExternalLink(
  contract: IMetadataRendererContract,
  tokenId: number,
  externalLink: string
): Promise<TransactionResult> {
  const tx = await contract.setTokenExternalLink(tokenId, externalLink);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getTokenAnimationURL
 * @description Gets the animation URL for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string>} The animation URL
 */
export async function getTokenAnimationURL(
  contract: IMetadataRendererContract,
  tokenId: number
): Promise<string> {
  return await contract.getTokenAnimationURL(tokenId);
}

/**
 * @function getTokenExternalLink
 * @description Gets the external link for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string>} The external link
 */
export async function getTokenExternalLink(
  contract: IMetadataRendererContract,
  tokenId: number
): Promise<string> {
  return await contract.getTokenExternalLink(tokenId);
}

/**
 * @function syncTraitUpdate
 * @description Syncs metadata with DeedNFT trait updates
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} traitKey - Key of the updated trait
 * @param {string} traitValue - New value of the trait
 * @returns {Promise<TransactionResult>}
 */
export async function syncTraitUpdate(
  contract: IMetadataRendererContract,
  tokenId: number,
  traitKey: string,
  traitValue: string
): Promise<TransactionResult> {
  const tx = await contract.syncTraitUpdate(tokenId, traitKey, traitValue);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
} 