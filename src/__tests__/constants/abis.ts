import { IDeedNFT } from '../../contracts/IDeedNFT';
import { IFundManager } from '../../contracts/IFundManager';
import { IValidator } from '../../contracts/IValidator';
import { IValidatorRegistry } from '../../contracts/IValidatorRegistry';
import { IMetadataRenderer } from '../../contracts/IMetadataRenderer';

export const TEST_ABIS = {
  DeedNFT: IDeedNFT.abi,
  FundManager: IFundManager.abi,
  Validator: IValidator.abi,
  ValidatorRegistry: IValidatorRegistry.abi,
  MetadataRenderer: IMetadataRenderer.abi
} as const; 