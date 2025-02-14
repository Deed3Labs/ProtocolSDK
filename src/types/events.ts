import { type Address, type Log } from 'viem'

export interface SubdivideEvents {
  SubdivisionCreated: (deedId: bigint, name: string, totalUnits: bigint) => void;
  UnitMinted: (deedId: bigint, unitId: bigint, recipient: Address) => void;
  UnitBurned: (deedId: bigint, unitId: bigint, burner: Address) => void;
  SubdivisionDeactivated: (deedId: bigint) => void;
  CollectionAdminTransferred: (deedId: bigint, previousAdmin: Address, newAdmin: Address) => void;
}

export interface FractionalizeEvents {
  FractionCreated: (fractionId: bigint, assetType: bigint, originalTokenId: bigint) => void;
  SharesTransferred: (fractionId: bigint, from: Address, to: Address, amount: bigint) => void;
  SharesMinted: (fractionId: bigint, to: Address, amount: bigint) => void;
  SharesBurned: (fractionId: bigint, from: Address, amount: bigint) => void;
}

export interface DeedNFTEvents {
  DeedCreated: (deedId: bigint, owner: Address, assetType: bigint) => void;
  DeedValidated: (deedId: bigint, validator: Address) => void;
  Transfer: (from: Address, to: Address, tokenId: bigint) => void;  
}

export interface ValidatorEvents {
  ValidatorRegistered: (validator: Address, name: string, assetTypes: bigint[]) => void;
  ValidatorStatusUpdated: (validator: Address, isActive: boolean) => void;
}

export interface EventFilter {
  fromBlock?: bigint;
  toBlock?: bigint;
  address?: Address;
}

export type EventCallback = (log: Log) => void;

export interface ContractEventTypes {
  DeedCreated: (deedId: bigint, owner: Address) => void;
  SubdivisionCreated: (deedId: bigint, name: string) => void;
  FractionCreated: (fractionId: bigint, assetType: bigint) => void;
  ValidatorRegistered: (validator: Address, name: string) => void;
}

export interface EventConfig {
  fromBlock?: bigint;
  toBlock?: bigint | 'latest';
  filter?: Record<string, any>;
}