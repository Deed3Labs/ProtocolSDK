// From DeedNFT.sol
export enum AssetType {
  Land,
  Vehicle,
  Estate,
  CommercialEquipment
}

// From Fractionalize.sol
export enum FractionAssetType {
  DeedNFT,
  SubdivisionNFT
}

export interface DeedInfo {
  assetType: AssetType;
  isValidated: boolean;
  operatingAgreement: string;
  definition: string;
  configuration: string;
  validator: string;
}

// From Subdivide.sol lines 84-95
export interface SubdivisionInfo {
  name: string;
  description: string;
  symbol: string;
  collectionUri: string;
  totalUnits: number;
  activeUnits: number;
  isActive: boolean;
  burnable: boolean;
  collectionAdmin: string;
}

// From Fractionalize.sol lines 95-112
export interface FractionInfo {
  name: string;
  description: string;
  symbol: string;
  collectionUri: string;
  totalShares: number;
  activeShares: number;
  maxSharesPerWallet: number;
  requiredApprovalPercentage: number;
  isActive: boolean;
  burnable: boolean;
  assetType: FractionAssetType;
  originalTokenId: number;
  collectionAdmin: string;
}

// Add ValidatorInfo type from IValidatorRegistry.sol
export interface ValidatorInfo {
  isActive: boolean;
  supportedAssetTypes: number[];
  name: string;
  description: string;
}

// From IValidator.sol
export interface IValidator {
  tokenURI(tokenId: number): Promise<string>;
  defaultOperatingAgreement(): Promise<string>;
  operatingAgreementName(uri: string): Promise<string>;
  supportsAssetType(assetTypeId: number): Promise<boolean>;
  validateDeed(deedId: number): Promise<boolean>;
}

// From IValidatorRegistry.sol
export interface IValidatorRegistry {
  getValidatorOwner(validatorContract: string): Promise<string>;
  getValidatorInfo(validator: string): Promise<ValidatorInfo>;
  getValidatorsForAssetType(assetTypeId: number): Promise<string[]>;
  isValidatorActive(validator: string): Promise<boolean>;
}

// Add missing exports
export * from './config';
export * from './transactions';
export * from './events';
export * from './errors';

// Add missing interfaces for contract events
export interface SubdivideEvents {
  SubdivisionCreated: (deedId: number, name: string, totalUnits: number) => void;
  UnitMinted: (deedId: number, unitId: number, to: string) => void;
  SubdivisionDeactivated: (deedId: number) => void;
  CollectionAdminTransferred: (deedId: number, previousAdmin: string, newAdmin: string) => void;
}

export interface FractionalizeEvents {
  FractionCreated: (fractionId: number, assetType: number, originalTokenId: number) => void;
  SharesTransferred: (fractionId: number, from: string, to: string, amount: number) => void;
  UnlockApproved: (fractionId: number, approver: string) => void;
  AssetUnlocked: (fractionId: number, assetType: FractionAssetType, originalTokenId: number) => void;
}

// SDK Configuration types
export type { SDKConfig } from './sdk'
export type { BaseConfig } from './BaseConfig'
export type { TransactionEventCallbacks } from './transactions'
export type { ContractAddresses } from './config'

// Re-export all other types
export * from './config'
