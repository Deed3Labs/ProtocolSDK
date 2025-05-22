/**
 * @file ValidatorRegistry API
 * @description This module provides functions to interact with the ValidatorRegistry smart contract.
 * It handles all operations related to validator registration, information retrieval, and asset type validation.
 * The registry maintains a list of validators and their associations with different asset types.
 * 
 * @module ValidatorRegistry
 */

import { ethers } from 'ethers';
import { IValidatorRegistryContract } from '../contracts';
import { TransactionManager, TransactionResult } from '../utils/transactionManager';

/**
 * @function getValidatorOwner
 * @description Gets the owner address of a validator contract
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validatorContract - The address of the validator contract
 * @returns {Promise<string>} The address of the validator owner
 */
export async function getValidatorOwner(
  contract: IValidatorRegistryContract,
  validator: string
): Promise<string> {
  return await contract.getValidatorOwner(validator);
}

/**
 * @function getValidatorInfo
 * @description Gets detailed information about a validator
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator
 * @returns {Promise<{owner: string, name: string, isActive: boolean, supportedAssetTypes: number[]}>} Object containing validator information
 */
export async function getValidatorInfo(
  contract: ethers.Contract, 
  validator: string
): Promise<{
  owner: string;
  name: string;
  isActive: boolean;
  supportedAssetTypes: number[];
}> {
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

/**
 * @function getValidatorAssetTypes
 * @description Gets the supported asset types for a validator from the validator contract
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator
 * @returns {Promise<void>}
 */
export async function getValidatorAssetTypes(contract: ethers.Contract, validator: string): Promise<void> {
  return await contract.getValidatorAssetTypes(validator);
}

/**
 * @function getSupportedAssetTypes
 * @description Gets the supported asset types for a validator
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator
 * @returns {Promise<number[]>} Array of supported asset type IDs
 */
export async function getSupportedAssetTypes(contract: ethers.Contract, validator: string): Promise<number[]> {
  return await contract.getSupportedAssetTypes(validator);
}

/**
 * @function updateValidatorName
 * @description Updates the name of a registered validator
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator
 * @param {string} newName - The new name for the validator
 * @returns {Promise<TransactionResult>}
 */
export async function updateValidatorName(
  contract: ethers.Contract,
  validator: string,
  newName: string
): Promise<TransactionResult> {
  const provider = contract.runner?.provider;
  if (!provider) {
    throw new Error('Provider not found');
  }

  const transactionManager = new TransactionManager(provider);
  const tx = await contract.updateValidatorName(validator, newName);
  return await transactionManager.sendTransaction(tx);
}

/**
 * @function updateValidatorStatus
 * @description Updates the operational status of a registered validator
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator
 * @param {boolean} isActive - The new operational status
 * @returns {Promise<TransactionResult>}
 */
export async function updateValidatorStatus(
  contract: ethers.Contract,
  validator: string,
  isActive: boolean
): Promise<TransactionResult> {
  const provider = contract.runner?.provider;
  if (!provider) {
    throw new Error('Provider not found');
  }

  const transactionManager = new TransactionManager(provider);
  const tx = await contract.updateValidatorStatus(validator, isActive);
  return await transactionManager.sendTransaction(tx);
}

/**
 * @function removeValidator
 * @description Removes a validator from the registry
 * @param {ethers.Contract} contract - The ValidatorRegistry contract instance
 * @param {string} validator - The address of the validator to remove
 * @returns {Promise<TransactionResult>}
 */
export async function removeValidator(
  contract: ethers.Contract,
  validator: string
): Promise<TransactionResult> {
  const provider = contract.runner?.provider;
  if (!provider) {
    throw new Error('Provider not found');
  }

  const transactionManager = new TransactionManager(provider);
  const tx = await contract.removeValidator(validator);
  return await transactionManager.sendTransaction(tx);
} 