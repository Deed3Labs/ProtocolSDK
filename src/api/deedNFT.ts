/**
 * @file DeedNFT API
 * @description This module provides functions to interact with the DeedNFT smart contract.
 * It handles all operations related to deed minting, burning, validation, and metadata management.
 * 
 * @module DeedNFT
 */

import { ethers } from 'ethers';
import { IDeedNFTContract } from '../contracts';
import { AssetType } from '../types/contracts';
import { TransactionManager, TransactionResult } from '../utils/transactionManager';

interface MintAssetResult extends TransactionResult {
  tokenId?: ethers.BigNumberish;
}

/**
 * @function setDefaultValidator
 * @description Sets the default validator address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} validator - The new default validator address
 * @returns {Promise<void>}
 */
export async function setDefaultValidator(contract: ethers.Contract, validator: string): Promise<void> {
  const tx = await contract.setDefaultValidator(validator);
  await tx.wait();
}

/**
 * @function setValidatorRegistry
 * @description Sets the validator registry address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} registry - The new validator registry address
 * @returns {Promise<void>}
 */
export async function setValidatorRegistry(contract: ethers.Contract, registry: string): Promise<void> {
  const tx = await contract.setValidatorRegistry(registry);
  await tx.wait();
}

/**
 * @function setMetadataRenderer
 * @description Sets the metadata renderer address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} renderer - The new metadata renderer address
 * @returns {Promise<void>}
 */
export async function setMetadataRenderer(contract: ethers.Contract, renderer: string): Promise<void> {
  const tx = await contract.setMetadataRenderer(renderer);
  await tx.wait();
}

/**
 * @function addMinter
 * @description Grants the MINTER_ROLE to an address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} minter - The address to grant MINTER_ROLE to
 * @returns {Promise<void>}
 */
export async function addMinter(contract: ethers.Contract, minter: string): Promise<void> {
  const tx = await contract.addMinter(minter);
  await tx.wait();
}

/**
 * @function removeMinter
 * @description Revokes the MINTER_ROLE from an address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} minter - The address to revoke MINTER_ROLE from
 * @returns {Promise<void>}
 */
export async function removeMinter(contract: ethers.Contract, minter: string): Promise<void> {
  const tx = await contract.removeMinter(minter);
  await tx.wait();
}

/**
 * @function generateUniqueTokenId
 * @description Generates a unique token ID based on input parameters
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} owner - The owner address
 * @param {AssetType} assetType - The asset type
 * @param {string} definition - The definition string
 * @param {number} salt - The salt value
 * @returns {Promise<number>} The generated token ID
 */
export async function generateUniqueTokenId(
  contract: ethers.Contract,
  owner: string,
  assetType: AssetType,
  definition: string,
  salt: number
): Promise<number> {
  return await contract.generateUniqueTokenId(owner, assetType, definition, salt);
}

/**
 * @function mintAsset
 * @description Mints a new deed with a deterministic token ID
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} owner - The owner address
 * @param {AssetType} assetType - The asset type
 * @param {string} uri - The token URI
 * @param {string} definition - The definition string
 * @param {string} configuration - The configuration string
 * @param {string} validatorAddress - The validator address
 * @param {number} salt - The salt value
 * @returns {Promise<MintAssetResult>} The transaction result containing the minted deed ID
 */
export async function mintAsset(
  contract: IDeedNFTContract,
  owner: string,
  assetType: number,
  ipfsDetailsHash: string,
  definition: string,
  configuration: string,
  validatorAddress: string,
  salt: ethers.BigNumberish
): Promise<MintAssetResult> {
  const provider = contract.runner?.provider;
  if (!provider) {
    throw new Error('Provider not found');
  }

  const transactionManager = new TransactionManager(provider);
  const tx = await contract.mintAsset(
    owner,
    assetType,
    ipfsDetailsHash,
    definition,
    configuration,
    validatorAddress,
    salt
  );

  const result = await transactionManager.sendTransaction(tx);
  const mintResult: MintAssetResult = { ...result };
  
  if (result.receipt) {
    const log = result.receipt.logs[0] as ethers.Log & { args: { tokenId: ethers.BigNumberish } };
    mintResult.tokenId = log.args.tokenId;
  }
  
  return mintResult;
}

/**
 * @function burnAsset
 * @description Burns a deed owned by the caller
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the deed to burn
 * @returns {Promise<void>}
 */
export async function burnAsset(contract: ethers.Contract, tokenId: number): Promise<void> {
  const tx = await contract.burnAsset(tokenId);
  await tx.wait();
}

/**
 * @function burnBatchAssets
 * @description Batch burns multiple deeds owned by the caller
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number[]} tokenIds - Array of deed IDs to burn
 * @returns {Promise<void>}
 */
export async function burnBatchAssets(contract: ethers.Contract, tokenIds: number[]): Promise<void> {
  const tx = await contract.burnBatchAssets(tokenIds);
  await tx.wait();
}

/**
 * @function updateValidationStatus
 * @description Updates the validation status of a token
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token to validate
 * @param {boolean} isValid - Whether the token is valid
 * @param {string} validatorAddress - The address of the validator
 * @returns {Promise<void>}
 */
export async function updateValidationStatus(
  contract: ethers.Contract,
  tokenId: number,
  isValid: boolean,
  validatorAddress: string
): Promise<void> {
  const tx = await contract.updateValidationStatus(tokenId, isValid, validatorAddress);
  await tx.wait();
}

/**
 * @function updateMetadata
 * @description Updates the metadata of a deed
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the deed
 * @param {string} uri - New token URI
 * @param {string} operatingAgreement - New operating agreement
 * @param {string} definition - New definition
 * @param {string} configuration - New configuration
 * @returns {Promise<void>}
 */
export async function updateMetadata(
  contract: ethers.Contract,
  tokenId: number,
  uri: string,
  operatingAgreement: string,
  definition: string,
  configuration: string
): Promise<void> {
  const tx = await contract.updateMetadata(
    tokenId,
    uri,
    operatingAgreement,
    definition,
    configuration
  );
  await tx.wait();
}

/**
 * @function removeTrait
 * @description Removes a trait from a token using human-readable name
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} traitName - The name of the trait to remove
 * @returns {Promise<void>}
 */
export async function removeTrait(
  contract: ethers.Contract,
  tokenId: number,
  traitName: string
): Promise<void> {
  const tx = await contract.removeTrait(tokenId, traitName);
  await tx.wait();
}

/**
 * @function setTrait
 * @description Sets a trait value with flexible input types
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @param {Uint8Array} traitKey - The key of the trait
 * @param {Uint8Array} traitValue - The value of the trait
 * @param {number} valueType - The type of the value (0=bytes, 1=string, 2=uint256, 3=bool)
 * @returns {Promise<void>}
 */
export async function setTrait(
  contract: ethers.Contract,
  tokenId: number,
  traitKey: Uint8Array,
  traitValue: Uint8Array,
  valueType: number
): Promise<void> {
  const tx = await contract.setTrait(tokenId, traitKey, traitValue, valueType);
  await tx.wait();
}

/**
 * @function getTraitValue
 * @description Gets a trait value for a token
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string} traitKey - The key of the trait
 * @returns {Promise<Uint8Array>} The value of the trait
 */
export async function getTraitValue(
  contract: ethers.Contract,
  tokenId: number,
  traitKey: string
): Promise<Uint8Array> {
  const hashedKey = ethers.keccak256(ethers.toUtf8Bytes(traitKey));
  return await contract.getTraitValue(tokenId, hashedKey);
}

/**
 * @function getTraitValues
 * @description Gets multiple trait values for a token
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @param {string[]} traitKeys - Array of trait keys
 * @returns {Promise<Uint8Array[]>} Array of trait values
 */
export async function getTraitValues(
  contract: ethers.Contract,
  tokenId: number,
  traitKeys: string[]
): Promise<Uint8Array[]> {
  const hashedKeys = traitKeys.map((key: string) => ethers.keccak256(ethers.toUtf8Bytes(key)));
  return await contract.getTraitValues(tokenId, hashedKeys);
}

/**
 * @function getTraitKeys
 * @description Gets all trait keys for a token that have values
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string[]>} Array of trait keys that have values
 */
export async function getTraitKeys(contract: ethers.Contract, tokenId: number): Promise<string[]> {
  const keys = await contract.getTraitKeys(tokenId);
  return keys.map((key: string) => {
    try {
      return ethers.decodeBytes32String(key);
    } catch {
      return key;
    }
  });
}

/**
 * @function getTraitName
 * @description Gets the name of a trait
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} traitKey - The key of the trait
 * @returns {Promise<string>} The name of the trait
 */
export async function getTraitName(
  contract: ethers.Contract,
  traitKey: string
): Promise<string> {
  const hashedKey = ethers.keccak256(ethers.toUtf8Bytes(traitKey));
  return await contract.getTraitName(hashedKey);
}

/**
 * @function getTraitMetadataURI
 * @description Gets the metadata URI for traits
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<string>} Base64-encoded JSON schema of all traits
 */
export async function getTraitMetadataURI(contract: ethers.Contract): Promise<string> {
  return await contract.getTraitMetadataURI();
}

/**
 * @function contractURI
 * @description Gets the contract URI for collection metadata
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<string>} The contract URI
 */
export async function contractURI(contract: ethers.Contract): Promise<string> {
  return await contract.contractURI();
}

/**
 * @function setContractURI
 * @description Sets the contract URI for collection metadata
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} newURI - The new contract URI
 * @returns {Promise<void>}
 */
export async function setContractURI(contract: ethers.Contract, newURI: string): Promise<void> {
  const tx = await contract.setContractURI(newURI);
  await tx.wait();
}

/**
 * @function tokenURI
 * @description Gets the metadata URI for a token
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<string>} The metadata URI for the token
 */
export async function tokenURI(contract: ethers.Contract, tokenId: number): Promise<string> {
  return await contract.tokenURI(tokenId);
}

/**
 * @function getValidationStatus
 * @description Gets the validation status of a token
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @returns {Promise<{isValidated: boolean, validator: string}>} The validation status and validator address
 */
export async function getValidationStatus(
  contract: ethers.Contract,
  tokenId: number
): Promise<{ isValidated: boolean; validator: string }> {
  return await contract.getValidationStatus(tokenId);
}

/**
 * @function royaltyInfo
 * @description Gets the royalty information for a token
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {number} tokenId - The ID of the token
 * @param {number} salePrice - The sale price of the token
 * @returns {Promise<{receiver: string, royaltyAmount: number}>} The royalty receiver and amount
 */
export async function royaltyInfo(
  contract: ethers.Contract,
  tokenId: number,
  salePrice: number
): Promise<{ receiver: string; royaltyAmount: number }> {
  return await contract.royaltyInfo(tokenId, salePrice);
}

/**
 * @function setToDefaultSecurityPolicy
 * @description Sets the contract to the default security policy for royalty enforcement
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<void>}
 */
export async function setToDefaultSecurityPolicy(contract: ethers.Contract): Promise<void> {
  const tx = await contract.setToDefaultSecurityPolicy();
  await tx.wait();
}

/**
 * @function setApprovedMarketplace
 * @description Approves a marketplace for trading
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} marketplace - The address of the marketplace
 * @param {boolean} approved - Whether the marketplace is approved
 * @returns {Promise<void>}
 */
export async function setApprovedMarketplace(
  contract: ethers.Contract,
  marketplace: string,
  approved: boolean
): Promise<void> {
  const tx = await contract.setApprovedMarketplace(marketplace, approved);
  await tx.wait();
}

/**
 * @function isApprovedMarketplace
 * @description Checks if a marketplace is approved
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} marketplace - The address of the marketplace
 * @returns {Promise<boolean>} Whether the marketplace is approved
 */
export async function isApprovedMarketplace(
  contract: ethers.Contract,
  marketplace: string
): Promise<boolean> {
  return await contract.isApprovedMarketplace(marketplace);
}

/**
 * @function setRoyaltyEnforcement
 * @description Sets whether royalties are enforced
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {boolean} enforced - Whether royalties are enforced
 * @returns {Promise<void>}
 */
export async function setRoyaltyEnforcement(
  contract: ethers.Contract,
  enforced: boolean
): Promise<void> {
  const tx = await contract.setRoyaltyEnforcement(enforced);
  await tx.wait();
}

/**
 * @function isRoyaltyEnforced
 * @description Checks if royalties are enforced
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<boolean>} Whether royalties are enforced
 */
export async function isRoyaltyEnforced(contract: ethers.Contract): Promise<boolean> {
  return await contract.isRoyaltyEnforced();
}

/**
 * @function getTransferValidator
 * @description Gets the transfer validator address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<string>} The address of the transfer validator
 */
export async function getTransferValidator(contract: ethers.Contract): Promise<string> {
  return await contract.getTransferValidator();
}

/**
 * @function setTransferValidator
 * @description Sets the transfer validator address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} validator - The address of the transfer validator
 * @returns {Promise<void>}
 */
export async function setTransferValidator(
  contract: ethers.Contract,
  validator: string
): Promise<void> {
  const tx = await contract.setTransferValidator(validator);
  await tx.wait();
}

/**
 * @function getTransferValidationFunction
 * @description Gets the function selector for the transfer validator's validation function
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<{functionSignature: string, isViewFunction: boolean}>} The function signature and whether it's a view function
 */
export async function getTransferValidationFunction(
  contract: ethers.Contract
): Promise<{ functionSignature: string; isViewFunction: boolean }> {
  return await contract.getTransferValidationFunction();
}

/**
 * @function totalSupply
 * @description Gets the total supply of tokens
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @returns {Promise<number>} The total number of active tokens
 */
export async function totalSupply(contract: ethers.Contract): Promise<number> {
  return await contract.totalSupply();
}

/**
 * @function setFundManager
 * @description Sets the FundManager address
 * @param {ethers.Contract} contract - The DeedNFT contract instance
 * @param {string} fundManager - The address of the FundManager contract
 * @returns {Promise<void>}
 */
export async function setFundManager(
  contract: ethers.Contract,
  fundManager: string
): Promise<void> {
  const tx = await contract.setFundManager(fundManager);
  await tx.wait();
} 