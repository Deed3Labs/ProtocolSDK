/**
 * @file Validator API Test Suite
 * @description This test suite verifies the functionality of the Validator contract API.
 * It tests validation operations, operating agreements, and token management.
 * The suite uses mocked contract methods to simulate blockchain interactions.
 * 
 * @module ValidatorAPITest
 */

import { expect, jest } from '@jest/globals';
import { ethers } from 'ethers';
import {
  validateDeed,
  validateOperatingAgreement,
  getValidationCriteria,
  setValidationCriteria,
  registerOperatingAgreement,
  operatingAgreementName,
  defaultOperatingAgreement,
  addWhitelistedToken,
  removeWhitelistedToken,
  isTokenWhitelisted,
  getServiceFee,
  setServiceFee,
  withdrawServiceFees,
  getRoyaltyFeePercentage,
  setRoyaltyFeePercentage,
  getRoyaltyReceiver,
  setRoyaltyReceiver,
  setPrimaryDeedNFT,
  addCompatibleDeedNFT,
  removeCompatibleDeedNFT,
  isCompatibleDeedNFT
} from '../../api/validator';
import { TEST_CONFIG, provider } from '../setup';

/**
 * @description Test suite for the Validator contract API
 */
describe('Validator API', () => {
  let contract: ethers.Contract;
  const validAddress = '0x1234567890123456789012345678901234567890';
  const validIpfsHash = 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';

  /**
   * @description Sets up the test environment before each test
   * - Resets all mocks
   * - Creates mock transaction response
   * - Initializes mock contract with all required functions
   */
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock transaction response
    const mockTxResponse = {
      hash: '0x123',
      wait: async () => ({
        status: 1,
        logs: [{
          topics: ['0x0', '0x0', '0x0', '0x1'],
          data: '0x'
        }]
      } as unknown as ethers.TransactionReceipt)
    } as ethers.TransactionResponse;

    // Create mock contract with proper types
    contract = {
      // Read functions
      validateDeed: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      validateOperatingAgreement: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getValidationCriteria: jest.fn<() => Promise<[string[], string, boolean, boolean]>>()
        .mockResolvedValue([['trait1', 'trait2'], 'criteria', true, true]),
      operatingAgreementName: jest.fn<() => Promise<string>>().mockResolvedValue('Test Agreement'),
      defaultOperatingAgreement: jest.fn<() => Promise<string>>().mockResolvedValue(validIpfsHash),
      isTokenWhitelisted: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getServiceFee: jest.fn<() => Promise<number>>().mockResolvedValue(100),
      getRoyaltyFeePercentage: jest.fn<() => Promise<number>>().mockResolvedValue(250), // 2.5%
      getRoyaltyReceiver: jest.fn<() => Promise<string>>().mockResolvedValue(validAddress),
      isCompatibleDeedNFT: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),

      // Write functions
      setValidationCriteria: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      registerOperatingAgreement: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      addWhitelistedToken: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      removeWhitelistedToken: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setServiceFee: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      withdrawServiceFees: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setRoyaltyFeePercentage: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setRoyaltyReceiver: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setPrimaryDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      addCompatibleDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      removeCompatibleDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),

      interface: {
        format: () => ({})
      }
    } as unknown as ethers.Contract;
  });

  /**
   * @description Test suite for validation-related functions
   */
  describe('Validation Functions', () => {
    /**
     * @description Tests successful deed validation
     */
    it('should validate deed successfully', async () => {
      const result = await validateDeed(contract, 1);
      expect(result).toBe(true);
      expect(contract.validateDeed).toHaveBeenCalledWith(1);
    });

    /**
     * @description Tests successful operating agreement validation
     */
    it('should validate operating agreement successfully', async () => {
      const result = await validateOperatingAgreement(contract, validIpfsHash);
      expect(result).toBe(true);
      expect(contract.validateOperatingAgreement).toHaveBeenCalledWith(validIpfsHash);
    });

    /**
     * @description Tests successful retrieval of validation criteria
     */
    it('should get validation criteria successfully', async () => {
      const result = await getValidationCriteria(contract, 1);
      expect(result).toEqual([['trait1', 'trait2'], 'criteria', true, true]);
      expect(contract.getValidationCriteria).toHaveBeenCalledWith(1);
    });

    /**
     * @description Tests successful setting of validation criteria
     */
    it('should set validation criteria successfully', async () => {
      await setValidationCriteria(
        contract,
        1,
        ['trait1', 'trait2'],
        'criteria',
        true,
        true
      );
      expect(contract.setValidationCriteria).toHaveBeenCalledWith(
        1,
        ['trait1', 'trait2'],
        'criteria',
        true,
        true
      );
    });
  });

  /**
   * @description Test suite for operating agreement management functions
   */
  describe('Operating Agreement Functions', () => {
    /**
     * @description Tests successful registration of operating agreement
     */
    it('should register operating agreement successfully', async () => {
      await registerOperatingAgreement(contract, validIpfsHash, 'Test Agreement');
      expect(contract.registerOperatingAgreement).toHaveBeenCalledWith(validIpfsHash, 'Test Agreement');
    });

    /**
     * @description Tests successful retrieval of operating agreement name
     */
    it('should get operating agreement name successfully', async () => {
      const result = await operatingAgreementName(contract, validIpfsHash);
      expect(result).toBe('Test Agreement');
      expect(contract.operatingAgreementName).toHaveBeenCalledWith(validIpfsHash);
    });

    /**
     * @description Tests successful retrieval of default operating agreement
     */
    it('should get default operating agreement successfully', async () => {
      const result = await defaultOperatingAgreement(contract);
      expect(result).toBe(validIpfsHash);
      expect(contract.defaultOperatingAgreement).toHaveBeenCalled();
    });
  });

  /**
   * @description Test suite for token whitelist management functions
   */
  describe('Token Management Functions', () => {
    /**
     * @description Tests successful addition of whitelisted token
     */
    it('should add whitelisted token successfully', async () => {
      await addWhitelistedToken(contract, validAddress);
      expect(contract.addWhitelistedToken).toHaveBeenCalledWith(validAddress);
    });

    /**
     * @description Tests successful removal of whitelisted token
     */
    it('should remove whitelisted token successfully', async () => {
      await removeWhitelistedToken(contract, validAddress);
      expect(contract.removeWhitelistedToken).toHaveBeenCalledWith(validAddress);
    });

    /**
     * @description Tests successful checking of token whitelist status
     */
    it('should check if token is whitelisted successfully', async () => {
      const result = await isTokenWhitelisted(contract, validAddress);
      expect(result).toBe(true);
      expect(contract.isTokenWhitelisted).toHaveBeenCalledWith(validAddress);
    });
  });

  /**
   * @description Test suite for fee management functions
   */
  describe('Fee Management Functions', () => {
    /**
     * @description Tests successful retrieval of service fee
     */
    it('should get service fee successfully', async () => {
      const result = await getServiceFee(contract, validAddress);
      expect(result).toBe(100);
      expect(contract.getServiceFee).toHaveBeenCalledWith(validAddress);
    });

    /**
     * @description Tests successful setting of service fee
     */
    it('should set service fee successfully', async () => {
      await setServiceFee(contract, validAddress, 200);
      expect(contract.setServiceFee).toHaveBeenCalledWith(validAddress, 200);
    });

    /**
     * @description Tests successful withdrawal of service fees
     */
    it('should withdraw service fees successfully', async () => {
      await withdrawServiceFees(contract, validAddress);
      expect(contract.withdrawServiceFees).toHaveBeenCalledWith(validAddress);
    });
  });

  /**
   * @description Test suite for royalty management functions
   */
  describe('Royalty Management Functions', () => {
    /**
     * @description Tests successful retrieval of royalty fee percentage
     */
    it('should get royalty fee percentage successfully', async () => {
      const result = await getRoyaltyFeePercentage(contract, 1);
      expect(result).toBe(250);
      expect(contract.getRoyaltyFeePercentage).toHaveBeenCalledWith(1);
    });

    /**
     * @description Tests successful setting of royalty fee percentage
     */
    it('should set royalty fee percentage successfully', async () => {
      await setRoyaltyFeePercentage(contract, 300);
      expect(contract.setRoyaltyFeePercentage).toHaveBeenCalledWith(300);
    });

    /**
     * @description Tests successful retrieval of royalty receiver
     */
    it('should get royalty receiver successfully', async () => {
      const result = await getRoyaltyReceiver(contract);
      expect(result).toBe(validAddress);
      expect(contract.getRoyaltyReceiver).toHaveBeenCalled();
    });

    /**
     * @description Tests successful setting of royalty receiver
     */
    it('should set royalty receiver successfully', async () => {
      await setRoyaltyReceiver(contract, validAddress);
      expect(contract.setRoyaltyReceiver).toHaveBeenCalledWith(validAddress);
    });
  });

  /**
   * @description Test suite for DeedNFT management functions
   */
  describe('DeedNFT Management Functions', () => {
    /**
     * @description Tests successful setting of primary DeedNFT
     */
    it('should set primary DeedNFT successfully', async () => {
      await setPrimaryDeedNFT(contract, validAddress);
      expect(contract.setPrimaryDeedNFT).toHaveBeenCalledWith(validAddress);
    });

    /**
     * @description Tests successful addition of compatible DeedNFT
     */
    it('should add compatible DeedNFT successfully', async () => {
      await addCompatibleDeedNFT(contract, validAddress);
      expect(contract.addCompatibleDeedNFT).toHaveBeenCalledWith(validAddress);
    });

    /**
     * @description Tests successful removal of compatible DeedNFT
     */
    it('should remove compatible DeedNFT successfully', async () => {
      await removeCompatibleDeedNFT(contract, validAddress);
      expect(contract.removeCompatibleDeedNFT).toHaveBeenCalledWith(validAddress);
    });

    /**
     * @description Tests successful checking of DeedNFT compatibility
     */
    it('should check if DeedNFT is compatible successfully', async () => {
      const result = await isCompatibleDeedNFT(contract, validAddress);
      expect(result).toBe(true);
      expect(contract.isCompatibleDeedNFT).toHaveBeenCalledWith(validAddress);
    });
  });

  /**
   * @description Test suite for error handling scenarios
   */
  describe('Error Handling', () => {
    /**
     * @description Tests handling of validation errors
     */
    it('should handle validation errors', async () => {
      jest.spyOn(contract, 'validateDeed').mockRejectedValue(new Error('Validation failed'));
      await expect(validateDeed(contract, 1)).rejects.toThrow('Validation failed');
    });

    /**
     * @description Tests handling of transaction errors
     */
    it('should handle transaction errors', async () => {
      jest.spyOn(contract, 'setValidationCriteria').mockRejectedValue(new Error('Transaction failed'));
      await expect(setValidationCriteria(
        contract,
        1,
        ['trait1'],
        'criteria',
        true,
        true
      )).rejects.toThrow('Transaction failed');
    });
  });
}); 