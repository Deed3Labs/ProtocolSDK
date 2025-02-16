import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash,
  type TransactionReceipt
} from 'viem'
import { BaseContract } from './BaseContract';
import { ValidatorInfo, AssetType } from '../types';
import { ValidatorRegistryABI } from '../abis';

export class ValidatorRegistryContract extends BaseContract {
  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient,
    address: Address
  ) {
    super(publicClient, walletClient, address, ValidatorRegistryABI);
  }

  async registerValidator(params: {
    name: string;
    description: string;
    supportedAssetTypes: AssetType[];
    uri: string;
  }): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('registerValidator', [
      params.name,
      params.description,
      params.supportedAssetTypes,
      params.uri
    ]);
  }

  async getValidatorInfo(validator: string): Promise<ValidatorInfo> {
    return this.executeCall('getValidatorInfo', [validator]);
  }

  async updateValidatorStatus(validator: string, isActive: boolean): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('updateValidatorStatus', [validator, isActive]);
  }

  async isValidatorApproved(validator: string, assetType: AssetType): Promise<boolean> {
    return this.executeCall('isValidatorApproved', [validator, assetType]);
  }

  async getValidatorsForAssetType(assetType: AssetType): Promise<string[]> {
    return this.executeCall('getValidatorsForAssetType', [assetType]);
  }

  async validate(deedId: bigint, validatorAddress: string): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('validate', [deedId, validatorAddress]);
  }
} 