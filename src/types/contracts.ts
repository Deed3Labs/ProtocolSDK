import { type Hash, type TransactionReceipt, type Address } from 'viem'
import { AssetType, FractionAssetType, ValidatorInfo, FractionInfo } from './index'

export interface IDeedNFTContract {
  mintAsset(
    owner: Address,
    assetType: AssetType,
    ipfsDetailsHash: string,
    operatingAgreement: string,
    definition: string,
    configuration: string
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
  
  totalSupply(): Promise<bigint>
  
  getDeedInfo(tokenId: bigint): Promise<[
    AssetType,
    boolean,
    string,
    string,
    string,
    string
  ]>
  
  canSubdivide(tokenId: bigint): Promise<boolean>
  ownerOf(tokenId: bigint): Promise<Address>
  approve(to: Address, tokenId: bigint): Promise<{ hash: Hash }>
  getApproved(tokenId: bigint): Promise<Address>
  transferFrom(from: Address, to: Address, tokenId: bigint): Promise<{ hash: Hash }>
}

export interface ISubdivide {
  createSubdivision(
    deedId: bigint,
    name: string,
    description: string,
    symbol: string,
    collectionUri: string,
    totalUnits: number,
    burnable: boolean
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
  
  batchMintUnits(
    deedId: bigint, 
    unitIds: bigint[], 
    recipients: Address[]
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
}

export interface IValidator {
  tokenURI(tokenId: bigint): Promise<string>
  defaultOperatingAgreement(): Promise<string>
  operatingAgreementName(uri: string): Promise<string>
  supportsAssetType(assetTypeId: bigint): Promise<boolean>
  validateDeed(deedId: bigint): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
}

export interface IValidatorRegistry {
  registerValidator(
    name: string,
    description: string,
    supportedAssetTypes: AssetType[],
    uri: string
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
  
  getValidatorInfo(validator: Address): Promise<ValidatorInfo>
  updateValidatorStatus(validator: Address, isActive: boolean): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
  isValidatorApproved(validator: Address, assetType: AssetType): Promise<boolean>
  getValidatorsForAssetType(assetType: AssetType): Promise<Address[]>
}

export interface IFractionalize {
  createFraction(
    assetType: FractionAssetType,
    tokenId: bigint,
    name: string,
    symbol: string,
    description: string,
    totalShares: bigint,
    maxSharesPerWallet: bigint
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
  
  getFractionInfo(fractionId: bigint): Promise<FractionInfo>
  canReceiveShares(fractionId: bigint, account: Address): Promise<boolean>
  getVotingPower(fractionId: bigint, account: Address): Promise<bigint>
}

export interface IFundManager {
  mintDeedNFT(
    owner: Address,
    assetType: AssetType,
    ipfsDetailsHash: string,
    operatingAgreement: string,
    definition: string,
    configuration: string
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
  
  getServiceFeesBalance(token: Address): Promise<bigint>
  withdrawServiceFees(token: Address): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>
}

// Add other contract interfaces... 