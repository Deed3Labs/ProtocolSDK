import { ethers } from 'ethers';
import { AssetType } from '../types/contracts';

export interface IFundManagerInterface extends ethers.Interface {
  functions: {
    mintDeedNFT(
      owner: string,
      assetType: AssetType,
      ipfsDetailsHash: string,
      definition: string,
      configuration: string,
      validatorContract: string,
      token: string,
      salt: ethers.BigNumberish
    ): Promise<ethers.ContractTransaction>;
    
    mintBatchDeedNFT(deeds: Array<{
      owner: string;
      assetType: AssetType;
      ipfsDetailsHash: string;
      definition: string;
      configuration: string;
      validatorContract: string;
      token: string;
      salt: ethers.BigNumberish;
    }>): Promise<ethers.ContractTransaction>;
    
    getCommissionBalance(validator: string, token: string): Promise<ethers.BigNumberish>;
    
    withdrawValidatorFees(validator: string, token: string): Promise<ethers.ContractTransaction>;
    
    setCommissionPercentage(percentage: ethers.BigNumberish): Promise<ethers.ContractTransaction>;
    
    setFeeReceiver(receiver: string): Promise<ethers.ContractTransaction>;
    
    setValidatorRegistry(registry: string): Promise<ethers.ContractTransaction>;
    
    setDeedNFT(deedNFT: string): Promise<ethers.ContractTransaction>;
    
    getCommissionPercentage(): Promise<ethers.BigNumberish>;
    
    commissionPercentage(): Promise<ethers.BigNumberish>;
    
    deedNFT(): Promise<string>;
    
    formatFee(amount: ethers.BigNumberish): Promise<string>;
    
    collectCommission(
      tokenId: ethers.BigNumberish,
      amount: ethers.BigNumberish,
      token: string
    ): Promise<ethers.ContractTransaction>;
  };
}

export type IFundManagerContract = ethers.Contract & IFundManagerInterface;

export const IFundManager = {
  abi: [
    {
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'assetType', type: 'uint8' },
        { name: 'ipfsDetailsHash', type: 'string' },
        { name: 'definition', type: 'string' },
        { name: 'configuration', type: 'string' },
        { name: 'validatorContract', type: 'address' },
        { name: 'token', type: 'address' },
        { name: 'salt', type: 'uint256' }
      ],
      name: 'mintDeedNFT',
      outputs: [{ name: 'tokenId', type: 'uint256' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { name: 'deeds', type: 'tuple[]', components: [
          { name: 'owner', type: 'address' },
          { name: 'assetType', type: 'uint8' },
          { name: 'ipfsDetailsHash', type: 'string' },
          { name: 'definition', type: 'string' },
          { name: 'configuration', type: 'string' },
          { name: 'validatorContract', type: 'address' },
          { name: 'token', type: 'address' },
          { name: 'salt', type: 'uint256' }
        ]}
      ],
      name: 'mintBatchDeedNFT',
      outputs: [{ name: 'tokenIds', type: 'uint256[]' }],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { name: 'validator', type: 'address' },
        { name: 'token', type: 'address' }
      ],
      name: 'getCommissionBalance',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        { name: 'validator', type: 'address' },
        { name: 'token', type: 'address' }
      ],
      name: 'withdrawValidatorFees',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ name: 'percentage', type: 'uint256' }],
      name: 'setCommissionPercentage',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ name: 'receiver', type: 'address' }],
      name: 'setFeeReceiver',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ name: 'registry', type: 'address' }],
      name: 'setValidatorRegistry',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [{ name: 'deedNFT', type: 'address' }],
      name: 'setDeedNFT',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getCommissionPercentage',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'commissionPercentage',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'deedNFT',
      outputs: [{ name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [{ name: 'amount', type: 'uint256' }],
      name: 'formatFee',
      outputs: [{ name: '', type: 'string' }],
      stateMutability: 'pure',
      type: 'function'
    },
    {
      inputs: [
        { name: 'tokenId', type: 'uint256' },
        { name: 'amount', type: 'uint256' },
        { name: 'token', type: 'address' }
      ],
      name: 'collectCommission',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ] as const,
  bytecode: "0x",
  deployedBytecode: "0x",
  linkReferences: {},
  deployedLinkReferences: {}
}; 