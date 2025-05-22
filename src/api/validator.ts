/**
 * @file Validator API
 * @description This module provides functions to interact with the Validator smart contract.
 * It handles all operations related to deed validation, metadata management, and fee handling.
 * 
 * @module Validator
 */

import { ethers } from 'ethers';
import { IValidatorContract } from '../contracts';
import { AssetType } from '../types/contracts';
import { TransactionManager, TransactionResult } from '../utils/transactionManager';

/**
 * @function getBaseUri
 * @description Gets the base URI for token metadata
 * @param {ethers.Contract} contract - The Validator contract instance
 * @returns {Promise<string>} The base URI
 */
export async function getBaseUri(contract: ethers.Contract): Promise<string> {
  return await contract.getBaseUri();
}

/**
 * @function setBaseUri
 * @description Sets the base URI for token metadata
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} newBaseUri - The new base URI
 * @returns {Promise<TransactionResult>}
 */
export async function setBaseUri(contract: ethers.Contract, newBaseUri: string): Promise<TransactionResult> {
  const tx = await contract.setBaseUri(newBaseUri);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getDefaultOperatingAgreement
 * @description Gets the default operating agreement URI
 * @param {ethers.Contract} contract - The Validator contract instance
 * @returns {Promise<string>} The default operating agreement URI
 */
export async function getDefaultOperatingAgreement(contract: ethers.Contract): Promise<string> {
  return await contract.defaultOperatingAgreement();
}

/**
 * @function setDefaultOperatingAgreement
 * @description Sets the default operating agreement URI
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} uri - The new default operating agreement URI
 * @returns {Promise<TransactionResult>}
 */
export async function setDefaultOperatingAgreement(contract: ethers.Contract, uri: string): Promise<TransactionResult> {
  const tx = await contract.setDefaultOperatingAgreement(uri);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setOperatingAgreementName
 * @description Sets the name for an operating agreement URI
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} uri - The operating agreement URI
 * @param {string} name - The name to associate with the URI
 * @returns {Promise<TransactionResult>}
 */
export async function setOperatingAgreementName(
  contract: ethers.Contract,
  uri: string,
  name: string
): Promise<TransactionResult> {
  const tx = await contract.setOperatingAgreementName(uri, name);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function removeOperatingAgreementName
 * @description Removes the name associated with an operating agreement URI
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} uri - The URI to remove
 * @returns {Promise<TransactionResult>}
 */
export async function removeOperatingAgreementName(
  contract: ethers.Contract,
  uri: string
): Promise<TransactionResult> {
  const tx = await contract.removeOperatingAgreementName(uri);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setDeedNFT
 * @description Sets the DeedNFT contract address
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - The new DeedNFT contract address
 * @returns {Promise<TransactionResult>}
 */
export async function setDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<TransactionResult> {
  const tx = await contract.setDeedNFT(deedNFT);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function addCompatibleDeedNFT
 * @description Adds a compatible DeedNFT contract
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - The DeedNFT contract address to add
 * @returns {Promise<TransactionResult>}
 */
export async function addCompatibleDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<TransactionResult> {
  const tx = await contract.addCompatibleDeedNFT(deedNFT);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function removeCompatibleDeedNFT
 * @description Removes a compatible DeedNFT contract
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - The DeedNFT contract address to remove
 * @returns {Promise<TransactionResult>}
 */
export async function removeCompatibleDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<TransactionResult> {
  const tx = await contract.removeCompatibleDeedNFT(deedNFT);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setPrimaryDeedNFT
 * @description Sets the primary DeedNFT contract
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - The new primary DeedNFT contract address
 * @returns {Promise<TransactionResult>}
 */
export async function setPrimaryDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<TransactionResult> {
  const tx = await contract.setPrimaryDeedNFT(deedNFT);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setAssetTypeSupport
 * @description Sets the support status for an asset type
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} assetTypeId - The ID of the asset type
 * @param {boolean} isSupported - Whether the asset type is supported
 * @returns {Promise<TransactionResult>}
 */
export async function setAssetTypeSupport(
  contract: ethers.Contract,
  assetTypeId: number,
  isSupported: boolean
): Promise<TransactionResult> {
  const tx = await contract.setAssetTypeSupport(assetTypeId, isSupported);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setValidationCriteria
 * @description Sets the validation criteria for an asset type
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} assetTypeId - ID of the asset type
 * @param {string[]} requiredTraits - Array of required trait names
 * @param {string} additionalCriteria - JSON string containing additional validation criteria
 * @param {boolean} requireOperatingAgreement - Whether an operating agreement is required
 * @param {boolean} requireDefinition - Whether a definition is required
 * @returns {Promise<TransactionResult>}
 */
export async function setValidationCriteria(
  contract: ethers.Contract,
  assetTypeId: number,
  requiredTraits: string[],
  additionalCriteria: string,
  requireOperatingAgreement: boolean,
  requireDefinition: boolean
): Promise<TransactionResult> {
  const tx = await contract.setValidationCriteria(
    assetTypeId,
    requiredTraits,
    additionalCriteria,
    requireOperatingAgreement,
    requireDefinition
  );
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function validateDeed
 * @description Validates a deed NFT
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} tokenId - ID of the token to validate
 * @returns {Promise<boolean>} Whether the validation was successful
 */
export async function validateDeed(contract: IValidatorContract, tokenId: ethers.BigNumberish): Promise<boolean> {
  return await contract.validateDeed(tokenId);
}

/**
 * @function setupValidationCriteria
 * @description Sets up validation criteria for an asset type
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} assetTypeId - ID of the asset type
 * @returns {Promise<TransactionResult>}
 */
export async function setupValidationCriteria(
  contract: ethers.Contract,
  assetTypeId: number
): Promise<TransactionResult> {
  const tx = await contract.setupValidationCriteria(assetTypeId);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function operatingAgreementName
 * @description Returns the name of an operating agreement
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} uri - URI of the operating agreement
 * @returns {Promise<string>} Name of the operating agreement
 */
export async function operatingAgreementName(
  contract: ethers.Contract,
  uri: string
): Promise<string> {
  return await contract.operatingAgreementName(uri);
}

/**
 * @function supportsAssetType
 * @description Checks if an asset type is supported
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} assetTypeId - ID of the asset type
 * @returns {Promise<boolean>} Whether the asset type is supported
 */
export async function supportsAssetType(
  contract: ethers.Contract,
  assetTypeId: number
): Promise<boolean> {
  return await contract.supportsAssetType(assetTypeId);
}

/**
 * @function addWhitelistedToken
 * @description Adds a token to the whitelist
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - Address of the token to whitelist
 * @returns {Promise<TransactionResult>}
 */
export async function addWhitelistedToken(contract: ethers.Contract, token: string): Promise<TransactionResult> {
  const tx = await contract.addWhitelistedToken(token);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function removeWhitelistedToken
 * @description Removes a token from the whitelist
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - Address of the token to remove
 * @returns {Promise<TransactionResult>}
 */
export async function removeWhitelistedToken(contract: ethers.Contract, token: string): Promise<TransactionResult> {
  const tx = await contract.removeWhitelistedToken(token);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setServiceFee
 * @description Sets the service fee for a specific token
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - Address of the token
 * @param {number} serviceFee - Service fee amount in the token's smallest unit
 * @returns {Promise<TransactionResult>}
 */
export async function setServiceFee(
  contract: ethers.Contract,
  token: string,
  serviceFee: number
): Promise<TransactionResult> {
  const tx = await contract.setServiceFee(token, serviceFee);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setFundManager
 * @description Sets the FundManager contract address
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} fundManager - New FundManager contract address
 * @returns {Promise<TransactionResult>}
 */
export async function setFundManager(contract: ethers.Contract, fundManager: string): Promise<TransactionResult> {
  const tx = await contract.setFundManager(fundManager);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function withdrawServiceFees
 * @description Allows validator admins to withdraw accumulated service fees
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - Address of the token to withdraw
 * @returns {Promise<TransactionResult>}
 */
export async function withdrawServiceFees(contract: ethers.Contract, token: string): Promise<TransactionResult> {
  const tx = await contract.withdrawServiceFees(token);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function isTokenWhitelisted
 * @description Checks if a token is whitelisted
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - Address of the token
 * @returns {Promise<boolean>} Whether the token is whitelisted
 */
export async function isTokenWhitelisted(contract: ethers.Contract, token: string): Promise<boolean> {
  return await contract.isTokenWhitelisted(token);
}

/**
 * @function getServiceFee
 * @description Gets the service fee for a specific token
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - Address of the token
 * @returns {Promise<number>} Service fee amount for the token
 */
export async function getServiceFee(contract: ethers.Contract, token: string): Promise<number> {
  return await contract.getServiceFee(token);
}

/**
 * @function getValidationCriteria
 * @description Gets the validation criteria for an asset type
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} assetTypeId - ID of the asset type
 * @returns {Promise<{
 *   requiredTraits: string[],
 *   additionalCriteria: string,
 *   requireOperatingAgreement: boolean,
 *   requireDefinition: boolean
 * }>} Validation criteria for the asset type
 */
export async function getValidationCriteria(
  contract: ethers.Contract,
  assetTypeId: number
): Promise<{
  requiredTraits: string[];
  additionalCriteria: string;
  requireOperatingAgreement: boolean;
  requireDefinition: boolean;
}> {
  return await contract.getValidationCriteria(assetTypeId);
}

/**
 * @function isCompatibleDeedNFT
 * @description Checks if a DeedNFT contract is compatible
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - Address of the DeedNFT contract
 * @returns {Promise<boolean>} Whether the DeedNFT is compatible
 */
export async function isCompatibleDeedNFT(
  contract: ethers.Contract,
  deedNFT: string
): Promise<boolean> {
  return await contract.isCompatibleDeedNFT(deedNFT);
}

/**
 * @function registerOperatingAgreement
 * @description Registers an operating agreement
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} uri - URI of the operating agreement
 * @param {string} name - Name of the operating agreement
 * @returns {Promise<TransactionResult>}
 */
export async function registerOperatingAgreement(
  contract: ethers.Contract,
  uri: string,
  name: string
): Promise<TransactionResult> {
  const tx = await contract.registerOperatingAgreement(uri, name);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function validateOperatingAgreement
 * @description Validates a deed NFT's operating agreement
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} operatingAgreement - URI of the operating agreement
 * @returns {Promise<boolean>} Whether the operating agreement is valid
 */
export async function validateOperatingAgreement(
  contract: ethers.Contract,
  operatingAgreement: string
): Promise<boolean> {
  return await contract.validateOperatingAgreement(operatingAgreement);
}

/**
 * @function getRoyaltyFeePercentage
 * @description Gets the royalty fee percentage for a token
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} tokenId - ID of the token
 * @returns {Promise<number>} The royalty fee percentage in basis points
 */
export async function getRoyaltyFeePercentage(
  contract: ethers.Contract,
  tokenId: number
): Promise<number> {
  return await contract.getRoyaltyFeePercentage(tokenId);
}

/**
 * @function setRoyaltyFeePercentage
 * @description Sets the royalty fee percentage
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} percentage - The royalty fee percentage in basis points
 * @returns {Promise<TransactionResult>}
 */
export async function setRoyaltyFeePercentage(
  contract: ethers.Contract,
  percentage: number
): Promise<TransactionResult> {
  const tx = await contract.setRoyaltyFeePercentage(percentage);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getRoyaltyReceiver
 * @description Gets the royalty receiver address
 * @param {ethers.Contract} contract - The Validator contract instance
 * @returns {Promise<string>} The address that receives royalties
 */
export async function getRoyaltyReceiver(contract: ethers.Contract): Promise<string> {
  return await contract.getRoyaltyReceiver();
}

/**
 * @function setRoyaltyReceiver
 * @description Sets the royalty receiver address
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} receiver - The address that will receive royalties
 * @returns {Promise<TransactionResult>}
 */
export async function setRoyaltyReceiver(contract: ethers.Contract, receiver: string): Promise<TransactionResult> {
  const tx = await contract.setRoyaltyReceiver(receiver);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
} 