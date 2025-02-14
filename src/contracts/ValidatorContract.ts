import { BaseContract } from './BaseContract';
import { IValidator } from '../types/contracts';
import { ValidatorABI } from '../abis';

export class ValidatorContract extends BaseContract implements IValidator {
  async tokenURI(tokenId: number): Promise<string> {
    const signedContract = await this.getSignedContract();
    return await signedContract.tokenURI(tokenId);
  }

  async defaultOperatingAgreement(): Promise<string> {
    const signedContract = await this.getSignedContract();
    return await signedContract.defaultOperatingAgreement();
  }

  async operatingAgreementName(uri: string): Promise<string> {
    return await this.contract.operatingAgreementName(uri);
  }

  async supportsAssetType(assetTypeId: number): Promise<boolean> {
    return await this.contract.supportsAssetType(assetTypeId);
  }

  async validateDeed(deedId: number): Promise<boolean> {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(signedContract.validateDeed(deedId));
  }
} 