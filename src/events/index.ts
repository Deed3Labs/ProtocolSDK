import { ethers } from 'ethers';
import { TokenMetadata, AssetCondition, LegalInfo, Document } from '../types';
import { IDeedNFT, IFundManager, IValidator, IValidatorRegistry, IMetadataRenderer } from '../types/contracts';

export function onTokenMetadataUpdated(
  contract: ethers.Contract,
  callback: (tokenId: number, metadata: TokenMetadata) => void
): void {
  contract.on('TokenMetadataUpdated', (tokenId: number) => {
    contract.tokenURI(tokenId).then((uri: string) => {
      const metadata = JSON.parse(uri);
      callback(tokenId, metadata);
    });
  });
}

export function onTokenCustomMetadataUpdated(
  contract: ethers.Contract,
  callback: (tokenId: number, metadata: string) => void
): void {
  contract.on('TokenCustomMetadataUpdated', (tokenId: number, metadata: string) => {
    callback(tokenId, metadata);
  });
}

export function onTokenGalleryUpdated(
  contract: ethers.Contract,
  callback: (tokenId: number, gallery: string[]) => void
): void {
  contract.on('TokenGalleryUpdated', (tokenId: number) => {
    contract.getTokenGallery(tokenId).then((gallery: string[]) => {
      callback(tokenId, gallery);
    });
  });
}

export function onAssetConditionUpdated(
  contract: ethers.Contract,
  callback: (tokenId: number, condition: AssetCondition) => void
): void {
  contract.on('TokenCustomMetadataUpdated', (tokenId: number) => {
    contract.getAssetCondition(tokenId).then((condition: AssetCondition) => {
      callback(tokenId, condition);
    });
  });
}

export function onLegalInfoUpdated(
  contract: ethers.Contract,
  callback: (tokenId: number, legalInfo: LegalInfo) => void
): void {
  contract.on('TokenCustomMetadataUpdated', (tokenId: number) => {
    contract.getTokenLegalInfo(tokenId).then((legalInfo: LegalInfo) => {
      callback(tokenId, legalInfo);
    });
  });
}

export function onDocumentUpdated(
  contract: ethers.Contract,
  callback: (tokenId: number, document: Document) => void
): void {
  contract.on('TokenMetadataUpdated', (tokenId: number) => {
    contract.getTokenDocuments(tokenId).then((documents: Document[]) => {
      documents.forEach((document) => {
        callback(tokenId, document);
      });
    });
  });
}

export function onValidationStatusUpdated(
  contract: ethers.Contract,
  callback: (tokenId: number, isValid: boolean, validatorAddress: string) => void
): void {
  contract.on('ValidationStatusUpdated', (tokenId: number, isValid: boolean, validatorAddress: string) => {
    callback(tokenId, isValid, validatorAddress);
  });
}

export function onTransfer(
  contract: ethers.Contract,
  callback: (from: string, to: string, tokenId: number) => void
): void {
  contract.on('Transfer', (from: string, to: string, tokenId: number) => {
    callback(from, to, tokenId);
  });
}

export function onMinterAdded(
  contract: ethers.Contract,
  callback: (minter: string) => void
): void {
  contract.on('MinterAdded', (minter: string) => {
    callback(minter);
  });
}

export function onMinterRemoved(
  contract: ethers.Contract,
  callback: (minter: string) => void
): void {
  contract.on('MinterRemoved', (minter: string) => {
    callback(minter);
  });
}

export function onMarketplaceApprovalUpdated(
  contract: ethers.Contract,
  callback: (marketplace: string, approved: boolean) => void
): void {
  contract.on('MarketplaceApprovalUpdated', (marketplace: string, approved: boolean) => {
    callback(marketplace, approved);
  });
}

export function onRoyaltyEnforcementUpdated(
  contract: ethers.Contract,
  callback: (enforced: boolean) => void
): void {
  contract.on('RoyaltyEnforcementUpdated', (enforced: boolean) => {
    callback(enforced);
  });
}

export function onTransferValidatorUpdated(
  contract: ethers.Contract,
  callback: (validator: string) => void
): void {
  contract.on('TransferValidatorUpdated', (validator: string) => {
    callback(validator);
  });
}

// DeedNFT Events
export const onDeedNFTMinted = (
  contract: ethers.Contract,
  callback: (tokenId: number, assetType: number, minter: string, validator: string) => void
) => {
  contract.on('DeedNFTMinted', callback);
};

export const onDeedNFTBurned = (
  contract: ethers.Contract,
  callback: (tokenId: number) => void
) => {
  contract.on('DeedNFTBurned', callback);
};

export const onMetadataRendererUpdated = (
  contract: ethers.Contract,
  callback: (renderer: string) => void
) => {
  contract.on('MetadataRendererUpdated', callback);
};

export const onContractURIUpdated = (
  contract: ethers.Contract,
  callback: (newURI: string) => void
) => {
  contract.on('ContractURIUpdated', callback);
};

export const onTraitUpdated = (
  contract: ethers.Contract,
  callback: (traitKey: string, tokenId: number, traitValue: string) => void
) => {
  contract.on('TraitUpdated', callback);
};

export const onDeedValidated = (
  contract: ethers.Contract,
  callback: (tokenId: number, isValid: boolean) => void
) => {
  contract.on('DeedValidated', callback);
};

export const onMarketplaceApproved = (
  contract: ethers.Contract,
  callback: (marketplace: string, approved: boolean) => void
) => {
  contract.on('MarketplaceApproved', callback);
};

export const onRoyaltyEnforcementChanged = (
  contract: ethers.Contract,
  callback: (enforced: boolean) => void
) => {
  contract.on('RoyaltyEnforcementChanged', callback);
};

// FundManager Events
export const onCommissionPercentageUpdated = (
  contract: ethers.Contract,
  callback: (newCommissionPercentage: number) => void
) => {
  contract.on('CommissionPercentageUpdated', callback);
};

export const onFeeReceiverUpdated = (
  contract: ethers.Contract,
  callback: (newFeeReceiver: string) => void
) => {
  contract.on('FeeReceiverUpdated', callback);
};

export const onValidatorRegistryUpdated = (
  contract: ethers.Contract,
  callback: (newValidatorRegistry: string) => void
) => {
  contract.on('ValidatorRegistryUpdated', callback);
};

export const onDeedNFTUpdated = (
  contract: ethers.Contract,
  callback: (newDeedNFT: string) => void
) => {
  contract.on('DeedNFTUpdated', callback);
};

export const onServiceFeeCollected = (
  contract: ethers.Contract,
  callback: (validator: string, token: string, amount: number, commission: number) => void
) => {
  contract.on('ServiceFeeCollected', callback);
};

export const onDeedMinted = (
  contract: ethers.Contract,
  callback: (tokenId: number, owner: string, validator: string) => void
) => {
  contract.on('DeedMinted', callback);
};

export const onValidatorFeesWithdrawn = (
  contract: ethers.Contract,
  callback: (validator: string, token: string, amount: number, recipient: string) => void
) => {
  contract.on('ValidatorFeesWithdrawn', callback);
};

// Validator Events
export const onValidationError = (
  contract: ethers.Contract,
  callback: (tokenId: number, errorMessage: string) => void
) => {
  contract.on('ValidationError', callback);
};

export const onValidationCriteriaUpdated = (
  contract: ethers.Contract,
  callback: (
    assetTypeId: number,
    requiredTraits: string[],
    additionalCriteria: string,
    requireOperatingAgreement: boolean,
    requireDefinition: boolean
  ) => void
) => {
  contract.on('ValidationCriteriaUpdated', callback);
};

export const onDefaultOperatingAgreementUpdated = (
  contract: ethers.Contract,
  callback: (uri: string) => void
) => {
  contract.on('DefaultOperatingAgreementUpdated', callback);
};

export const onOperatingAgreementRegistered = (
  contract: ethers.Contract,
  callback: (uri: string, name: string) => void
) => {
  contract.on('OperatingAgreementRegistered', callback);
};

export const onServiceFeeUpdated = (
  contract: ethers.Contract,
  callback: (token: string, fee: number) => void
) => {
  contract.on('ServiceFeeUpdated', callback);
};

export const onTokenWhitelistStatusUpdated = (
  contract: ethers.Contract,
  callback: (token: string, status: boolean) => void
) => {
  contract.on('TokenWhitelistStatusUpdated', callback);
};

// ValidatorRegistry Events
export const onValidatorRegistered = (
  contract: ethers.Contract,
  callback: (validator: string, name: string, supportedAssetTypes: number[]) => void
) => {
  contract.on('ValidatorRegistered', callback);
};

export const onValidatorStatusUpdated = (
  contract: ethers.Contract,
  callback: (validator: string, isActive: boolean) => void
) => {
  contract.on('ValidatorStatusUpdated', callback);
};

// MetadataRenderer Events
export const onTokenDocumentUpdated = (
  contract: ethers.Contract,
  callback: (tokenId: number, docType: string, documentURI: string) => void
) => {
  contract.on('TokenDocumentUpdated', callback);
};

export const onTokenFeaturesUpdated = (
  contract: ethers.Contract,
  callback: (tokenId: number, features: string[]) => void
) => {
  contract.on('TokenFeaturesUpdated', callback);
};

export const onTokenAnimationURLUpdated = (
  contract: ethers.Contract,
  callback: (tokenId: number, url: string) => void
) => {
  contract.on('TokenAnimationURLUpdated', callback);
};

export const onTokenExternalLinkUpdated = (
  contract: ethers.Contract,
  callback: (tokenId: number, link: string) => void
) => {
  contract.on('TokenExternalLinkUpdated', callback);
}; 