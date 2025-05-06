import { ethers } from 'ethers';
import { IValidatorRegistry } from '../contracts/IValidatorRegistry.json';

export async function getValidatorOwner(contract: ethers.Contract, validatorContract: string): Promise<string> {
  return await contract.getValidatorOwner(validatorContract);
}

export async function getValidatorInfo(contract: ethers.Contract, validator: string): Promise<any> {
  return await contract.getValidatorInfo(validator);
}

export async function getValidatorsForAssetType(contract: ethers.Contract, assetTypeId: number): Promise<string[]> {
  return await contract.getValidatorsForAssetType(assetTypeId);
}

export async function isValidatorActive(contract: ethers.Contract, validator: string): Promise<boolean> {
  return await contract.isValidatorActive(validator);
}

export async function isValidatorRegistered(contract: ethers.Contract, validator: string): Promise<boolean> {
  return await contract.isValidatorRegistered(validator);
}

export async function getValidatorName(contract: ethers.Contract, validator: string): Promise<string> {
  return await contract.getValidatorName(validator);
} 