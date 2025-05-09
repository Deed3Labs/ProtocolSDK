/**
 * @file FundManager API
 * @description This module provides functions to interact with the FundManager smart contract.
 * It handles operations related to DeedNFT minting, fee management, and contract configuration.
 * 
 * @module FundManager
 */

import { ethers } from 'ethers';
import { IFundManager } from '../contracts/IFundManager';

/**
 * @function mintDeedNFT
 * @description Mints a new DeedNFT through the FundManager contract
 * @param {ethers.Contract} contract - The FundManager contract instance
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
  await tx.wait();
  return tx.tokenId;
}

/**
 * @function mintBatchDeedNFT
 * @description Mints multiple DeedNFTs in a single transaction through the FundManager contract
 * @param {ethers.Contract} contract - The FundManager contract instance
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
export async function mintBatchDeedNFT(contract: ethers.Contract, deeds: any[]): Promise<number[]> {
  const tx = await contract.mintBatchDeedNFT(deeds);
  await tx.wait();
  return tx.tokenIds;
}

/**
 * @function withdrawValidatorFees
 * @description Withdraws accumulated fees for a validator contract
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} validatorContract - Address of the validator contract
 * @param {string} token - The token address to withdraw fees in
 * @returns {Promise<void>}
 * @throws {Error} If the withdrawal transaction fails
 */
export async function withdrawValidatorFees(contract: ethers.Contract, validatorContract: string, token: string): Promise<void> {
  const tx = await contract.withdrawValidatorFees(validatorContract, token);
  await tx.wait();
}

/**
 * @function getCommissionBalance
 * @description Gets the commission balance for a validator contract
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} validatorContract - Address of the validator contract
 * @param {string} token - The token address to check balance in
 * @returns {Promise<number>} The commission balance
 */
export async function getCommissionBalance(contract: ethers.Contract, validatorContract: string, token: string): Promise<number> {
  return await contract.getCommissionBalance(validatorContract, token);
}

/**
 * @function setCommissionPercentage
 * @description Sets the commission percentage for the FundManager
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {number} percentage - The new commission percentage (0-100)
 * @returns {Promise<void>}
 * @throws {Error} If setting the commission percentage fails
 */
export async function setCommissionPercentage(contract: ethers.Contract, percentage: number): Promise<void> {
  const tx = await contract.setCommissionPercentage(percentage);
  await tx.wait();
}

/**
 * @function setFeeReceiver
 * @description Sets the address that will receive collected fees
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} feeReceiver - The address to receive fees
 * @returns {Promise<void>}
 * @throws {Error} If setting the fee receiver fails
 */
export async function setFeeReceiver(contract: ethers.Contract, feeReceiver: string): Promise<void> {
  const tx = await contract.setFeeReceiver(feeReceiver);
  await tx.wait();
}

/**
 * @function setValidatorRegistry
 * @description Sets the validator registry contract address
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} validatorRegistry - The address of the validator registry contract
 * @returns {Promise<void>}
 * @throws {Error} If setting the validator registry fails
 */
export async function setValidatorRegistry(contract: ethers.Contract, validatorRegistry: string): Promise<void> {
  const tx = await contract.setValidatorRegistry(validatorRegistry);
  await tx.wait();
}

/**
 * @function setDeedNFT
 * @description Sets the DeedNFT contract address
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} deedNFT - The address of the DeedNFT contract
 * @returns {Promise<void>}
 * @throws {Error} If setting the DeedNFT contract fails
 */
export async function setDeedNFT(contract: ethers.Contract, deedNFT: string): Promise<void> {
  const tx = await contract.setDeedNFT(deedNFT);
  await tx.wait();
} 