import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash,
  type TransactionReceipt
} from 'viem'
import { BaseContract } from './BaseContract'
import { FractionInfo, FractionAssetType } from '../types'
import { FractionalizeABI } from '../abis'
import { IFractionalize } from '../types/contracts'

export class FractionalizeContract extends BaseContract implements IFractionalize {
  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient,
    address: Address
  ) {
    super(publicClient, walletClient, address, FractionalizeABI)
  }

  async createFraction(
    assetType: FractionAssetType,
    tokenId: bigint,
    name: string,
    symbol: string,
    description: string,
    totalShares: bigint,
    maxSharesPerWallet: bigint
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('createFraction', [
      assetType,
      tokenId,
      name,
      symbol,
      description,
      totalShares,
      maxSharesPerWallet
    ])
  }

  async getFractionInfo(fractionId: bigint): Promise<FractionInfo> {
    return this.executeCall('getFractionInfo', [fractionId])
  }

  async canReceiveShares(fractionId: bigint, account: Address): Promise<boolean> {
    return this.executeCall('canReceiveShares', [fractionId, account])
  }

  async getVotingPower(fractionId: bigint, account: Address): Promise<bigint> {
    return this.executeCall('getVotingPower', [fractionId, account])
  }
}