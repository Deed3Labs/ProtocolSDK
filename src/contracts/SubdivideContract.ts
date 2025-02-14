import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash,
  type TransactionReceipt
} from 'viem'
import { BaseContract } from './BaseContract'
import { SubdivideABI } from '../abis'
import { SubdivisionInfo } from '../types'
import { DeedNFTContract } from './DeedNFTContract'

export class SubdivideContract extends BaseContract {
  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient,
    address: Address,
    private deedNFTContract: DeedNFTContract
  ) {
    super(publicClient, walletClient, address, SubdivideABI)
  }

  // Reference Subdivide.sol lines 219-247
  async createSubdivision(params: {
    deedId: bigint;
    name: string;
    description: string;
    symbol: string;
    collectionUri: string;
    totalUnits: bigint;
    burnable: boolean;
  }): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('createSubdivision', [
      params.deedId,
      params.name,
      params.description,
      params.symbol,
      params.collectionUri,
      params.totalUnits,
      params.burnable
    ])
  }

  // Reference Subdivide.sol lines 337-366
  async batchMintUnits(
    deedId: bigint, 
    unitIds: bigint[], 
    recipients: Address[]
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('batchMintUnits', [deedId, unitIds, recipients])
  }

  async getSubdivisionInfo(deedId: bigint): Promise<SubdivisionInfo> {
    return this.executeCall('getSubdivisionInfo', [deedId])
  }

  // Reference Subdivide.sol lines 373-382
  async burnUnit(
    deedId: bigint, 
    unitId: bigint
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('burnUnit', [deedId, unitId])
  }

  // Reference Subdivide.sol lines 388-395
  async deactivateSubdivision(
    deedId: bigint
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    return this.executeTransaction('deactivateSubdivision', [deedId])
  }

  // Moved from helpers/index.ts
  async subdivideAsset(params: {
    deedId: bigint;
    units: bigint;
    name: string;
    symbol: string;
    description?: string;
  }): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    const canSubdivide = await this.deedNFTContract.canSubdivide(params.deedId);
    if (!canSubdivide) {
      throw new Error('Asset cannot be subdivided');
    }

    return this.createSubdivision({
      deedId: params.deedId,
      totalUnits: params.units,
      name: params.name,
      symbol: params.symbol,
      description: params.description || '',
      collectionUri: '',
      burnable: true
    });
  }

  async subdivide(tokenId: bigint, parts: bigint): Promise<{ hash: Hash }> {
    return this.executeTransaction('subdivide', [tokenId, parts])
  }

  async getSubdivisions(tokenId: bigint): Promise<bigint[]> {
    return this.executeCall('getSubdivisions', [tokenId])
  }
} 