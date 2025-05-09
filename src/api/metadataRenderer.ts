/**
 * @file MetadataRenderer API
 * @description This module provides functions to interact with the MetadataRenderer smart contract.
 * It handles all operations related to token metadata, including URIs, traits, features, conditions,
 * legal information, documents, gallery, and animations.
 * 
 * @module MetadataRenderer
 */

import { ethers } from 'ethers';
import { IMetadataRenderer as IMetadataRendererContract } from '../contracts/IMetadataRenderer';

/**
 * @function tokenURI
 * @description Retrieves the URI for a specific token's metadata
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string>} The token's URI
 */
export async function tokenURI(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.tokenURI(tokenId);
}

/**
 * @function syncTraitUpdate
 * @description Updates a specific trait for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} traitKey - The key of the trait to update
 * @param {string} traitValue - The new value for the trait
 * @returns {Promise<void>}
 * @throws {Error} If the trait update fails
 */
export async function syncTraitUpdate(contract: ethers.Contract, tokenId: number, traitKey: string, traitValue: string): Promise<void> {
  const tx = await contract.syncTraitUpdate(tokenId, traitKey, traitValue);
  await tx.wait();
}

/**
 * @function setTokenCustomMetadata
 * @description Sets custom metadata for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} metadata - The custom metadata string
 * @returns {Promise<void>}
 * @throws {Error} If setting the metadata fails
 */
export async function setTokenCustomMetadata(contract: ethers.Contract, tokenId: number, metadata: string): Promise<void> {
  const tx = await contract.setTokenCustomMetadata(tokenId, metadata);
  await tx.wait();
}

/**
 * @function setTokenFeatures
 * @description Sets the features for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string[]} features - Array of feature strings
 * @returns {Promise<void>}
 * @throws {Error} If setting the features fails
 */
export async function setTokenFeatures(contract: ethers.Contract, tokenId: number, features: string[]): Promise<void> {
  const tx = await contract.setTokenFeatures(tokenId, features);
  await tx.wait();
}

/**
 * @function getTokenFeatures
 * @description Gets the features for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string[]>} Array of feature strings
 */
export async function getTokenFeatures(contract: ethers.Contract, tokenId: number): Promise<string[]> {
  return await contract.getTokenFeatures(tokenId);
}

/**
 * @function setAssetCondition
 * @description Sets the condition information for an asset
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} generalCondition - The general condition description
 * @param {string} lastInspectionDate - The date of the last inspection
 * @param {string[]} knownIssues - Array of known issues
 * @param {string[]} improvements - Array of improvements made
 * @param {string} additionalNotes - Any additional notes about the condition
 * @returns {Promise<void>}
 * @throws {Error} If setting the asset condition fails
 */
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

/**
 * @function getAssetCondition
 * @description Gets the condition information for an asset
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<[string, string, string[], string[], string]>} Tuple containing condition information
 */
export async function getAssetCondition(contract: ethers.Contract, tokenId: number): Promise<[string, string, string[], string[], string]> {
  return await contract.getAssetCondition(tokenId);
}

/**
 * @function setTokenLegalInfo
 * @description Sets the legal information for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} jurisdiction - The legal jurisdiction
 * @param {string} registrationNumber - The registration number
 * @param {string} registrationDate - The registration date
 * @param {string[]} documents - Array of document references
 * @param {string[]} restrictions - Array of legal restrictions
 * @param {string} additionalInfo - Any additional legal information
 * @returns {Promise<void>}
 * @throws {Error} If setting the legal information fails
 */
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

/**
 * @function getTokenLegalInfo
 * @description Gets the legal information for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<[string, string, string, string[], string[], string]>} Tuple containing legal information
 */
export async function getTokenLegalInfo(contract: ethers.Contract, tokenId: number): Promise<[string, string, string, string[], string[], string]> {
  return await contract.getTokenLegalInfo(tokenId);
}

/**
 * @function manageTokenDocument
 * @description Adds or removes a document for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} docType - The type of document
 * @param {string} documentURI - The URI of the document
 * @param {boolean} isRemove - Whether to remove the document (true) or add it (false)
 * @returns {Promise<void>}
 * @throws {Error} If managing the document fails
 */
export async function manageTokenDocument(contract: ethers.Contract, tokenId: number, docType: string, documentURI: string, isRemove: boolean): Promise<void> {
  const tx = await contract.manageTokenDocument(tokenId, docType, documentURI, isRemove);
  await tx.wait();
}

/**
 * @function getTokenDocument
 * @description Gets a specific document for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} docType - The type of document to retrieve
 * @returns {Promise<string>} The document URI
 */
export async function getTokenDocument(contract: ethers.Contract, tokenId: number, docType: string): Promise<string> {
  return await contract.getTokenDocument(tokenId, docType);
}

/**
 * @function getTokenDocumentTypes
 * @description Gets all document types for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string[]>} Array of document types
 */
export async function getTokenDocumentTypes(contract: ethers.Contract, tokenId: number): Promise<string[]> {
  return await contract.getTokenDocumentTypes(tokenId);
}

/**
 * @function getTokenDocuments
 * @description Gets all documents for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<any[]>} Array of document information
 */
export async function getTokenDocuments(contract: ethers.Contract, tokenId: number): Promise<any[]> {
  return await contract.getTokenDocuments(tokenId);
}

/**
 * @function setTokenGallery
 * @description Sets the gallery images for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string[]} imageUrls - Array of image URLs
 * @returns {Promise<void>}
 * @throws {Error} If setting the gallery fails
 */
export async function setTokenGallery(contract: ethers.Contract, tokenId: number, imageUrls: string[]): Promise<void> {
  const tx = await contract.setTokenGallery(tokenId, imageUrls);
  await tx.wait();
}

/**
 * @function getTokenGallery
 * @description Gets the gallery images for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string[]>} Array of image URLs
 */
export async function getTokenGallery(contract: ethers.Contract, tokenId: number): Promise<string[]> {
  return await contract.getTokenGallery(tokenId);
}

/**
 * @function setTokenAnimationURL
 * @description Sets the animation URL for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} animationURL - The URL of the animation
 * @returns {Promise<void>}
 * @throws {Error} If setting the animation URL fails
 */
export async function setTokenAnimationURL(contract: ethers.Contract, tokenId: number, animationURL: string): Promise<void> {
  const tx = await contract.setTokenAnimationURL(tokenId, animationURL);
  await tx.wait();
}

/**
 * @function setTokenExternalLink
 * @description Sets the external link for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} externalLink - The external link URL
 * @returns {Promise<void>}
 * @throws {Error} If setting the external link fails
 */
export async function setTokenExternalLink(contract: ethers.Contract, tokenId: number, externalLink: string): Promise<void> {
  const tx = await contract.setTokenExternalLink(tokenId, externalLink);
  await tx.wait();
}

/**
 * @function getTokenAnimationURL
 * @description Gets the animation URL for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string>} The animation URL
 */
export async function getTokenAnimationURL(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.getTokenAnimationURL(tokenId);
}

/**
 * @function getTokenExternalLink
 * @description Gets the external link for a token
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string>} The external link URL
 */
export async function getTokenExternalLink(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.getTokenExternalLink(tokenId);
}

/**
 * @function setDeedNFT
 * @description Sets the DeedNFT contract address
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {string} deedNFT - The address of the DeedNFT contract
 * @returns {Promise<void>}
 * @throws {Error} If setting the DeedNFT contract fails
 */
export async function setDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.setDeedNFT(deedNFT);
  await tx.wait();
}

/**
 * @function setAssetTypeImageURI
 * @description Sets the image URI for an asset type
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} assetType - The asset type identifier
 * @param {string} imageURI - The image URI to set
 * @returns {Promise<void>}
 * @throws {Error} If setting the image URI fails
 */
export async function setAssetTypeImageURI(contract: ethers.Contract, assetType: number, imageURI: string): Promise<void> {
  const tx = await contract.setAssetTypeImageURI(assetType, imageURI);
  await tx.wait();
}

/**
 * @function setAssetTypeBackgroundColor
 * @description Sets the background color for an asset type
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {number} assetType - The asset type identifier
 * @param {string} backgroundColor - The background color to set
 * @returns {Promise<void>}
 * @throws {Error} If setting the background color fails
 */
export async function setAssetTypeBackgroundColor(contract: ethers.Contract, assetType: number, backgroundColor: string): Promise<void> {
  const tx = await contract.setAssetTypeBackgroundColor(assetType, backgroundColor);
  await tx.wait();
}

/**
 * @function setInvalidatedImageURI
 * @description Sets the image URI for invalidated tokens
 * @param {ethers.Contract} contract - The MetadataRenderer contract instance
 * @param {string} imageURI - The image URI to set for invalidated tokens
 * @returns {Promise<void>}
 * @throws {Error} If setting the invalidated image URI fails
 */
export async function setInvalidatedImageURI(contract: ethers.Contract, imageURI: string): Promise<void> {
  const tx = await contract.setInvalidatedImageURI(imageURI);
  await tx.wait();
} 