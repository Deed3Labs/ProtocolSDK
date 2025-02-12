import { ethers } from 'ethers';
import { AssetType, FractionAssetType, ValidatorInfo } from './index';

export interface DeedNFTContract extends ethers.Contract {
  mintAsset(
    owner: string,
    assetType: AssetType,
    ipfsDetailsHash: string,
    operatingAgreement: string,
    definition: string,
    configuration: string
  ): Promise<ethers.ContractTransaction>;
  
  getDeedInfo(tokenId: number): Promise<[
    AssetType,
    boolean,
    string,
    string,
    string,
    string
  ]>;
  
  canSubdivide(tokenId: number): Promise<boolean>;
  ownerOf(tokenId: number): Promise<string>;
}

export interface ISubdivide extends ethers.Contract {
  createSubdivision(
    deedId: number,
    name: string,
    description: string,
    symbol: string,
    collectionUri: string,
    totalUnits: number,
    burnable: boolean
  ): Promise<ethers.ContractTransaction>;
  
  batchMintUnits(
    deedId: number, 
    unitIds: number[], 
    recipients: string[]
  ): Promise<ethers.ContractTransaction>;
}

export interface IValidator extends ethers.Contract {
  tokenURI(tokenId: number): Promise<string>;
  defaultOperatingAgreement(): Promise<string>;
  operatingAgreementName(uri: string): Promise<string>;
  supportsAssetType(assetTypeId: number): Promise<boolean>;
  validateDeed(deedId: number): Promise<boolean>;
}

export interface IValidatorRegistry extends ethers.Contract {
  getValidatorOwner(validatorContract: string): Promise<string>;
  getValidatorInfo(validator: string): Promise<ValidatorInfo>;
  getValidatorsForAssetType(assetTypeId: number): Promise<string[]>;
  isValidatorActive(validator: string): Promise<boolean>;
}

export interface IFractionalize extends ethers.Contract {
  createFraction(
    assetType: FractionAssetType,
    tokenId: number,
    name: string,
    symbol: string,
    description: string,
    totalShares: number,
    maxSharesPerWallet: number
  ): Promise<ethers.ContractTransaction>;
  
  getFractionInfo(fractionId: number): Promise<FractionInfo>;
  canReceiveShares(fractionId: number, account: string): Promise<boolean>;
  getVotingPower(fractionId: number, account: string): Promise<number>;
}

export interface ValidatorRegistryContract extends ethers.Contract {
  registerValidator(
    name: string,
    description: string,
    supportedAssetTypes: number[],
    uri: string
  ): Promise<ethers.ContractTransaction>;
  
  getValidatorInfo(validator: string): Promise<ValidatorInfo>;
  isValidatorActive(validator: string): Promise<boolean>;
}

export interface FundManagerContract extends ethers.Contract {
  mintDeedNFT(
    owner: string,
    assetType: number,
    ipfsDetailsHash: string,
    operatingAgreement: string,
    definition: string,
    configuration: string
  ): Promise<ethers.ContractTransaction>;
  
  getServiceFeesBalance(token: string): Promise<ethers.BigNumber>;
  withdrawServiceFees(token: string): Promise<ethers.ContractTransaction>;
}

// Add other contract interfaces... 