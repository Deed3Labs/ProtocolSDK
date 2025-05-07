import { ethers } from 'ethers';
import { ValidationError } from '../types/errors';

/**
 * Format an amount to the specified number of decimals
 */
export function formatAmount(amount: bigint, decimals: number): string {
  return ethers.formatUnits(amount, decimals);
}

/**
 * Parse a string amount to bigint with specified decimals
 */
export function parseAmount(amount: string, decimals: number): bigint {
  return ethers.parseUnits(amount, decimals);
}

/**
 * Format an address to a shortened version (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!ethers.isAddress(address)) {
    throw new ValidationError('Invalid address format');
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Convert IPFS hash to HTTP URL
 */
export function ipfsToHttp(ipfsHash: string): string {
  if (!ipfsHash.startsWith('ipfs://')) {
    throw new ValidationError('Invalid IPFS hash format');
  }
  const hash = ipfsHash.replace('ipfs://', '');
  return `https://ipfs.io/ipfs/${hash}`;
}

/**
 * Convert HTTP URL to IPFS hash
 */
export function httpToIpfs(url: string): string {
  if (!url.startsWith('https://ipfs.io/ipfs/')) {
    throw new ValidationError('Invalid IPFS URL format');
  }
  const hash = url.replace('https://ipfs.io/ipfs/', '');
  return `ipfs://${hash}`;
}

/**
 * Format a bigint timestamp to a human-readable date
 */
export function formatTimestamp(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toISOString();
}

/**
 * Calculate gas price with buffer
 */
export function calculateGasPrice(
  baseGasPrice: bigint,
  buffer: number = 1.1
): bigint {
  return (baseGasPrice * BigInt(Math.floor(buffer * 100))) / BigInt(100);
}

/**
 * Format transaction hash to a shortened version
 */
export function formatTxHash(hash: string): string {
  if (!hash.startsWith('0x') || hash.length !== 66) {
    throw new ValidationError('Invalid transaction hash format');
  }
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

/**
 * Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return ethers.hexlify(bytes);
}

/**
 * Convert hex string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  return ethers.getBytes(hex);
}

/**
 * Format error message with context
 */
export function formatErrorMessage(error: Error, context?: string): string {
  return context ? `${context}: ${error.message}` : error.message;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
      retries++;
    }
  }
}

/**
 * Check if a value is within a range
 */
export function isInRange(
  value: number | bigint,
  min: number | bigint,
  max: number | bigint
): boolean {
  return value >= min && value <= max;
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number | bigint): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncate a string to a specified length
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Convert a number to a percentage string
 */
export function toPercentage(num: number, decimals: number = 2): string {
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a string is a valid JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a value is an object
 */
function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Merge two objects deeply
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  if (isValidJSON(JSON.stringify(source))) {
    Object.keys(source).forEach(key => {
      const typedKey = key as keyof T;
      if (isObject(source[typedKey]) && typedKey in target) {
        output[typedKey] = deepMerge(target[typedKey], source[typedKey] as Partial<T[keyof T]>);
      } else {
        output[typedKey] = source[typedKey] as T[keyof T];
      }
    });
  }
  return output;
} 