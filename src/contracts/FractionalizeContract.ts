import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash
} from 'viem'
import { BaseContract } from './BaseContract';
import { FractionInfo, FractionAssetType } from '../types';
import { FractionalizeABI } from '../abis';

export class FractionalizeContract extends BaseContract {
  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient,
    address: Address
  ) {
    super(publicClient, walletClient, address, FractionalizeABI);
  }

  async createFraction(params: {
    assetType: FractionAssetType;
    tokenId: number;
    name: string;
    symbol: string;
    description: string;
    totalShares: number;
    maxSharesPerWallet: number;
  }) {
    return this.executeTransaction(
      'createFraction',
      [
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

  async mint(to: Address, tokenId: bigint): Promise<{ hash: Hash }> {
    return this.executeTransaction('mint', [to, tokenId])
  }

  async tokenURI(tokenId: bigint): Promise<string> {
    return this.executeCall('tokenURI', [tokenId])
  }

  async ownerOf(tokenId: bigint): Promise<Address> {
    return this.executeCall('ownerOf', [tokenId])
  }
} 