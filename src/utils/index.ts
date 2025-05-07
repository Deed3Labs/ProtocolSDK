import { ethers } from 'ethers';
import { TransactionManager } from './transactionManager';
import { MonitoringSystem } from './monitoring';

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function parseTokenURI(uri: string): string {
  if (uri.startsWith('data:application/json;base64,')) {
    const base64 = uri.split(',')[1];
    const json = Buffer.from(base64, 'base64').toString();
    return json;
  }
  return uri;
}

export function formatTokenMetadata(metadata: string): any {
  try {
    return JSON.parse(metadata);
  } catch (error) {
    console.error('Error parsing token metadata:', error);
    return null;
  }
}

export function formatAssetType(assetType: number): string {
  switch (assetType) {
    case 0:
      return 'Land';
    case 1:
      return 'Vehicle';
    case 2:
      return 'Estate';
    case 3:
      return 'Equipment';
    default:
      return 'Unknown';
  }
}

export function formatValidationStatus(isValid: boolean): string {
  return isValid ? 'Valid' : 'Invalid';
}

export function formatCommissionPercentage(percentage: number): string {
  return `${percentage / 100}%`;
}

export function formatServiceFee(fee: number): string {
  return `${fee / 100}%`;
}

export function formatRoyaltyFee(percentage: number): string {
  return `${percentage / 100}%`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function formatAmount(amount: bigint, decimals: number = 18): string {
  return ethers.formatUnits(amount, decimals);
}

export function parseAmount(amount: string, decimals: number = 18): bigint {
  return ethers.parseUnits(amount, decimals);
}

export { TransactionManager, MonitoringSystem }; 