import { ethers } from 'ethers';
import { IDeedNFT, IFundManager, IValidator, IValidatorRegistry, IMetadataRenderer } from '../types/contracts';
import { IDeedNFT as IDeedNFTContract } from '../contracts/IDeedNFT';
import { IFundManager as IFundManagerContract } from '../contracts/IFundManager';
import { IValidator as IValidatorContract } from '../contracts/IValidator';
import { IValidatorRegistry as IValidatorRegistryContract } from '../contracts/IValidatorRegistry';
import { IMetadataRenderer as IMetadataRendererContract } from '../contracts/IMetadataRenderer';

/**
 * Creates a new instance of the DeedNFT contract
 * @param address The address of the deployed contract
 * @param signerOrProvider The signer or provider to use for the contract
 * @returns A new instance of the DeedNFT contract
 */
export function createDeedNFT(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): IDeedNFT {
  return new ethers.Contract(
    address,
    IDeedNFTContract.abi,
    signerOrProvider
  ) as unknown as IDeedNFT;
}

/**
 * Creates a new instance of the FundManager contract
 * @param address The address of the deployed contract
 * @param signerOrProvider The signer or provider to use for the contract
 * @returns A new instance of the FundManager contract
 */
export function createFundManager(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): IFundManager {
  return new ethers.Contract(
    address,
    IFundManagerContract.abi,
    signerOrProvider
  ) as unknown as IFundManager;
}

/**
 * Creates a new instance of the Validator contract
 * @param address The address of the deployed contract
 * @param signerOrProvider The signer or provider to use for the contract
 * @returns A new instance of the Validator contract
 */
export function createValidator(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): IValidator {
  return new ethers.Contract(
    address,
    IValidatorContract.abi,
    signerOrProvider
  ) as unknown as IValidator;
}

/**
 * Creates a new instance of the ValidatorRegistry contract
 * @param address The address of the deployed contract
 * @param signerOrProvider The signer or provider to use for the contract
 * @returns A new instance of the ValidatorRegistry contract
 */
export function createValidatorRegistry(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): IValidatorRegistry {
  return new ethers.Contract(
    address,
    IValidatorRegistryContract.abi,
    signerOrProvider
  ) as unknown as IValidatorRegistry;
}

/**
 * Creates a new instance of the MetadataRenderer contract
 * @param address The address of the deployed contract
 * @param signerOrProvider The signer or provider to use for the contract
 * @returns A new instance of the MetadataRenderer contract
 */
export function createMetadataRenderer(
  address: string,
  signerOrProvider: ethers.Signer | ethers.Provider
): IMetadataRenderer {
  return new ethers.Contract(
    address,
    IMetadataRendererContract.abi,
    signerOrProvider
  ) as unknown as IMetadataRenderer;
}

/**
 * Creates instances of all contracts
 * @param addresses Object containing addresses for all contracts
 * @param signerOrProvider The signer or provider to use for the contracts
 * @returns Object containing instances of all contracts
 */
export function createAllContracts(
  addresses: {
    deedNFT: string;
    fundManager: string;
    validator: string;
    validatorRegistry: string;
    metadataRenderer: string;
  },
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return {
    deedNFT: createDeedNFT(addresses.deedNFT, signerOrProvider),
    fundManager: createFundManager(addresses.fundManager, signerOrProvider),
    validator: createValidator(addresses.validator, signerOrProvider),
    validatorRegistry: createValidatorRegistry(addresses.validatorRegistry, signerOrProvider),
    metadataRenderer: createMetadataRenderer(addresses.metadataRenderer, signerOrProvider)
  };
} 