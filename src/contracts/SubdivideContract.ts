import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash
} from 'viem'
import { BaseContract } from './BaseContract'
import { SubdivideABI } from '../abis'
import { SubdivisionInfo } from '../types'

export class SubdivideContract extends BaseContract {
  constructor(
    publicClient: PublicClient,
    walletClient: WalletClient,
    address: Address
  ) {
    super(publicClient, walletClient, address, SubdivideABI)
  }

  // Reference Subdivide.sol lines 219-247
  async createSubdivision(params: {
    deedId: number;
    name: string;
    description: string;
    symbol: string;
    collectionUri: string;
    totalUnits: number;
    burnable: boolean;
  }) {
    const signedContract = await this.getSignedContract();
    const tx = await signedContract.createSubdivision(
      params.deedId,
      params.name,
      params.description,
      params.symbol,
      params.collectionUri,
      params.totalUnits,
      params.burnable
    );
    return tx.wait();
  }

  // Reference Subdivide.sol lines 337-366
  async batchMintUnits(deedId: number, unitIds: number[], recipients: string[]) {
    const signedContract = await this.getSignedContract();
    const tx = await signedContract.batchMintUnits(deedId, unitIds, recipients);
    return tx.wait();
  }

  async getSubdivisionInfo(deedId: number): Promise<SubdivisionInfo> {
    return await this.contract.subdivisions(deedId);
  }

  // Reference Subdivide.sol lines 373-382
  async burnUnit(deedId: number, unitId: number) {
    const signedContract = await this.getSignedContract();
    const tx = await signedContract.burnUnit(deedId, unitId);
    return tx.wait();
  }

  // Reference Subdivide.sol lines 388-395
  async deactivateSubdivision(deedId: number) {
    const signedContract = await this.getSignedContract();
    const tx = await signedContract.deactivateSubdivision(deedId);
    return tx.wait();
  }

  // Moved from helpers/index.ts
  async subdivideAsset(params: {
    deedId: number;
    units: number;
    name: string;
    symbol: string;
    description?: string;
  }) {
    const canSubdivide = await this.deedNFT.canSubdivide(params.deedId);
    if (!canSubdivide) {
      throw new Error('Asset cannot be subdivided');
    }

    return this.createSubdivision({
      deedId: params.deedId,
      totalUnits: params.units,
      name: params.name,
      symbol: params.symbol,
      description: params.description || '',
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