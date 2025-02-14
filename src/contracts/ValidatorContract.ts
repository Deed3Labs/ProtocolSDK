import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash,
  type TransactionReceipt
} from 'viem'
import { BaseContract } from './BaseContract'
import { IValidator } from '../types/contracts'
import { ValidatorABI } from '../abis'

export class ValidatorContract extends BaseContract implements IValidator {
  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient,
    address: Address
  ) {
    super(publicClient, walletClient, address, ValidatorABI)
  }

  async tokenURI(tokenId: bigint): Promise<string> {
    return this.executeCall('tokenURI', [tokenId])
  }

  async defaultOperatingAgreement(): Promise<string> {
    return this.executeCall('defaultOperatingAgreement', [])
  }

  async operatingAgreementName(uri: string): Promise<string> {
    return this.executeCall('operatingAgreementName', [uri])
  }

  async supportsAssetType(assetTypeId: bigint): Promise<boolean> {
    return this.executeCall('supportsAssetType', [assetTypeId])
  }

  async validateDeed(deedId: bigint): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('validateDeed', [deedId])
  }
} 