import { BaseContract } from './BaseContract';
import { ValidatorInfo, AssetType } from '../types';
import { ValidatorRegistryABI } from '../abis';

export class ValidatorRegistryContract extends BaseContract {
  async registerValidator(params: {
    name: string;
    description: string;
    supportedAssetTypes: AssetType[];
    uri: string;
  }) {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(
      signedContract.registerValidator(
        params.name,
        params.description,
        params.supportedAssetTypes,
        params.uri
      )
    );
  }

  async getValidatorInfo(validator: string): Promise<ValidatorInfo> {
    return await this.contract.getValidatorInfo(validator);
  }

  async updateValidatorStatus(validator: string, isActive: boolean) {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(
      signedContract.updateValidatorStatus(validator, isActive)
    );
  }

  async isValidatorApproved(validator: string, assetType: AssetType): Promise<boolean> {
    return await this.contract.isValidatorApproved(validator, assetType);
  }

  async getValidatorsForAssetType(assetType: AssetType): Promise<string[]> {
    return await this.contract.getValidatorsForAssetType(assetType);
  }
} 