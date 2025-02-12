import { BaseContract } from './BaseContract';
import { AssetType } from '../types';
import { FundManagerABI } from '../abis';

export class FundManagerContract extends BaseContract {
  async mintDeedNFT(params: {
    assetType: AssetType;
    ipfsDetailsHash: string;
    operatingAgreement: string;
    definition: string;
    configuration: string;
    validatorContract: string;
    token: string;
    ipfsTokenURI: string;
  }) {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(
      signedContract.mintDeedNFT(
        params.assetType,
        params.ipfsDetailsHash,
        params.operatingAgreement,
        params.definition,
        params.configuration,
        params.validatorContract,
        params.token,
        params.ipfsTokenURI
      )
    );
  }

  async getServiceFeesBalance(token: string): Promise<ethers.BigNumber> {
    return await this.contract.getServiceFeesBalance(token);
  }
} 