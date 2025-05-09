/**
 * @file ValidatorRegistry API
 * @description This module provides functions to interact with the ValidatorRegistry smart contract.
 * It handles all operations related to validator registration, information retrieval, and asset type validation.
 * The registry maintains a list of validators and their associations with different asset types.
 * 
 * @module ValidatorRegistry
 */

import { ethers } from 'ethers';
import { IValidatorRegistry } from '../contracts/IValidatorRegistry';

/**
 * @function getValidatorOwner
 * @description Gets the owner address of a validator contract
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validatorContract - The address of the validator contract
 * @returns {Promise<string>} The address of the validator owner
 */
export async function getValidatorOwner(contract: ethers.Contract, validatorContract: string): Promise<string> {
  return await contract.getValidatorOwner(validatorContract);
}

/**
 * @function getValidatorInfo
 * @description Gets detailed information about a validator
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator
 * @returns {Promise<any>} Object containing validator information
 */
export async function getValidatorInfo(contract: ethers.Contract, validator: string): Promise<any> {
  return await contract.getValidatorInfo(validator);
}

/**
 * @function getValidatorsForAssetType
 * @description Gets all validators registered for a specific asset type
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {number} assetTypeId - The ID of the asset type
 * @returns {Promise<string[]>} Array of validator addresses
 */
export async function getValidatorsForAssetType(contract: ethers.Contract, assetTypeId: number): Promise<string[]> {
  return await contract.getValidatorsForAssetType(assetTypeId);
}

/**
 * @function isValidatorActive
 * @description Checks if a validator is currently active
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator to check
 * @returns {Promise<boolean>} Whether the validator is active
 */
export async function isValidatorActive(contract: ethers.Contract, validator: string): Promise<boolean> {
  return await contract.isValidatorActive(validator);
}

/**
 * @function isValidatorRegistered
 * @description Checks if a validator is registered in the registry
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator to check
 * @returns {Promise<boolean>} Whether the validator is registered
 */
export async function isValidatorRegistered(contract: ethers.Contract, validator: string): Promise<boolean> {
  return await contract.isValidatorRegistered(validator);
}

/**
 * @function getValidatorName
 * @description Gets the name of a validator
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator
 * @returns {Promise<string>} The name of the validator
 */
export async function getValidatorName(contract: ethers.Contract, validator: string): Promise<string> {
  return await contract.getValidatorName(validator);
} 