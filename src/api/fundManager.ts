/**
 * @file FundManager API
 * @description This module provides functions to interact with the FundManager smart contract.
 * It handles all operations related to commission management, fee collection, and deed minting.
 * 
 * @module FundManager
 */

import { ethers } from 'ethers';
import { IFundManagerContract } from '../contracts';
import { AssetType } from '../types/contracts';
import { TransactionManager, TransactionResult } from '../utils/transactionManager';

/**
 * @function getCommissionPercentage
 * @description Gets the commission percentage
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @returns {Promise<number>} The commission percentage in basis points
 */
export async function getCommissionPercentage(contract: ethers.Contract): Promise<number> {
  return await contract.getCommissionPercentage();
}

/**
 * @function commissionPercentage
 * @description Gets the commission percentage (alias for getCommissionPercentage)
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @returns {Promise<number>} The commission percentage in basis points
 */
export async function commissionPercentage(contract: ethers.Contract): Promise<number> {
  return await contract.commissionPercentage();
}

/**
 * @function deedNFT
 * @description Gets the DeedNFT contract address
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @returns {Promise<string>} The DeedNFT contract address
 */
export async function deedNFT(contract: ethers.Contract): Promise<string> {
  return await contract.deedNFT();
}

/**
 * @function formatFee
 * @description Formats a fee amount
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {number} amount - The amount to format
 * @returns {Promise<string>} The formatted fee as a string
 */
export async function formatFee(contract: ethers.Contract, amount: number): Promise<string> {
  return await contract.formatFee(amount);
}

/**
 * @function collectCommission
 * @description Collects commission from a service fee
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {number} tokenId - The ID of the token
 * @param {number} amount - The amount of the service fee
 * @param {string} token - The token address
 * @returns {Promise<TransactionResult>}
 */
export async function collectCommission(
  contract: ethers.Contract,
  tokenId: number,
  amount: number,
  token: string
): Promise<TransactionResult> {
  const tx = await contract.collectCommission(tokenId, amount, token);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function mintDeedNFT
 * @description Mints a new deed NFT
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} owner - Address of the owner
 * @param {AssetType} assetType - Type of asset
 * @param {string} ipfsDetailsHash - IPFS hash of details
 * @param {string} definition - Definition of the deed
 * @param {string} configuration - Configuration of the deed
 * @param {string} validatorContract - Address of the validator contract
 * @param {string} token - Address of the token
 * @param {number} salt - Optional value used to generate a unique token ID
 * @returns {Promise<TransactionResult>}
 */
export async function mintDeedNFT(
  contract: IFundManagerContract,
  owner: string,
  assetType: AssetType,
  ipfsDetailsHash: string,
  definition: string,
  configuration: string,
  validatorContract: string,
  token: string,
  salt: ethers.BigNumberish
): Promise<TransactionResult> {
  const tx = await contract.mintDeedNFT(
    owner,
    assetType,
    ipfsDetailsHash,
    definition,
    configuration,
    validatorContract,
    token,
    salt
  );
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function mintBatchDeedNFT
 * @description Mints multiple deed NFTs in a batch
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {Array<{
 *   owner: string,
 *   assetType: AssetType,
 *   ipfsDetailsHash: string,
 *   definition: string,
 *   configuration: string,
 *   validatorContract: string,
 *   token: string,
 *   salt: number
 * }>} deeds - Array of deed minting data
 * @returns {Promise<TransactionResult>}
 */
export async function mintBatchDeedNFT(
  contract: ethers.Contract,
  deeds: Array<{
    owner: string;
    assetType: AssetType;
    ipfsDetailsHash: string;
    definition: string;
    configuration: string;
    validatorContract: string;
    token: string;
    salt: number
  }>
): Promise<TransactionResult> {
  const tx = await contract.mintBatchDeedNFT(deeds);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function getCommissionBalance
 * @description Gets the commission balance for a validator and token
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} validator - Address of the validator
 * @param {string} token - Address of the token
 * @returns {Promise<number>} The commission balance
 */
export async function getCommissionBalance(
  contract: ethers.Contract,
  validator: string,
  token: string
): Promise<number> {
  return await contract.getCommissionBalance(validator, token);
}

/**
 * @function withdrawValidatorFees
 * @description Allows validator admins to withdraw their accumulated fees
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} validatorContract - Address of the validator contract
 * @param {string} token - Address of the token to withdraw
 * @returns {Promise<TransactionResult>}
 */
export async function withdrawValidatorFees(
  contract: ethers.Contract,
  validatorContract: string,
  token: string
): Promise<TransactionResult> {
  const tx = await contract.withdrawValidatorFees(validatorContract, token);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setCommissionPercentage
 * @description Sets the commission percentage for the FundManager
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {number} percentage - The new commission percentage (0-100)
 * @returns {Promise<TransactionResult>}
 * @throws {Error} If setting the commission percentage fails
 */
export async function setCommissionPercentage(
  contract: ethers.Contract,
  percentage: number
): Promise<TransactionResult> {
  const tx = await contract.setCommissionPercentage(percentage);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setFeeReceiver
 * @description Sets the address that will receive collected fees
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} feeReceiver - The address to receive fees
 * @returns {Promise<TransactionResult>}
 * @throws {Error} If setting the fee receiver fails
 */
export async function setFeeReceiver(
  contract: ethers.Contract,
  feeReceiver: string
): Promise<TransactionResult> {
  const tx = await contract.setFeeReceiver(feeReceiver);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setValidatorRegistry
 * @description Sets the validator registry contract address
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} validatorRegistry - The address of the validator registry contract
 * @returns {Promise<TransactionResult>}
 * @throws {Error} If setting the validator registry fails
 */
export async function setValidatorRegistry(
  contract: ethers.Contract,
  validatorRegistry: string
): Promise<TransactionResult> {
  const tx = await contract.setValidatorRegistry(validatorRegistry);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
}

/**
 * @function setDeedNFT
 * @description Sets the DeedNFT contract address
 * @param {ethers.Contract} contract - The FundManager contract instance
 * @param {string} deedNFT - The address of the DeedNFT contract
 * @returns {Promise<TransactionResult>}
 * @throws {Error} If setting the DeedNFT contract fails
 */
export async function setDeedNFT(
  contract: ethers.Contract,
  deedNFT: string
): Promise<TransactionResult> {
  const tx = await contract.setDeedNFT(deedNFT);
  const manager = new TransactionManager(contract.runner?.provider!);
  return await manager.sendTransaction(tx);
} 