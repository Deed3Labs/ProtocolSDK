/**
 * @file Validator Core Test Suite
 * @description This test suite verifies the core functionality of the Validator contract.
 * It tests the fundamental validation operations, state management, and event emissions.
 * The suite uses mocked contract methods to simulate blockchain interactions.
 * 
 * @module ValidatorCoreTest
 */

// Add BigInt serialization support
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { provider, wallet, TEST_CONFIG, getTestContract, executeContractTransaction } from '../setup';
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
import { IValidator } from '../../contracts/IValidator';
import { TransactionManager } from '../../utils/transactionManager';
import { getContractAddresses } from '../../config/contracts';
import { ChainId } from '../../types/network';

// Increase timeout for all tests in this file
jest.setTimeout(60000);

describe('Validator API', () => {
  let validator: ethers.Contract;
  let user1: ethers.Wallet;
  let validatorContract: ethers.Contract;
  const contractAddresses = getContractAddresses(ChainId.BASE_SEPOLIA);

  beforeAll(async () => {
    // Create test wallet
    const privateKey = ethers.hexlify(ethers.randomBytes(32));
    user1 = new ethers.Wallet(privateKey, provider);

    // Initialize contract with proper ABI
    const validatorAbi = [
      'function validateDeed(uint256 deedId) returns (bool)',
      'function validateOperatingAgreement(string agreement) view returns (bool)',
      'function getValidationCriteria(uint8 assetType) view returns (string[], string, bool, bool)',
      'function setValidationCriteria(tuple(uint256 minValue, uint256 maxValue, string[] requiredDocuments) criteria)',
      'function registerOperatingAgreement(tuple(string name, string version, string content) agreement)',
      'function defaultOperatingAgreement() view returns (string)',
      'function addWhitelistedToken(address token)',
      'function removeWhitelistedToken(address token)',
      'function isTokenWhitelisted(address token) view returns (bool)',
      'function getServiceFee() view returns (uint256)',
      'function setServiceFee(uint256 fee)',
      'function withdrawServiceFees()',
      'function getRoyaltyFeePercentage() view returns (uint256)',
      'function setRoyaltyFeePercentage(uint256 percentage)',
      'function getRoyaltyReceiver() view returns (address)',
      'function setRoyaltyReceiver(address receiver)',
      'function setPrimaryDeedNFT(address deedNFT)',
      'function addCompatibleDeedNFT(address deedNFT)',
      'function removeCompatibleDeedNFT(address deedNFT)',
      'function isCompatibleDeedNFT(address deedNFT) view returns (bool)'
    ];

    validator = new ethers.Contract(
      TEST_CONFIG.contracts.validator!,
      validatorAbi,
      wallet
    );

    // Mock contract methods
    jest.spyOn(validator, 'validateDeed').mockResolvedValue(true);
    jest.spyOn(validator, 'validateOperatingAgreement').mockResolvedValue(true);
    jest.spyOn(validator, 'getValidationCriteria').mockResolvedValue([
      ['trait1', 'trait2'],
      JSON.stringify({ minValue: '1000000000000000000', maxValue: '100000000000000000000' }),
      true,
      true
    ]);
    jest.spyOn(validator, 'defaultOperatingAgreement').mockResolvedValue('ipfs://default');
    
    // Track whitelisted tokens
    const whitelistedTokens = new Set<string>();
    jest.spyOn(validator, 'isTokenWhitelisted').mockImplementation((...args: any[]) => {
      const [token] = args;
      return Promise.resolve(whitelistedTokens.has(token));
    });
    jest.spyOn(validator, 'addWhitelistedToken').mockImplementation((...args: any[]) => {
      const [token] = args;
      whitelistedTokens.add(token);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return Promise.resolve(mockTxResponse);
    });
    jest.spyOn(validator, 'removeWhitelistedToken').mockImplementation((...args: any[]) => {
      const [token] = args;
      whitelistedTokens.delete(token);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return Promise.resolve(mockTxResponse);
    });

    jest.spyOn(validator, 'getServiceFee').mockResolvedValue(BigInt('10000000000000000'));
    jest.spyOn(validator, 'getRoyaltyFeePercentage').mockResolvedValue(BigInt(500));
    jest.spyOn(validator, 'getRoyaltyReceiver').mockResolvedValue(await wallet.getAddress());
    
    // Track compatible DeedNFTs
    const compatibleDeedNFTs = new Set<string>();
    jest.spyOn(validator, 'isCompatibleDeedNFT').mockImplementation((...args: any[]) => {
      const [deedNFT] = args;
      return Promise.resolve(compatibleDeedNFTs.has(deedNFT));
    });
    jest.spyOn(validator, 'addCompatibleDeedNFT').mockImplementation((...args: any[]) => {
      const [deedNFT] = args;
      compatibleDeedNFTs.add(deedNFT);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return Promise.resolve(mockTxResponse);
    });
    jest.spyOn(validator, 'removeCompatibleDeedNFT').mockImplementation((...args: any[]) => {
      const [deedNFT] = args;
      compatibleDeedNFTs.delete(deedNFT);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return Promise.resolve(mockTxResponse);
    });

    validatorContract = validator;
  });

  describe('Deed Validation', () => {
    it('should validate a deed', async () => {
      const deedId = 1;
      const result = await executeContractTransaction(
        validatorContract,
        'validateDeed',
        [deedId]
      );
      expect(result.status).toBe(1);
    });

    it('should validate an operating agreement', async () => {
      const agreement = 'test agreement';
      const result = await validateOperatingAgreement(validator, agreement);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Validation Criteria', () => {
    it('should get validation criteria for an asset type', async () => {
      const assetTypeId = 1;
      const [requiredTraits, additionalCriteria, requireOperatingAgreement, requireDefinition] = 
        await getValidationCriteria(validator, assetTypeId);
      expect(Array.isArray(requiredTraits)).toBe(true);
      expect(typeof additionalCriteria).toBe('string');
      expect(typeof requireOperatingAgreement).toBe('boolean');
      expect(typeof requireDefinition).toBe('boolean');
    });

    it('should set validation criteria', async () => {
      const criteria = {
        minValue: ethers.parseEther('1'),
        maxValue: ethers.parseEther('100'),
        requiredDocuments: ['document1', 'document2']
      };
      await executeContractTransaction(
        validatorContract,
        'setValidationCriteria',
        [criteria]
      );
    });
  });

  describe('Operating Agreement Management', () => {
    it('should register operating agreement', async () => {
      const agreement = {
        name: 'Test Agreement',
        version: '1.0',
        content: 'ipfs://agreement1'
      };
      await executeContractTransaction(
        validatorContract,
        'registerOperatingAgreement',
        [agreement]
      );
    });

    it('should get default operating agreement', async () => {
      const result = await defaultOperatingAgreement(validator);
      expect(typeof result).toBe('string');
    });
  });

  describe('Token Management', () => {
    it('should manage whitelisted tokens', async () => {
      const token = '0x1234567890123456789012345678901234567890';
      
      await executeContractTransaction(
        validatorContract,
        'addWhitelistedToken',
        [token]
      );
      expect(await isTokenWhitelisted(validator, token)).toBe(true);
      
      await executeContractTransaction(
        validatorContract,
        'removeWhitelistedToken',
        [token]
      );
      expect(await isTokenWhitelisted(validator, token)).toBe(false);
    });

    it('should manage service fees', async () => {
      const fee = ethers.parseEther('0.01').toString();
      
      await executeContractTransaction(
        validatorContract,
        'setServiceFee',
        [fee]
      );
      expect((await getServiceFee(validator, fee)).toString()).toBe(fee);
      
      await executeContractTransaction(
        validatorContract,
        'withdrawServiceFees'
      );
    });
  });

  describe('Royalty Management', () => {
    it('should manage royalty settings', async () => {
      const feePercentage = 500; // 5%
      const receiver = '0x1234567890123456789012345678901234567890';
      
      await executeContractTransaction(
        validatorContract,
        'setRoyaltyFeePercentage',
        [feePercentage]
      );
      expect(Number(await getRoyaltyFeePercentage(validator, 1))).toBe(feePercentage);
      
      await executeContractTransaction(
        validatorContract,
        'setRoyaltyReceiver',
        [receiver]
      );
      expect(await getRoyaltyReceiver(validator)).toBe(receiver);
    });
  });

  describe('DeedNFT Management', () => {
    it('should manage compatible DeedNFTs', async () => {
      const deedNFT = '0x1234567890123456789012345678901234567890';
      
      await executeContractTransaction(
        validatorContract,
        'setPrimaryDeedNFT',
        [deedNFT]
      );
      await executeContractTransaction(
        validatorContract,
        'addCompatibleDeedNFT',
        [deedNFT]
      );
      expect(await isCompatibleDeedNFT(validator, deedNFT)).toBe(true);
      
      await executeContractTransaction(
        validatorContract,
        'removeCompatibleDeedNFT',
        [deedNFT]
      );
      expect(await isCompatibleDeedNFT(validator, deedNFT)).toBe(false);
    });
  });
}); 