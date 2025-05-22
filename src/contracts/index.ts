import { ethers } from 'ethers';

// Export all contract interfaces
export { IDeedNFTInterface, IDeedNFTContract } from './IDeedNFT';
export { IFundManagerInterface, IFundManagerContract } from './IFundManager';
export { IMetadataRendererInterface, IMetadataRendererContract } from './IMetadataRenderer';
export { IValidatorInterface, IValidatorContract } from './IValidator';
export { IValidatorRegistryInterface, IValidatorRegistryContract } from './IValidatorRegistry';

// Contract types
export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface ContractInstance<T> {
  contract: T;
  address: string;
}

// Contract factory
export class ContractFactory {
  static async createContract<T>(
    provider: ethers.Provider,
    address: string,
    abi: any[]
  ): Promise<ContractInstance<T>> {
    const contract = new ethers.Contract(address, abi, provider) as unknown as T;
    return {
      contract,
      address,
    };
  }
} 