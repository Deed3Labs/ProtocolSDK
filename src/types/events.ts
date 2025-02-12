import { ethers } from 'ethers';

export interface SubdivideEvents {
  SubdivisionCreated: (deedId: number, name: string, totalUnits: number) => void;
  UnitMinted: (deedId: number, unitId: number, recipient: string) => void;
  UnitBurned: (deedId: number, unitId: number, burner: string) => void;
  SubdivisionDeactivated: (deedId: number) => void;
  CollectionAdminTransferred: (deedId: number, previousAdmin: string, newAdmin: string) => void;
}

export interface FractionalizeEvents {
  FractionCreated: (fractionId: number, assetType: number, originalTokenId: number) => void;
  SharesTransferred: (fractionId: number, from: string, to: string, amount: number) => void;
  SharesMinted: (fractionId: number, to: string, amount: number) => void;
  SharesBurned: (fractionId: number, from: string, amount: number) => void;
}

export interface DeedNFTEvents {
  DeedCreated: (deedId: number, owner: string, assetType: number) => void;
  DeedValidated: (deedId: number, validator: string) => void;
  Transfer: (from: string, to: string, tokenId: number) => void;  
}

export interface ValidatorEvents {
  ValidatorRegistered: (validator: string, name: string, assetTypes: number[]) => void;
  ValidatorStatusUpdated: (validator: string, isActive: boolean) => void;
}

export interface TransactionResponse {
  success: boolean;
  receipt?: ethers.ContractReceipt;
  error?: string;
}

export interface EventFilter {
  fromBlock?: number;
  toBlock?: number;
  address?: string;
}

export type EventCallback<T> = (event: T) => void;

export interface ContractEventTypes {
  DeedCreated: (deedId: number, owner: string) => void;
  SubdivisionCreated: (deedId: number, name: string) => void;
  FractionCreated: (fractionId: number, assetType: number) => void;
  ValidatorRegistered: (validator: string, name: string) => void;
} 