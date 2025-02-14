import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash
} from 'viem'
import { BaseContract } from './BaseContract'
import { DeedNFTABI } from '../abis'
import { AssetType } from '../types'

export class DeedNFTContract extends BaseContract {
  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient,
    address: Address
  ) {
    super(publicClient, walletClient, address, DeedNFTABI)
  }

  async mintAsset(
    owner: Address,
    assetType: AssetType,
    ipfsDetailsHash: string,
    operatingAgreement: string,
    definition: string,
    configuration: string
  ): Promise<{ hash: Hash }> {
    return this.executeTransaction('mintAsset', [
      owner,
      assetType,
      ipfsDetailsHash,
      operatingAgreement,
      definition,
      configuration
    ])
  }

  async getDeedInfo(tokenId: bigint): Promise<[
    AssetType,
    boolean,
    string,
    string,
    string,
    string
  ]> {
    return this.executeCall('getDeedInfo', [tokenId])
  }

  async canSubdivide(tokenId: bigint): Promise<boolean> {
    return this.executeCall('canSubdivide', [tokenId])
  }

  async ownerOf(tokenId: bigint): Promise<Address> {
    return this.executeCall('ownerOf', [tokenId])
  }

  async approve(to: Address, tokenId: bigint): Promise<{ hash: Hash }> {
    return this.executeTransaction('approve', [to, tokenId])
  }

  async getApproved(tokenId: bigint): Promise<Address> {
    return this.executeCall('getApproved', [tokenId])
  }

  async transferFrom(
    from: Address,
    to: Address,
    tokenId: bigint
  ): Promise<{ hash: Hash }> {
    return this.executeTransaction('transferFrom', [from, to, tokenId])
  }
} 