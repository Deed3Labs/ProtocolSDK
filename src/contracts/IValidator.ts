import { ethers } from 'ethers';

export interface IValidatorInterface extends ethers.Interface {
  functions: {
    getBaseUri(): Promise<string>;
    setBaseUri(newBaseUri: string): Promise<ethers.ContractTransaction>;
    getDefaultOperatingAgreement(): Promise<string>;
    setDefaultOperatingAgreement(uri: string): Promise<ethers.ContractTransaction>;
    setOperatingAgreementName(uri: string, name: string): Promise<ethers.ContractTransaction>;
    removeOperatingAgreementName(uri: string): Promise<ethers.ContractTransaction>;
    setDeedNFT(deedNFT: string): Promise<ethers.ContractTransaction>;
    addCompatibleDeedNFT(deedNFT: string): Promise<ethers.ContractTransaction>;
    removeCompatibleDeedNFT(deedNFT: string): Promise<ethers.ContractTransaction>;
    setPrimaryDeedNFT(deedNFT: string): Promise<ethers.ContractTransaction>;
    setAssetTypeSupport(assetTypeId: number, isSupported: boolean): Promise<ethers.ContractTransaction>;
    validateDeed(tokenId: ethers.BigNumberish): Promise<ethers.ContractTransaction>;
    validateOperatingAgreement(uri: string): Promise<ethers.ContractTransaction>;
    getValidationCriteria(assetTypeId: number): Promise<{
      requiredTraits: string[];
      additionalCriteria: string;
      requireOperatingAgreement: boolean;
      requireDefinition: boolean;
    }>;
    setValidationCriteria(
      assetTypeId: number,
      requiredTraits: string[],
      additionalCriteria: string,
      requireOperatingAgreement: boolean,
      requireDefinition: boolean
    ): Promise<ethers.ContractTransaction>;
    registerOperatingAgreement(uri: string, name: string): Promise<ethers.ContractTransaction>;
    defaultOperatingAgreement(): Promise<string>;
    addWhitelistedToken(token: string): Promise<ethers.ContractTransaction>;
    removeWhitelistedToken(token: string): Promise<ethers.ContractTransaction>;
    isTokenWhitelisted(token: string): Promise<boolean>;
    getServiceFee(token: string): Promise<ethers.BigNumberish>;
    setServiceFee(token: string, fee: ethers.BigNumberish): Promise<ethers.ContractTransaction>;
    withdrawServiceFees(token: string): Promise<ethers.ContractTransaction>;
    setupValidationCriteria(assetTypeId: number): Promise<ethers.ContractTransaction>;
    operatingAgreementName(uri: string): Promise<string>;
    supportsAssetType(assetTypeId: number): Promise<boolean>;
    setFundManager(fundManager: string): Promise<ethers.ContractTransaction>;
    getRoyaltyFeePercentage(tokenId: number): Promise<number>;
    setRoyaltyFeePercentage(percentage: number): Promise<ethers.ContractTransaction>;
    getRoyaltyReceiver(): Promise<string>;
    setRoyaltyReceiver(receiver: string): Promise<ethers.ContractTransaction>;
  };
}

export type IValidatorContract = ethers.Contract & IValidatorInterface;

export const IValidator = {
  abi: [
    {
      inputs: [],
      name: "getBaseUri",
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ name: "newBaseUri", type: "string" }],
      name: "setBaseUri",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "defaultOperatingAgreement",
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ name: "uri", type: "string" }],
      name: "setDefaultOperatingAgreement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { name: "uri", type: "string" },
        { name: "name", type: "string" }
      ],
      name: "setOperatingAgreementName",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "uri", type: "string" }],
      name: "removeOperatingAgreementName",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "deedNFT", type: "address" }],
      name: "setDeedNFT",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "deedNFT", type: "address" }],
      name: "addCompatibleDeedNFT",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "deedNFT", type: "address" }],
      name: "removeCompatibleDeedNFT",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "deedNFT", type: "address" }],
      name: "setPrimaryDeedNFT",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { name: "assetTypeId", type: "uint8" },
        { name: "isSupported", type: "bool" }
      ],
      name: "setAssetTypeSupport",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "validateDeed",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "uri", type: "string" }],
      name: "validateOperatingAgreement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "assetTypeId", type: "uint8" }],
      name: "getValidationCriteria",
      outputs: [
        { name: "requiredTraits", type: "string[]" },
        { name: "additionalCriteria", type: "string" },
        { name: "requireOperatingAgreement", type: "bool" },
        { name: "requireDefinition", type: "bool" }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        { name: "assetTypeId", type: "uint8" },
        { name: "requiredTraits", type: "string[]" },
        { name: "additionalCriteria", type: "string" },
        { name: "requireOperatingAgreement", type: "bool" },
        { name: "requireDefinition", type: "bool" }
      ],
      name: "setValidationCriteria",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { name: "uri", type: "string" },
        { name: "name", type: "string" }
      ],
      name: "registerOperatingAgreement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "token", type: "address" }],
      name: "addWhitelistedToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "token", type: "address" }],
      name: "removeWhitelistedToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "token", type: "address" }],
      name: "isTokenWhitelisted",
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ name: "token", type: "address" }],
      name: "getServiceFee",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        { name: "token", type: "address" },
        { name: "fee", type: "uint256" }
      ],
      name: "setServiceFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "token", type: "address" }],
      name: "withdrawServiceFees",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "assetTypeId", type: "uint8" }],
      name: "setupValidationCriteria",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "uri", type: "string" }],
      name: "operatingAgreementName",
      outputs: [{ name: "", type: "string" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ name: "assetTypeId", type: "uint8" }],
      name: "supportsAssetType",
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ name: "fundManager", type: "address" }],
      name: "setFundManager",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [{ name: "tokenId", type: "uint256" }],
      name: "getRoyaltyFeePercentage",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ name: "percentage", type: "uint256" }],
      name: "setRoyaltyFeePercentage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "getRoyaltyReceiver",
      outputs: [{ name: "", type: "address" }],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ name: "receiver", type: "address" }],
      name: "setRoyaltyReceiver",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ] as const,
  bytecode: "0x",
  deployedBytecode: "0x",
  linkReferences: {},
  deployedLinkReferences: {}
}; 