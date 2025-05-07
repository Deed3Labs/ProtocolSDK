import { ethers } from 'ethers';

/**
 * Enum representing different types of assets that can be tokenized
 */
export enum AssetType {
  /** Land or real estate property */
  Land,
  /** Vehicle or transportation asset */
  Vehicle,
  /** Estate or property asset */
  Estate,
  /** Commercial equipment or machinery */
  CommercialEquipment
}

/**
 * Interface for the DeedNFT contract, which handles the creation and management of tokenized assets
 */
export interface IDeedNFT extends ethers.BaseContract {
  /**
   * Mints a new DeedNFT token representing an asset
   * @param owner - The address that will own the token
   * @param assetType - The type of asset being tokenized
   * @param ipfsDetailsHash - IPFS hash containing asset details
   * @param definition - Asset definition document
   * @param configuration - Asset configuration details
   * @param validatorAddress - Address of the validator for this asset
   * @param salt - Random salt for token ID generation
   * @returns Promise resolving to the transaction
   */
  mintAsset(
    owner: string,
    assetType: AssetType,
    ipfsDetailsHash: string,
    definition: string,
    configuration: string,
    validatorAddress: string,
    salt: ethers.BigNumberish
  ): Promise<ethers.ContractTransaction>;

  /**
   * Burns a DeedNFT token
   * @param tokenId - ID of the token to burn
   * @returns Promise resolving to the transaction
   */
  burnAsset(tokenId: ethers.BigNumberish): Promise<ethers.ContractTransaction>;

  /**
   * Burns multiple DeedNFT tokens in a single transaction
   * @param tokenIds - Array of token IDs to burn
   * @returns Promise resolving to the transaction
   */
  burnBatchAssets(tokenIds: ethers.BigNumberish[]): Promise<ethers.ContractTransaction>;
  
  /**
   * Transfers a token from one address to another
   * @param from - Current owner's address
   * @param to - New owner's address
   * @param tokenId - ID of the token to transfer
   * @returns Promise resolving to the transaction
   */
  transferFrom(from: string, to: string, tokenId: ethers.BigNumberish): Promise<ethers.ContractTransaction>;

  /**
   * Safely transfers a token from one address to another
   * @param from - Current owner's address
   * @param to - New owner's address
   * @param tokenId - ID of the token to transfer
   * @returns Promise resolving to the transaction
   */
  safeTransferFrom(from: string, to: string, tokenId: ethers.BigNumberish): Promise<ethers.ContractTransaction>;
  
  /**
   * Updates the metadata for a token
   * @param tokenId - ID of the token
   * @param uri - New token URI
   * @param operatingAgreement - Updated operating agreement
   * @param definition - Updated asset definition
   * @param configuration - Updated asset configuration
   * @returns Promise resolving to the transaction
   */
  updateMetadata(
    tokenId: ethers.BigNumberish,
    uri: string,
    operatingAgreement: string,
    definition: string,
    configuration: string
  ): Promise<ethers.ContractTransaction>;
  
  /**
   * Gets the URI for a token's metadata
   * @param tokenId - ID of the token
   * @returns Promise resolving to the token URI
   */
  tokenURI(tokenId: ethers.BigNumberish): Promise<string>;
  
  /**
   * Updates the validation status of a token
   * @param tokenId - ID of the token
   * @param isValid - Whether the token is valid
   * @param validatorAddress - Address of the validator
   * @returns Promise resolving to the transaction
   */
  updateValidationStatus(
    tokenId: ethers.BigNumberish,
    isValid: boolean,
    validatorAddress: string
  ): Promise<ethers.ContractTransaction>;
  
  /**
   * Adds a new minter address
   * @param minter - Address to add as minter
   * @returns Promise resolving to the transaction
   */
  addMinter(minter: string): Promise<ethers.ContractTransaction>;

  /**
   * Removes a minter address
   * @param minter - Address to remove as minter
   * @returns Promise resolving to the transaction
   */
  removeMinter(minter: string): Promise<ethers.ContractTransaction>;

  /**
   * Checks if an address has a specific role
   * @param role - Role to check
   * @param account - Address to check
   * @returns Promise resolving to whether the address has the role
   */
  hasRole(role: string, account: string): Promise<boolean>;
  
  /**
   * Sets whether a marketplace is approved
   * @param marketplace - Marketplace address
   * @param approved - Whether the marketplace is approved
   * @returns Promise resolving to the transaction
   */
  setApprovedMarketplace(marketplace: string, approved: boolean): Promise<ethers.ContractTransaction>;

  /**
   * Checks if a marketplace is approved
   * @param marketplace - Marketplace address
   * @returns Promise resolving to whether the marketplace is approved
   */
  isApprovedMarketplace(marketplace: string): Promise<boolean>;
  
  /**
   * Sets whether royalty enforcement is enabled
   * @param enforced - Whether to enforce royalties
   * @returns Promise resolving to the transaction
   */
  setRoyaltyEnforcement(enforced: boolean): Promise<ethers.ContractTransaction>;

  /**
   * Checks if royalty enforcement is enabled
   * @returns Promise resolving to whether royalty enforcement is enabled
   */
  isRoyaltyEnforced(): Promise<boolean>;
  
  /**
   * Gets the current transfer validator address
   * @returns Promise resolving to the transfer validator address
   */
  getTransferValidator(): Promise<string>;

  /**
   * Sets the transfer validator address
   * @param validator - New transfer validator address
   * @returns Promise resolving to the transaction
   */
  setTransferValidator(validator: string): Promise<ethers.ContractTransaction>;

  getDeedInfo(tokenId: ethers.BigNumberish): Promise<{
    assetType: AssetType;
    isValidated: boolean;
    operatingAgreement: string;
    definition: string;
    configuration: string;
    validator: string;
  }>;
}

/**
 * Interface for the FundManager contract, which handles commission and fee management
 */
export interface IFundManager extends ethers.BaseContract {
  /**
   * Mints a new DeedNFT token through the fund manager
   * @param owner - The address that will own the token
   * @param assetType - The type of asset being tokenized
   * @param ipfsDetailsHash - IPFS hash containing asset details
   * @param definition - Asset definition document
   * @param configuration - Asset configuration details
   * @param validatorAddress - Address of the validator for this asset
   * @returns Promise resolving to the transaction
   */
  mintDeedNFT(
    owner: string,
    assetType: AssetType,
    ipfsDetailsHash: string,
    definition: string,
    configuration: string,
    validatorAddress: string
  ): Promise<ethers.ContractTransaction>;

  /**
   * Withdraws validator fees
   * @param validator - Validator address
   * @param token - Token address
   * @returns Promise resolving to the transaction
   */
  withdrawValidatorFees(validator: string, token: string): Promise<ethers.ContractTransaction>;

  /**
   * Gets the commission balance for a validator
   * @param validator - Validator address
   * @returns Promise resolving to the commission balance
   */
  getCommissionBalance(validator: string): Promise<ethers.BigNumberish>;

  /**
   * Sets the commission percentage
   * @param percentage - New commission percentage
   * @returns Promise resolving to the transaction
   */
  setCommissionPercentage(percentage: number): Promise<ethers.ContractTransaction>;

  /**
   * Sets the fee receiver address
   * @param receiver - New fee receiver address
   * @returns Promise resolving to the transaction
   */
  setFeeReceiver(receiver: string): Promise<ethers.ContractTransaction>;

  /**
   * Sets the validator registry address
   * @param registry - New validator registry address
   * @returns Promise resolving to the transaction
   */
  setValidatorRegistry(registry: string): Promise<ethers.ContractTransaction>;

  /**
   * Sets the DeedNFT contract address
   * @param deedNFT - New DeedNFT contract address
   * @returns Promise resolving to the transaction
   */
  setDeedNFT(deedNFT: string): Promise<ethers.ContractTransaction>;
}

/**
 * Interface for the Validator contract, which handles asset validation
 */
export interface IValidator extends ethers.BaseContract {
  /**
   * Validates a DeedNFT token
   * @param tokenId - ID of the token to validate
   * @returns Promise resolving to the transaction
   */
  validateDeed(tokenId: ethers.BigNumberish): Promise<ethers.ContractTransaction>;

  /**
   * Validates an operating agreement
   * @param uri - URI of the operating agreement
   * @returns Promise resolving to the transaction
   */
  validateOperatingAgreement(uri: string): Promise<ethers.ContractTransaction>;
  
  /**
   * Gets validation criteria for an asset type
   * @param assetTypeId - ID of the asset type
   * @returns Promise resolving to the validation criteria
   */
  getValidationCriteria(assetTypeId: number): Promise<{
    requiredTraits: string[];
    additionalCriteria: string;
    requireOperatingAgreement: boolean;
    requireDefinition: boolean;
  }>;
  
  /**
   * Sets validation criteria for an asset type
   * @param assetTypeId - ID of the asset type
   * @param requiredTraits - Required traits for validation
   * @param additionalCriteria - Additional validation criteria
   * @param requireOperatingAgreement - Whether operating agreement is required
   * @param requireDefinition - Whether definition is required
   * @returns Promise resolving to the transaction
   */
  setValidationCriteria(
    assetTypeId: number,
    requiredTraits: string[],
    additionalCriteria: string,
    requireOperatingAgreement: boolean,
    requireDefinition: boolean
  ): Promise<ethers.ContractTransaction>;
  
  /**
   * Registers a new operating agreement
   * @param uri - URI of the operating agreement
   * @param name - Name of the operating agreement
   * @returns Promise resolving to the transaction
   */
  registerOperatingAgreement(uri: string, name: string): Promise<ethers.ContractTransaction>;

  /**
   * Gets the default operating agreement
   * @returns Promise resolving to the default operating agreement URI
   */
  defaultOperatingAgreement(): Promise<string>;
  
  /**
   * Adds a token to the whitelist
   * @param token - Token address to add
   * @returns Promise resolving to the transaction
   */
  addWhitelistedToken(token: string): Promise<ethers.ContractTransaction>;

  /**
   * Removes a token from the whitelist
   * @param token - Token address to remove
   * @returns Promise resolving to the transaction
   */
  removeWhitelistedToken(token: string): Promise<ethers.ContractTransaction>;

  /**
   * Checks if a token is whitelisted
   * @param token - Token address to check
   * @returns Promise resolving to whether the token is whitelisted
   */
  isTokenWhitelisted(token: string): Promise<boolean>;
  
  /**
   * Gets the service fee for a token
   * @param token - Token address
   * @returns Promise resolving to the service fee
   */
  getServiceFee(token: string): Promise<ethers.BigNumberish>;

  /**
   * Sets the service fee for a token
   * @param token - Token address
   * @param fee - New service fee
   * @returns Promise resolving to the transaction
   */
  setServiceFee(token: string, fee: ethers.BigNumberish): Promise<ethers.ContractTransaction>;

  /**
   * Withdraws service fees
   * @param token - Token address
   * @returns Promise resolving to the transaction
   */
  withdrawServiceFees(token: string): Promise<ethers.ContractTransaction>;
}

/**
 * Interface for the ValidatorRegistry contract, which manages validators
 */
export interface IValidatorRegistry extends ethers.BaseContract {
  /**
   * Gets the owner of a validator
   * @param validator - Validator address
   * @returns Promise resolving to the owner address
   */
  getValidatorOwner(validator: string): Promise<string>;

  /**
   * Gets information about a validator
   * @param validator - Validator address
   * @returns Promise resolving to validator information
   */
  getValidatorInfo(validator: string): Promise<{
    owner: string;
    name: string;
    isActive: boolean;
    supportedAssetTypes: number[];
    commissionPercentage: number;
  }>;

  /**
   * Gets validators for an asset type
   * @param assetTypeId - ID of the asset type
   * @returns Promise resolving to array of validator addresses
   */
  getValidatorsForAssetType(assetTypeId: number): Promise<string[]>;

  /**
   * Checks if a validator is active
   * @param validator - Validator address
   * @returns Promise resolving to whether the validator is active
   */
  isValidatorActive(validator: string): Promise<boolean>;

  /**
   * Checks if a validator is registered
   * @param validator - Validator address
   * @returns Promise resolving to whether the validator is registered
   */
  isValidatorRegistered(validator: string): Promise<boolean>;

  /**
   * Gets the name of a validator
   * @param validator - Validator address
   * @returns Promise resolving to the validator name
   */
  getValidatorName(validator: string): Promise<string>;
}

/**
 * Interface for the MetadataRenderer contract, which handles token metadata
 */
export interface IMetadataRenderer extends ethers.BaseContract {
  /**
   * Gets the URI for a token's metadata
   * @param tokenId - ID of the token
   * @returns Promise resolving to the token URI
   */
  tokenURI(tokenId: ethers.BigNumberish): Promise<string>;

  /**
   * Syncs trait updates for a token
   * @param tokenId - ID of the token
   * @returns Promise resolving to the transaction
   */
  syncTraitUpdate(tokenId: ethers.BigNumberish): Promise<ethers.ContractTransaction>;

  /**
   * Sets custom metadata for a token
   * @param tokenId - ID of the token
   * @param metadata - Custom metadata
   * @returns Promise resolving to the transaction
   */
  setTokenCustomMetadata(tokenId: ethers.BigNumberish, metadata: string): Promise<ethers.ContractTransaction>;

  /**
   * Sets features for a token
   * @param tokenId - ID of the token
   * @param features - Array of features
   * @returns Promise resolving to the transaction
   */
  setTokenFeatures(tokenId: ethers.BigNumberish, features: string[]): Promise<ethers.ContractTransaction>;

  /**
   * Gets features for a token
   * @param tokenId - ID of the token
   * @returns Promise resolving to array of features
   */
  getTokenFeatures(tokenId: ethers.BigNumberish): Promise<string[]>;

  /**
   * Sets asset condition information
   * @param tokenId - ID of the token
   * @param condition - Asset condition
   * @param lastInspectionDate - Last inspection date
   * @param knownIssues - Known issues
   * @param improvements - Improvements made
   * @param additionalNotes - Additional notes
   * @returns Promise resolving to the transaction
   */
  setAssetCondition(
    tokenId: ethers.BigNumberish,
    condition: string,
    lastInspectionDate: string,
    knownIssues: string,
    improvements: string,
    additionalNotes: string
  ): Promise<ethers.ContractTransaction>;

  /**
   * Gets asset condition information
   * @param tokenId - ID of the token
   * @returns Promise resolving to asset condition information
   */
  getAssetCondition(tokenId: ethers.BigNumberish): Promise<{
    condition: string;
    lastInspectionDate: string;
    knownIssues: string;
    improvements: string;
    additionalNotes: string;
  }>;

  /**
   * Sets legal information for a token
   * @param tokenId - ID of the token
   * @param jurisdiction - Legal jurisdiction
   * @param registrationNumber - Registration number
   * @param registrationDate - Registration date
   * @param documents - Array of document references
   * @param restrictions - Array of restrictions
   * @param additionalInfo - Additional legal information
   * @returns Promise resolving to the transaction
   */
  setTokenLegalInfo(
    tokenId: ethers.BigNumberish,
    jurisdiction: string,
    registrationNumber: string,
    registrationDate: string,
    documents: string[],
    restrictions: string[],
    additionalInfo: string
  ): Promise<ethers.ContractTransaction>;

  /**
   * Gets legal information for a token
   * @param tokenId - ID of the token
   * @returns Promise resolving to legal information
   */
  getTokenLegalInfo(tokenId: ethers.BigNumberish): Promise<{
    jurisdiction: string;
    registrationNumber: string;
    registrationDate: string;
    documents: string[];
    restrictions: string[];
    additionalInfo: string;
  }>;
} 