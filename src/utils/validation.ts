/**
 * Validation System for the Protocol SDK
 * 
 * This module provides a comprehensive validation system with the following features:
 * 1. Ethereum-specific validations (addresses, amounts, gas prices)
 * 2. Contract-specific validations (deployment, parameters)
 * 3. Configuration validations
 * 4. Common data validations (strings, numbers, dates, URLs, etc.)
 * 
 * Usage:
 * ```typescript
 * // Validate an Ethereum address
 * ValidationSystem.validateAddress('0x123...');
 * 
 * // Validate contract addresses
 * ValidationSystem.validateContractAddresses({
 *   DeedNFT: '0x123...',
 *   FundManager: '0x456...'
 * });
 * 
 * // Validate configuration
 * ValidationSystem.validateConfig({
 *   maxRetries: 3,
 *   timeout: 30000
 * });
 * 
 * // Validate common data types
 * ValidationSystem.validateString('value', 'fieldName');
 * ValidationSystem.validateNumberRange(5, 0, 10, 'fieldName');
 * ValidationSystem.validateUrl('https://example.com', 'fieldName');
 * ```
 * 
 * Error Handling:
 * All validation methods throw a ValidationError with:
 * - Descriptive error message
 * - Field name (if applicable)
 * - Context object with validation details
 * 
 * Example error handling:
 * ```typescript
 * try {
 *   ValidationSystem.validateAddress('invalid');
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.error(`Validation failed for ${error.field}:`, error.message);
 *     console.error('Context:', error.context);
 *   }
 * }
 * ```
 */

import { ethers } from 'ethers';
import { ValidationError, ErrorCodes } from '../types/errors';
import { Config } from '../config';

export class ValidationSystem {
  /**
   * Validate an Ethereum address
   * @param address Address to validate
   * @throws ValidationError if address is invalid
   */
  static validateAddress(address: string): void {
    if (!ethers.isAddress(address)) {
      throw new ValidationError(
        'Invalid Ethereum address',
        'address',
        { address }
      );
    }
  }

  /**
   * Validate contract addresses for a network
   * @param addresses Contract addresses to validate
   * @throws ValidationError if any address is invalid
   */
  static validateContractAddresses(addresses: Record<string, string>): void {
    Object.entries(addresses).forEach(([name, address]) => {
      if (!address) {
        throw new ValidationError(
          `Missing address for ${name}`,
          'address',
          { name, address }
        );
      }
      this.validateAddress(address);
    });
  }

  /**
   * Validate a transaction amount
   * @param amount Amount to validate
   * @throws ValidationError if amount is invalid
   */
  static validateAmount(amount: bigint): void {
    if (amount <= BigInt(0)) {
      throw new ValidationError(
        'Amount must be greater than 0',
        'amount',
        { amount: amount.toString() }
      );
    }
  }

  /**
   * Validate contract parameters
   * @param params Parameters to validate
   * @throws ValidationError if parameters are invalid
   */
  static validateContractParams(params: Record<string, any>): void {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        throw new ValidationError(
          `Missing required parameter: ${key}`,
          key,
          { params }
        );
      }
    }
  }

  /**
   * Validate configuration values
   * @param config Configuration to validate
   * @throws ValidationError if configuration is invalid
   */
  static validateConfig(config: Config): void {
    if (config.maxRetries && config.maxRetries < 0) {
      throw new ValidationError(
        'maxRetries must be non-negative',
        'maxRetries',
        { value: config.maxRetries }
      );
    }
    if (config.retryDelay && config.retryDelay < 0) {
      throw new ValidationError(
        'retryDelay must be non-negative',
        'retryDelay',
        { value: config.retryDelay }
      );
    }
    if (config.timeout && config.timeout < 0) {
      throw new ValidationError(
        'timeout must be non-negative',
        'timeout',
        { value: config.timeout }
      );
    }
    if (config.confirmations && config.confirmations < 0) {
      throw new ValidationError(
        'confirmations must be non-negative',
        'confirmations',
        { value: config.confirmations }
      );
    }
    if (config.maxGasPrice && config.maxGasPrice < 0) {
      throw new ValidationError(
        'maxGasPrice must be non-negative',
        'maxGasPrice',
        { value: config.maxGasPrice }
      );
    }
    if (config.gasLimitBuffer && config.gasLimitBuffer < 1) {
      throw new ValidationError(
        'gasLimitBuffer must be greater than or equal to 1',
        'gasLimitBuffer',
        { value: config.gasLimitBuffer }
      );
    }
    if (config.rateLimit) {
      if (config.rateLimit.maxRequests < 1) {
        throw new ValidationError(
          'rateLimit.maxRequests must be greater than 0',
          'rateLimit.maxRequests',
          { value: config.rateLimit.maxRequests }
        );
      }
      if (config.rateLimit.timeWindow < 1) {
        throw new ValidationError(
          'rateLimit.timeWindow must be greater than 0',
          'rateLimit.timeWindow',
          { value: config.rateLimit.timeWindow }
        );
      }
    }
  }

  /**
   * Validate gas price
   * @param provider Provider to check gas price
   * @param maxGasPrice Maximum allowed gas price
   * @throws ValidationError if gas price is too high
   */
  static async validateGasPrice(
    provider: ethers.Provider,
    maxGasPrice: bigint
  ): Promise<void> {
    const feeData = await provider.getFeeData();
    if (feeData.gasPrice && feeData.gasPrice > maxGasPrice) {
      throw new ValidationError(
        `Gas price too high. Maximum: ${maxGasPrice}, current: ${feeData.gasPrice}`,
        'gasPrice',
        { maxGasPrice, currentGasPrice: feeData.gasPrice }
      );
    }
  }

  /**
   * Validate contract deployment
   * @param address Contract address to validate
   * @param provider Provider to check contract
   * @throws ValidationError if contract is not deployed
   */
  static async validateContractDeployment(
    address: string,
    provider: ethers.Provider
  ): Promise<void> {
    const code = await provider.getCode(address);
    if (code === '0x') {
      throw new ValidationError(
        'Contract not deployed at address',
        'address',
        { address }
      );
    }
  }

  /**
   * Validate a string is not empty
   * @param value String to validate
   * @param field Field name for error message
   * @throws ValidationError if string is empty
   */
  static validateString(value: string, field: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError(
        `${field} cannot be empty`,
        field,
        { value }
      );
    }
  }

  /**
   * Validate a number is within range
   * @param value Number to validate
   * @param min Minimum value (inclusive)
   * @param max Maximum value (inclusive)
   * @param field Field name for error message
   * @throws ValidationError if number is out of range
   */
  static validateNumberRange(value: number, min: number, max: number, field: string): void {
    if (value < min || value > max) {
      throw new ValidationError(
        `${field} must be between ${min} and ${max}`,
        field,
        { value, min, max }
      );
    }
  }

  /**
   * Validate a bigint is within range
   * @param value Bigint to validate
   * @param min Minimum value (inclusive)
   * @param max Maximum value (inclusive)
   * @param field Field name for error message
   * @throws ValidationError if bigint is out of range
   */
  static validateBigIntRange(value: bigint, min: bigint, max: bigint, field: string): void {
    if (value < min || value > max) {
      throw new ValidationError(
        `${field} must be between ${min} and ${max}`,
        field,
        { value: value.toString(), min: min.toString(), max: max.toString() }
      );
    }
  }

  /**
   * Validate an array is not empty
   * @param array Array to validate
   * @param field Field name for error message
   * @throws ValidationError if array is empty
   */
  static validateArrayNotEmpty<T>(array: T[], field: string): void {
    if (!array || array.length === 0) {
      throw new ValidationError(
        `${field} cannot be empty`,
        field,
        { length: array?.length }
      );
    }
  }

  /**
   * Validate a date is in the future
   * @param date Date to validate
   * @param field Field name for error message
   * @throws ValidationError if date is not in the future
   */
  static validateFutureDate(date: Date, field: string): void {
    if (date <= new Date()) {
      throw new ValidationError(
        `${field} must be in the future`,
        field,
        { date: date.toISOString() }
      );
    }
  }

  /**
   * Validate a URL is valid
   * @param url URL to validate
   * @param field Field name for error message
   * @throws ValidationError if URL is invalid
   */
  static validateUrl(url: string, field: string): void {
    try {
      new URL(url);
    } catch {
      throw new ValidationError(
        `${field} must be a valid URL`,
        field,
        { url }
      );
    }
  }

  /**
   * Validate an IPFS hash
   * @param hash IPFS hash to validate
   * @param field Field name for error message
   * @throws ValidationError if hash is invalid
   */
  static validateIpfsHash(hash: string, field: string): void {
    if (!hash.startsWith('Qm') || hash.length !== 46) {
      throw new ValidationError(
        `${field} must be a valid IPFS hash`,
        field,
        { hash }
      );
    }
  }

  /**
   * Validate a JSON string
   * @param json JSON string to validate
   * @param field Field name for error message
   * @throws ValidationError if JSON is invalid
   */
  static validateJson(json: string, field: string): void {
    try {
      JSON.parse(json);
    } catch {
      throw new ValidationError(
        `${field} must be valid JSON`,
        field,
        { json }
      );
    }
  }
} 