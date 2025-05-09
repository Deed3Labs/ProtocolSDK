/**
 * @file Validator API
 * @description This module provides functions to interact with the Validator smart contract.
 * It handles all operations related to deed validation, operating agreements, validation criteria,
 * token whitelisting, fee management, royalty management, and DeedNFT compatibility.
 * 
 * @module Validator
 */

import { ethers } from 'ethers';
import { IValidator } from '../contracts/IValidator';

/**
 * @function validateDeed
 * @description Validates a specific DeedNFT token
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} tokenId - The ID of the token to validate
 * @returns {Promise<boolean>} Whether the token is valid
 */
export async function validateDeed(contract: ethers.Contract, tokenId: number): Promise<boolean> {
  return await contract.validateDeed(tokenId);
}

/**
 * @function validateOperatingAgreement
 * @description Validates an operating agreement
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} operatingAgreement - The URI of the operating agreement to validate
 * @returns {Promise<boolean>} Whether the operating agreement is valid
 */
export async function validateOperatingAgreement(contract: ethers.Contract, operatingAgreement: string): Promise<boolean> {
  return await contract.validateOperatingAgreement(operatingAgreement);
}

/**
 * @function getValidationCriteria
 * @description Gets the validation criteria for a specific asset type
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} assetTypeId - The ID of the asset type
 * @returns {Promise<[string[], string, boolean, boolean]>} Tuple containing required traits, additional criteria, and boolean flags
 */
export async function getValidationCriteria(contract: ethers.Contract, assetTypeId: number): Promise<[string[], string, boolean, boolean]> {
  return await contract.getValidationCriteria(assetTypeId);
}

/**
 * @function setValidationCriteria
 * @description Sets the validation criteria for a specific asset type
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} assetTypeId - The ID of the asset type
 * @param {string[]} requiredTraits - Array of required trait keys
 * @param {string} additionalCriteria - Additional validation criteria
 * @param {boolean} requireOperatingAgreement - Whether an operating agreement is required
 * @param {boolean} requireDefinition - Whether a definition is required
 * @returns {Promise<void>}
 * @throws {Error} If setting the validation criteria fails
 */
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

/**
 * @function registerOperatingAgreement
 * @description Registers a new operating agreement
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} uri - The URI of the operating agreement
 * @param {string} name - The name of the operating agreement
 * @returns {Promise<void>}
 * @throws {Error} If registering the operating agreement fails
 */
export async function registerOperatingAgreement(contract: ethers.Contract, uri: string, name: string): Promise<void> {
  const tx = await contract.registerOperatingAgreement(uri, name);
  await tx.wait();
}

/**
 * @function operatingAgreementName
 * @description Gets the name of an operating agreement
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} uri - The URI of the operating agreement
 * @returns {Promise<string>} The name of the operating agreement
 */
export async function operatingAgreementName(contract: ethers.Contract, uri: string): Promise<string> {
  return await contract.operatingAgreementName(uri);
}

/**
 * @function defaultOperatingAgreement
 * @description Gets the default operating agreement URI
 * @param {ethers.Contract} contract - The Validator contract instance
 * @returns {Promise<string>} The URI of the default operating agreement
 */
export async function defaultOperatingAgreement(contract: ethers.Contract): Promise<string> {
  return await contract.defaultOperatingAgreement();
}

/**
 * @function addWhitelistedToken
 * @description Adds a token to the whitelist
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - The address of the token to whitelist
 * @returns {Promise<void>}
 * @throws {Error} If adding the token to whitelist fails
 */
export async function addWhitelistedToken(contract: ethers.Contract, token: string): Promise<void> {
  const tx = await contract.addWhitelistedToken(token);
  await tx.wait();
}

/**
 * @function removeWhitelistedToken
 * @description Removes a token from the whitelist
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - The address of the token to remove from whitelist
 * @returns {Promise<void>}
 * @throws {Error} If removing the token from whitelist fails
 */
export async function removeWhitelistedToken(contract: ethers.Contract, token: string): Promise<void> {
  const tx = await contract.removeWhitelistedToken(token);
  await tx.wait();
}

/**
 * @function isTokenWhitelisted
 * @description Checks if a token is whitelisted
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - The address of the token to check
 * @returns {Promise<boolean>} Whether the token is whitelisted
 */
export async function isTokenWhitelisted(contract: ethers.Contract, token: string): Promise<boolean> {
  return await contract.isTokenWhitelisted(token);
}

/**
 * @function getServiceFee
 * @description Gets the service fee for a specific token
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - The address of the token
 * @returns {Promise<number>} The service fee amount
 */
export async function getServiceFee(contract: ethers.Contract, token: string): Promise<number> {
  return await contract.getServiceFee(token);
}

/**
 * @function setServiceFee
 * @description Sets the service fee for a specific token
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - The address of the token
 * @param {number} fee - The service fee amount to set
 * @returns {Promise<void>}
 * @throws {Error} If setting the service fee fails
 */
export async function setServiceFee(contract: ethers.Contract, token: string, fee: number): Promise<void> {
  const tx = await contract.setServiceFee(token, fee);
  await tx.wait();
}

/**
 * @function withdrawServiceFees
 * @description Withdraws accumulated service fees for a specific token
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} token - The address of the token
 * @returns {Promise<void>}
 * @throws {Error} If withdrawing service fees fails
 */
export async function withdrawServiceFees(contract: ethers.Contract, token: string): Promise<void> {
  const tx = await contract.withdrawServiceFees(token);
  await tx.wait();
}

/**
 * @function getRoyaltyFeePercentage
 * @description Gets the royalty fee percentage for a specific token
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<number>} The royalty fee percentage
 */
export async function getRoyaltyFeePercentage(contract: ethers.Contract, tokenId: number): Promise<number> {
  return await contract.getRoyaltyFeePercentage(tokenId);
}

/**
 * @function setRoyaltyFeePercentage
 * @description Sets the royalty fee percentage
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {number} percentage - The royalty fee percentage to set
 * @returns {Promise<void>}
 * @throws {Error} If setting the royalty fee percentage fails
 */
export async function setRoyaltyFeePercentage(contract: ethers.Contract, percentage: number): Promise<void> {
  const tx = await contract.setRoyaltyFeePercentage(percentage);
  await tx.wait();
}

/**
 * @function getRoyaltyReceiver
 * @description Gets the address that receives royalty fees
 * @param {ethers.Contract} contract - The Validator contract instance
 * @returns {Promise<string>} The address of the royalty receiver
 */
export async function getRoyaltyReceiver(contract: ethers.Contract): Promise<string> {
  return await contract.getRoyaltyReceiver();
}

/**
 * @function setRoyaltyReceiver
 * @description Sets the address that receives royalty fees
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} receiver - The address of the royalty receiver
 * @returns {Promise<void>}
 * @throws {Error} If setting the royalty receiver fails
 */
export async function setRoyaltyReceiver(contract: ethers.Contract, receiver: string): Promise<void> {
  const tx = await contract.setRoyaltyReceiver(receiver);
  await tx.wait();
}

/**
 * @function setPrimaryDeedNFT
 * @description Sets the primary DeedNFT contract address
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - The address of the DeedNFT contract
 * @returns {Promise<void>}
 * @throws {Error} If setting the primary DeedNFT fails
 */
export async function setPrimaryDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.setPrimaryDeedNFT(deedNFT);
  await tx.wait();
}

/**
 * @function addCompatibleDeedNFT
 * @description Adds a compatible DeedNFT contract address
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - The address of the compatible DeedNFT contract
 * @returns {Promise<void>}
 * @throws {Error} If adding the compatible DeedNFT fails
 */
export async function addCompatibleDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.addCompatibleDeedNFT(deedNFT);
  await tx.wait();
}

/**
 * @function removeCompatibleDeedNFT
 * @description Removes a compatible DeedNFT contract address
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - The address of the compatible DeedNFT contract to remove
 * @returns {Promise<void>}
 * @throws {Error} If removing the compatible DeedNFT fails
 */
export async function removeCompatibleDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.removeCompatibleDeedNFT(deedNFT);
  await tx.wait();
}

/**
 * @function isCompatibleDeedNFT
 * @description Checks if a DeedNFT contract is compatible
 * @param {ethers.Contract} contract - The Validator contract instance
 * @param {string} deedNFT - The address of the DeedNFT contract to check
 * @returns {Promise<boolean>} Whether the DeedNFT contract is compatible
 */
export async function isCompatibleDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<boolean> {
  return await contract.isCompatibleDeedNFT(deedNFT);
} 