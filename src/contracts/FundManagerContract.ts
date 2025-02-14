import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash,
  type TransactionReceipt
} from 'viem'
import { BaseContract } from './BaseContract';
import { AssetType } from '../types';
import { FundManagerABI } from '../abis';

export class FundManagerContract extends BaseContract {
  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient,
    address: Address
  ) {
    super(publicClient, walletClient, address, FundManagerABI);
  }

  async mintDeedNFT(params: {
    assetType: AssetType;
    ipfsDetailsHash: string;
    operatingAgreement: string;
    definition: string;
    configuration: string;
    validatorContract: string;
    token: string;
    ipfsTokenURI: string;
  }): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('mintDeedNFT', [
      params.assetType,
      params.ipfsDetailsHash,
      params.operatingAgreement,
      params.definition,
      params.configuration,
      params.validatorContract,
      params.token,
      params.ipfsTokenURI
    ]);
  }

  async getServiceFeesBalance(token: string): Promise<bigint> {
    return this.executeCall('getServiceFeesBalance', [token]);
  }
} 