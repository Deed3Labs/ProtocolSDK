import { BaseContract } from './BaseContract';
import { FractionInfo, FractionAssetType } from '../types';
import { FractionalizeABI } from '../abis';

export class FractionalizeContract extends BaseContract {
  async createFraction(params: {
    assetType: FractionAssetType;
    tokenId: number;
    name: string;
    symbol: string;
    description: string;
    totalShares: number;
    maxSharesPerWallet: number;
  }) {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(
      signedContract.createFraction(
        params.assetType,
        params.tokenId,
        params.name,
        params.symbol,
        params.description,
        params.totalShares,
        params.maxSharesPerWallet
      )
    );
  }

  async getFractionInfo(fractionId: number): Promise<FractionInfo> {
    return await this.contract.getFractionInfo(fractionId);
  }

  async transferShares(fractionId: number, to: string, amount: number) {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(
      signedContract.transferShares(fractionId, to, amount)
    );
  }

  async proposeUnlock(fractionId: number) {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(
      signedContract.proposeUnlock(fractionId)
    );
  }
} 