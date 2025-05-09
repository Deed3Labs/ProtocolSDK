/**
 * @file DeedNFT API
 * @description This module provides a comprehensive set of functions to interact with the DeedNFT smart contract.
 * It handles all operations related to DeedNFT tokens including minting, burning, transferring, and metadata management.
 * 
 * @module DeedNFT
 */

import { ethers } from 'ethers';
import { IDeedNFT } from '../contracts/IDeedNFT';
import { TransactionManager, TransactionResult } from '../utils/transactionManager';

/**
 * @interface TransactionLog
 * @description Represents a transaction log event from the blockchain
 */
interface TransactionLog {
  topics: string[];
}

/**
 * @function mintAsset
 * @description Mints a new DeedNFT asset with the specified parameters
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} owner - The address that will own the minted asset
 * @param {number} assetType - The type identifier for the asset
 * @param {string} ipfsDetailsHash - IPFS hash containing the asset's metadata
 * @param {string} definition - The asset's definition string
 * @param {string} configuration - The asset's configuration string
 * @param {string} validatorAddress - Address of the validator contract
 * @param {number} salt - A unique number to ensure transaction uniqueness
 * @param {TransactionManager} transactionManager - Manager for handling the transaction
 * @returns {Promise<TransactionResult>} The result of the minting transaction
 * @throws {Error} If the minting transaction fails
 */
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

/**
 * @function burnAsset
 * @description Burns (destroys) a DeedNFT asset
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token to burn
 * @param {TransactionManager} transactionManager - Manager for handling the transaction
 * @returns {Promise<TransactionResult>} The result of the burn transaction
 * @throws {Error} If the burn transaction fails
 */
export async function burnAsset(
  contract: ethers.Contract, 
  tokenId: number,
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.burnAsset(tokenId);
  return await transactionManager.sendTransaction(tx);
}

/**
 * @function burnBatchAssets
 * @description Burns multiple DeedNFT assets in a single transaction
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number[]} tokenIds - Array of token IDs to burn
 * @param {TransactionManager} transactionManager - Manager for handling the transaction
 * @returns {Promise<TransactionResult>} The result of the batch burn transaction
 * @throws {Error} If the batch burn transaction fails
 */
export async function burnBatchAssets(
  contract: ethers.Contract, 
  tokenIds: number[],
  transactionManager: TransactionManager
): Promise<TransactionResult> {
  const tx = await contract.burnBatchAssets(tokenIds);
  return await transactionManager.sendTransaction(tx);
}

/**
 * @function transferFrom
 * @description Transfers a DeedNFT from one address to another
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} from - The address to transfer from
 * @param {string} to - The address to transfer to
 * @param {number} tokenId - The ID of the token to transfer
 * @param {TransactionManager} transactionManager - Manager for handling the transaction
 * @returns {Promise<TransactionResult>} The result of the transfer transaction
 * @throws {Error} If the transfer transaction fails
 */
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

/**
 * @function safeTransferFrom
 * @description Safely transfers a DeedNFT from one address to another, with additional safety checks
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} from - The address to transfer from
 * @param {string} to - The address to transfer to
 * @param {number} tokenId - The ID of the token to transfer
 * @param {TransactionManager} transactionManager - Manager for handling the transaction
 * @returns {Promise<TransactionResult>} The result of the safe transfer transaction
 * @throws {Error} If the safe transfer transaction fails
 */
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

/**
 * @function updateMetadata
 * @description Updates the metadata for a specific DeedNFT
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token to update
 * @param {string} ipfsDetailsHash - New IPFS hash containing the updated metadata
 * @param {TransactionManager} [transactionManager] - Optional manager for handling the transaction
 * @returns {Promise<void>}
 * @throws {Error} If the metadata update fails
 */
export async function updateMetadata(
  contract: ethers.Contract,
  tokenId: number,
  ipfsDetailsHash: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.updateMetadata(tokenId, ipfsDetailsHash);
  await tx.wait();
}

/**
 * @function tokenURI
 * @description Retrieves the URI for a specific token's metadata
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string>} The token's URI
 */
export async function tokenURI(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.tokenURI(tokenId);
}

/**
 * @function updateValidationStatus
 * @description Updates the validation status of a DeedNFT
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token to update
 * @param {boolean} isValid - The new validation status
 * @param {string} validatorAddress - The address of the validator
 * @param {TransactionManager} transactionManager - Manager for handling the transaction
 * @returns {Promise<TransactionResult>} The result of the validation update transaction
 * @throws {Error} If the validation update fails
 */
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

/**
 * @function addMinter
 * @description Adds a new minter address to the contract
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} minter - The address to add as a minter
 * @param {TransactionManager} [transactionManager] - Optional manager for handling the transaction
 * @returns {Promise<void>}
 * @throws {Error} If adding the minter fails
 */
export async function addMinter(
  contract: ethers.Contract,
  minter: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.addMinter(minter);
  await tx.wait();
}

/**
 * @function removeMinter
 * @description Removes a minter address from the contract
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} minter - The address to remove as a minter
 * @param {TransactionManager} [transactionManager] - Optional manager for handling the transaction
 * @returns {Promise<void>}
 * @throws {Error} If removing the minter fails
 */
export async function removeMinter(
  contract: ethers.Contract,
  minter: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.removeMinter(minter);
  await tx.wait();
}

/**
 * @function isMinter
 * @description Checks if an address is a minter
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} minter - The address to check
 * @returns {Promise<boolean>} True if the address is a minter, false otherwise
 */
export async function isMinter(
  contract: ethers.Contract,
  minter: string
): Promise<boolean> {
  return await contract.isMinter(minter);
}

/**
 * @function addApprovedMarketplace
 * @description Adds a new approved marketplace address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} marketplace - The marketplace address to approve
 * @param {TransactionManager} [transactionManager] - Optional manager for handling the transaction
 * @returns {Promise<void>}
 * @throws {Error} If adding the marketplace fails
 */
export async function addApprovedMarketplace(
  contract: ethers.Contract,
  marketplace: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.addApprovedMarketplace(marketplace);
  await tx.wait();
}

/**
 * @function removeApprovedMarketplace
 * @description Removes an approved marketplace address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} marketplace - The marketplace address to remove
 * @param {TransactionManager} [transactionManager] - Optional manager for handling the transaction
 * @returns {Promise<void>}
 * @throws {Error} If removing the marketplace fails
 */
export async function removeApprovedMarketplace(
  contract: ethers.Contract,
  marketplace: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.removeApprovedMarketplace(marketplace);
  await tx.wait();
}

/**
 * @function isApprovedMarketplace
 * @description Checks if an address is an approved marketplace
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} marketplace - The address to check
 * @returns {Promise<boolean>} True if the address is an approved marketplace, false otherwise
 */
export async function isApprovedMarketplace(
  contract: ethers.Contract,
  marketplace: string
): Promise<boolean> {
  return await contract.isApprovedMarketplace(marketplace);
}

/**
 * @function setRoyaltyEnforcement
 * @description Sets whether royalty enforcement is enabled
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {boolean} enforce - Whether to enforce royalties
 * @param {TransactionManager} [transactionManager] - Optional manager for handling the transaction
 * @returns {Promise<void>}
 * @throws {Error} If setting royalty enforcement fails
 */
export async function setRoyaltyEnforcement(
  contract: ethers.Contract,
  enforce: boolean,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.setRoyaltyEnforcement(enforce);
  await tx.wait();
}

/**
 * @function isRoyaltyEnforced
 * @description Checks if royalty enforcement is enabled
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<boolean>} True if royalty enforcement is enabled, false otherwise
 */
export async function isRoyaltyEnforced(
  contract: ethers.Contract
): Promise<boolean> {
  return await contract.isRoyaltyEnforced();
}

/**
 * @function getTransferValidator
 * @description Gets the current transfer validator address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<string>} The address of the transfer validator
 */
export async function getTransferValidator(
  contract: ethers.Contract
): Promise<string> {
  return await contract.getTransferValidator();
}

/**
 * @function setTransferValidator
 * @description Sets a new transfer validator address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} validator - The new validator address
 * @param {TransactionManager} [transactionManager] - Optional manager for handling the transaction
 * @returns {Promise<void>}
 * @throws {Error} If setting the transfer validator fails
 */
export async function setTransferValidator(
  contract: ethers.Contract,
  validator: string,
  transactionManager?: TransactionManager
): Promise<void> {
  const tx = await contract.setTransferValidator(validator);
  await tx.wait();
}

/**
 * @function mintDeedNFT
 * @description Mints a new DeedNFT with the specified parameters
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} owner - The address that will own the minted DeedNFT
 * @param {number} assetType - The type identifier for the asset
 * @param {string} ipfsDetailsHash - IPFS hash containing the DeedNFT's metadata
 * @param {string} definition - The DeedNFT's definition string
 * @param {string} configuration - The DeedNFT's configuration string
 * @param {string} validatorContract - Address of the validator contract
 * @param {string} token - The token address
 * @param {number} salt - A unique number to ensure transaction uniqueness
 * @returns {Promise<number>} The ID of the minted DeedNFT
 * @throws {Error} If the minting transaction fails
 */
export async function mintDeedNFT(
  contract: ethers.Contract,
  owner: string,
  assetType: number,
  ipfsDetailsHash: string,
  definition: string,
  configuration: string,
  validatorContract: string,
  token: string,
  salt: number
): Promise<number> {
  const tx = await contract.mintDeedNFT(owner, assetType, ipfsDetailsHash, definition, configuration, validatorContract, token, salt);
  const receipt = await tx.wait();
  const event = receipt.logs[0] as TransactionLog;
  return Number(event.topics[3]);
}

/**
 * @function mintBatchDeedNFT
 * @description Mints multiple DeedNFTs in a single transaction
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {Array<{
 *   owner: string;
 *   assetType: number;
 *   ipfsDetailsHash: string;
 *   definition: string;
 *   configuration: string;
 *   validatorContract: string;
 *   token: string;
 *   salt: number;
 * }>} deeds - Array of DeedNFT parameters to mint
 * @returns {Promise<number[]>} Array of IDs for the minted DeedNFTs
 * @throws {Error} If the batch minting transaction fails
 */
export async function mintBatchDeedNFT(
  contract: ethers.Contract,
  deeds: Array<{
    owner: string;
    assetType: number;
    ipfsDetailsHash: string;
    definition: string;
    configuration: string;
    validatorContract: string;
    token: string;
    salt: number;
  }>
): Promise<number[]> {
  const tx = await contract.mintBatchDeedNFT(deeds);
  const receipt = await tx.wait();
  const events = receipt.logs as TransactionLog[];
  return events.map(event => Number(event.topics[3]));
} 