import { BaseContract } from './BaseContract';
import { DeedInfo, AssetType, TransactionEventCallbacks } from '../types';
import { DeedNFTABI } from '../abis';

export class DeedNFTContract extends BaseContract {
  constructor(address: string, provider: ethers.providers.Web3Provider) {
    super(address, DeedNFTABI, provider);
  }

  // Based on FundManager.sol lines 423-450
  async mintDeed(
    params: {
      assetType: AssetType;
      ipfsDetailsHash: string;
      operatingAgreement: string;
      definition: string;
      configuration: string;
      validatorContract: string;
      token: string;
      ipfsTokenURI: string;
    },
    options: {
      gasPrice?: ethers.BigNumber;
      callbacks?: TransactionEventCallbacks;
    } = {}
  ) {
    try {
      const tx = await this.estimateAndSendTransaction(
        'mintDeedNFT',
        [
          params.assetType,
          params.ipfsDetailsHash,
          params.operatingAgreement,
          params.definition,
          params.configuration,
          params.validatorContract,
          params.token,
          params.ipfsTokenURI
        ],
        {
          gasPrice: options.gasPrice,
          retryConfig: {
            maxAttempts: 3,
            initialDelay: 1000
          }
        }
      );

      return this.txManager.monitorTransactionWithUpdates(tx, options.callbacks);
    } catch (error) {
      await this.errorHandler.handleError(error, {
        context: 'mintDeed',
        params
      });
      throw error;
    }
  }

  // Based on DeedNFT.sol lines 526-533
  async getDeedInfo(deedId: number): Promise<DeedInfo> {
    return await this.contract.getDeedInfo(deedId);
  }

  async approve(to: string, tokenId: number): Promise<ethers.ContractReceipt> {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(signedContract.approve(to, tokenId));
  }

  async setApprovalForAll(operator: string, approved: boolean): Promise<ethers.ContractReceipt> {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(signedContract.setApprovalForAll(operator, approved));
  }

  async transferFrom(from: string, to: string, tokenId: number): Promise<ethers.ContractReceipt> {
    const signedContract = await this.getSignedContract();
    return this.handleTransaction(signedContract.transferFrom(from, to, tokenId));
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.isApprovedForAll(owner, operator);
  }

  // Moved from helpers/index.ts
  async createDeed(params: {
    assetType: AssetType;
    ipfsHash: string;
    agreement: string;
    definition: string;
  }) {
    return this.mintAsset(
      params.assetType,
      params.ipfsHash,
      params.agreement,
      params.definition
    );
  }
} 