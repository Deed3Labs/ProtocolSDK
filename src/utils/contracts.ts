import { ethers } from 'ethers';
import { IDeedNFT, IFundManager, IValidator, IValidatorRegistry, IMetadataRenderer } from '../types/contracts';
import { AssetType } from '../types/contracts';

/**
 * Utility functions for working with the DeedNFT contract
 */
export const deedNFTUtils = {
  /**
   * Mints a new DeedNFT token with all required metadata
   * @param contract - The DeedNFT contract instance
   * @param owner - The address that will own the token
   * @param assetType - The type of asset being tokenized
   * @param ipfsDetailsHash - IPFS hash containing asset details
   * @param definition - Asset definition document
   * @param configuration - Asset configuration details
   * @param validatorAddress - Address of the validator for this asset
   * @param salt - Random salt for token ID generation
   * @returns Promise resolving to the transaction
   */
  async mintAsset(
    contract: IDeedNFT,
    owner: string,
    assetType: AssetType,
    ipfsDetailsHash: string,
    definition: string,
    configuration: string,
    validatorAddress: string,
    salt: ethers.BigNumberish
  ): Promise<ethers.ContractTransaction> {
    return contract.mintAsset(
      owner,
      assetType,
      ipfsDetailsHash,
      definition,
      configuration,
      validatorAddress,
      salt
    );
  },

  /**
   * Transfers a token
   * @param contract - The DeedNFT contract instance
   * @param from - Current owner's address
   * @param to - New owner's address
   * @param tokenId - ID of the token to transfer
   * @returns Promise resolving to the transaction
   */
  async transferFrom(
    contract: IDeedNFT,
    from: string,
    to: string,
    tokenId: ethers.BigNumberish
  ): Promise<ethers.ContractTransaction> {
    return contract.transferFrom(from, to, tokenId);
  },

  /**
   * Safely transfers a token
   * @param contract - The DeedNFT contract instance
   * @param from - Current owner's address
   * @param to - New owner's address
   * @param tokenId - ID of the token to transfer
   * @returns Promise resolving to the transaction
   */
  async safeTransferFrom(
    contract: IDeedNFT,
    from: string,
    to: string,
    tokenId: ethers.BigNumberish
  ): Promise<ethers.ContractTransaction> {
    return contract.safeTransferFrom(from, to, tokenId);
  }
};

/**
 * Utility functions for working with the FundManager contract
 */
export const fundManagerUtils = {
  /**
   * Mints a new DeedNFT token through the fund manager
   * @param contract - The FundManager contract instance
   * @param owner - The address that will own the token
   * @param assetType - The type of asset being tokenized
   * @param ipfsDetailsHash - IPFS hash containing asset details
   * @param definition - Asset definition document
   * @param configuration - Asset configuration details
   * @param validatorAddress - Address of the validator for this asset
   * @returns Promise resolving to the transaction
   */
  async mintDeedNFT(
    contract: IFundManager,
    owner: string,
    assetType: AssetType,
    ipfsDetailsHash: string,
    definition: string,
    configuration: string,
    validatorAddress: string
  ): Promise<ethers.ContractTransaction> {
    return contract.mintDeedNFT(
      owner,
      assetType,
      ipfsDetailsHash,
      definition,
      configuration,
      validatorAddress
    );
  },

  /**
   * Withdraws validator fees
   * @param contract - The FundManager contract instance
   * @param validator - Validator address
   * @param token - Token address
   * @returns Promise resolving to the transaction
   */
  async withdrawValidatorFees(
    contract: IFundManager,
    validator: string,
    token: string
  ): Promise<ethers.ContractTransaction> {
    return contract.withdrawValidatorFees(validator, token);
  }
};

/**
 * Utility functions for working with the Validator contract
 */
export const validatorUtils = {
  /**
   * Validates a DeedNFT token
   * @param contract - The Validator contract instance
   * @param tokenId - ID of the token to validate
   * @returns Promise resolving to the transaction
   */
  async validateDeed(
    contract: IValidator,
    tokenId: ethers.BigNumberish
  ): Promise<ethers.ContractTransaction> {
    return contract.validateDeed(tokenId);
  },

  /**
   * Validates an operating agreement
   * @param contract - The Validator contract instance
   * @param uri - URI of the operating agreement
   * @returns Promise resolving to the transaction
   */
  async validateOperatingAgreement(
    contract: IValidator,
    uri: string
  ): Promise<ethers.ContractTransaction> {
    return contract.validateOperatingAgreement(uri);
  },

  /**
   * Sets validation criteria
   * @param contract - The Validator contract instance
   * @param assetTypeId - ID of the asset type
   * @param requiredTraits - Required traits for validation
   * @param additionalCriteria - Additional validation criteria
   * @param requireOperatingAgreement - Whether operating agreement is required
   * @param requireDefinition - Whether definition is required
   * @returns Promise resolving to the transaction
   */
  async setValidationCriteria(
    contract: IValidator,
    assetTypeId: number,
    requiredTraits: string[],
    additionalCriteria: string,
    requireOperatingAgreement: boolean,
    requireDefinition: boolean
  ): Promise<ethers.ContractTransaction> {
    return contract.setValidationCriteria(
      assetTypeId,
      requiredTraits,
      additionalCriteria,
      requireOperatingAgreement,
      requireDefinition
    );
  }
};

/**
 * Utility functions for working with the ValidatorRegistry contract
 */
export const validatorRegistryUtils = {
  /**
   * Gets information about a validator
   * @param contract - The ValidatorRegistry contract instance
   * @param validator - Validator address
   * @returns Promise resolving to validator information
   */
  async getValidatorInfo(
    contract: IValidatorRegistry,
    validator: string
  ): Promise<{
    owner: string;
    name: string;
    isActive: boolean;
    supportedAssetTypes: number[];
    commissionPercentage: number;
  }> {
    return contract.getValidatorInfo(validator);
  },

  /**
   * Gets validators for an asset type
   * @param contract - The ValidatorRegistry contract instance
   * @param assetTypeId - ID of the asset type
   * @returns Promise resolving to array of validator addresses
   */
  async getValidatorsForAssetType(
    contract: IValidatorRegistry,
    assetTypeId: number
  ): Promise<string[]> {
    return contract.getValidatorsForAssetType(assetTypeId);
  }
};

/**
 * Utility functions for working with the MetadataRenderer contract
 */
export const metadataRendererUtils = {
  /**
   * Sets asset condition information
   * @param contract - The MetadataRenderer contract instance
   * @param tokenId - ID of the token
   * @param condition - Asset condition
   * @param lastInspectionDate - Last inspection date
   * @param knownIssues - Known issues
   * @param improvements - Improvements made
   * @param additionalNotes - Additional notes
   * @returns Promise resolving to the transaction
   */
  async setAssetCondition(
    contract: IMetadataRenderer,
    tokenId: ethers.BigNumberish,
    condition: string,
    lastInspectionDate: string,
    knownIssues: string,
    improvements: string,
    additionalNotes: string
  ): Promise<ethers.ContractTransaction> {
    const tx = await contract.setAssetCondition(
      tokenId,
      condition,
      lastInspectionDate,
      knownIssues,
      improvements,
      additionalNotes
    );
    return tx;
  },

  /**
   * Sets legal information for a token
   * @param contract - The MetadataRenderer contract instance
   * @param tokenId - ID of the token
   * @param jurisdiction - Legal jurisdiction
   * @param registrationNumber - Registration number
   * @param registrationDate - Registration date
   * @param documents - Array of document references
   * @param restrictions - Array of restrictions
   * @param additionalInfo - Additional legal information
   * @returns Promise resolving to the transaction
   */
  async setTokenLegalInfo(
    contract: IMetadataRenderer,
    tokenId: ethers.BigNumberish,
    jurisdiction: string,
    registrationNumber: string,
    registrationDate: string,
    documents: string[],
    restrictions: string[],
    additionalInfo: string
  ): Promise<ethers.ContractTransaction> {
    const tx = await contract.setTokenLegalInfo(
      tokenId,
      jurisdiction,
      registrationNumber,
      registrationDate,
      documents,
      restrictions,
      additionalInfo
    );
    return tx;
  }
}; 