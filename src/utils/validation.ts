import { ethers } from 'ethers';
import { ValidationError, ErrorCodes } from './errors';

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
} 