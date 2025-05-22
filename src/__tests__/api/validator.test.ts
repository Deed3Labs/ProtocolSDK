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
import { IValidatorContract } from '../../contracts';
import {
  validateDeed,
  validateOperatingAgreement,
  getValidationCriteria,
  setValidationCriteria,
  registerOperatingAgreement,
  operatingAgreementName,
  getDefaultOperatingAgreement,
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
  isCompatibleDeedNFT,
  getBaseUri,
  setBaseUri,
  setDefaultOperatingAgreement,
  setOperatingAgreementName,
  removeOperatingAgreementName,
  setDeedNFT,
  setAssetTypeSupport,
  supportsAssetType,
  setupValidationCriteria,
  setFundManager
} from '../../api/validator';
import { TEST_CONFIG, provider } from '../setup';
import * as validatorApi from '../../api/validator';
import { TransactionManager } from '../../utils/transactionManager';

/**
 * @description Test suite for the Validator contract API
 */
describe('Validator API', () => {
  let contract: IValidatorContract;
  let transactionManager: TransactionManager;
  const validTokenId = 1;
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

    // Initialize transaction manager
    transactionManager = new TransactionManager(provider);

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
      defaultOperatingAgreement: jest.fn<() => Promise<string>>().mockResolvedValue('default agreement'),
      isTokenWhitelisted: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getServiceFee: jest.fn<() => Promise<number>>().mockResolvedValue(100),
      getRoyaltyFeePercentage: jest.fn<() => Promise<number>>().mockResolvedValue(250), // 2.5%
      getRoyaltyReceiver: jest.fn<() => Promise<string>>().mockResolvedValue(validAddress),
      isCompatibleDeedNFT: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      isDeedValidated: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getBaseUri: jest.fn<() => Promise<string>>().mockResolvedValue('https://example.com/'),
      supportsAssetType: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),

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
      setBaseUri: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setDefaultOperatingAgreement: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setOperatingAgreementName: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      removeOperatingAgreementName: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setAssetTypeSupport: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setupValidationCriteria: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setFundManager: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),

      interface: {
        format: () => ({})
      }
    } as unknown as IValidatorContract;
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
    it('should get default operating agreement', async () => {
      const result = await getDefaultOperatingAgreement(contract);
      expect(result).toBe('default agreement');
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

  describe('Base URI Management', () => {
    it('should get base URI successfully', async () => {
      const result = await getBaseUri(contract);
      expect(result).toBe('https://example.com/');
      expect(contract.getBaseUri).toHaveBeenCalled();
    });

    it('should set base URI successfully', async () => {
      const newBaseUri = 'https://new-example.com/';
      await setBaseUri(contract, newBaseUri);
      expect(contract.setBaseUri).toHaveBeenCalledWith(newBaseUri);
    });
  });

  describe('Operating Agreement Management', () => {
    it('should set default operating agreement successfully', async () => {
      const newAgreement = 'https://example.com/new-agreement';
      await setDefaultOperatingAgreement(contract, newAgreement);
      expect(contract.setDefaultOperatingAgreement).toHaveBeenCalledWith(newAgreement);
    });

    it('should set operating agreement name successfully', async () => {
      const uri = 'https://example.com/agreement';
      const name = 'New Agreement Name';
      await setOperatingAgreementName(contract, uri, name);
      expect(contract.setOperatingAgreementName).toHaveBeenCalledWith(uri, name);
    });

    it('should remove operating agreement name successfully', async () => {
      const uri = 'https://example.com/agreement';
      await removeOperatingAgreementName(contract, uri);
      expect(contract.removeOperatingAgreementName).toHaveBeenCalledWith(uri);
    });
  });

  describe('DeedNFT Management', () => {
    it('should set deed NFT successfully', async () => {
      const deedNFT = '0x1234567890123456789012345678901234567890';
      await setDeedNFT(contract, deedNFT);
      expect(contract.setDeedNFT).toHaveBeenCalledWith(deedNFT);
    });

    it('should add compatible deed NFT successfully', async () => {
      const deedNFT = '0x1234567890123456789012345678901234567890';
      await addCompatibleDeedNFT(contract, deedNFT);
      expect(contract.addCompatibleDeedNFT).toHaveBeenCalledWith(deedNFT);
    });

    it('should remove compatible deed NFT successfully', async () => {
      const deedNFT = '0x1234567890123456789012345678901234567890';
      await removeCompatibleDeedNFT(contract, deedNFT);
      expect(contract.removeCompatibleDeedNFT).toHaveBeenCalledWith(deedNFT);
    });

    it('should check if deed NFT is compatible successfully', async () => {
      const deedNFT = '0x1234567890123456789012345678901234567890';
      const result = await isCompatibleDeedNFT(contract, deedNFT);
      expect(result).toBe(true);
      expect(contract.isCompatibleDeedNFT).toHaveBeenCalledWith(deedNFT);
    });
  });

  describe('Asset Type Management', () => {
    it('should set asset type support successfully', async () => {
      const assetTypeId = 1;
      const isSupported = true;
      await setAssetTypeSupport(contract, assetTypeId, isSupported);
      expect(contract.setAssetTypeSupport).toHaveBeenCalledWith(assetTypeId, isSupported);
    });

    it('should check if asset type is supported successfully', async () => {
      const assetTypeId = 1;
      const result = await supportsAssetType(contract, assetTypeId);
      expect(result).toBe(true);
      expect(contract.supportsAssetType).toHaveBeenCalledWith(assetTypeId);
    });
  });

  describe('Validation Criteria Management', () => {
    it('should setup validation criteria successfully', async () => {
      const assetTypeId = 1;
      await setupValidationCriteria(contract, assetTypeId);
      expect(contract.setupValidationCriteria).toHaveBeenCalledWith(assetTypeId);
    });
  });

  describe('Fund Manager Management', () => {
    it('should set fund manager successfully', async () => {
      const fundManager = '0x1234567890123456789012345678901234567890';
      await setFundManager(contract, fundManager);
      expect(contract.setFundManager).toHaveBeenCalledWith(fundManager);
    });
  });
});

describe('Additional Validator API Coverage', () => {
  let contract: any;
  let txResponse: { wait: jest.Mock };
  beforeEach(() => {
    txResponse = {
      wait: jest.fn<() => Promise<{ status: number }>>().mockResolvedValue({ status: 1 })
    };
    contract = {
      getBaseUri: jest.fn<() => Promise<string>>().mockResolvedValue('baseURI'),
      setBaseUri: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      defaultOperatingAgreement: jest.fn<() => Promise<string>>().mockResolvedValue('defaultOA'),
      setDefaultOperatingAgreement: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      setOperatingAgreementName: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      removeOperatingAgreementName: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      setDeedNFT: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      addCompatibleDeedNFT: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      removeCompatibleDeedNFT: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      setPrimaryDeedNFT: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      setAssetTypeSupport: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      setValidationCriteria: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      setupValidationCriteria: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      operatingAgreementName: jest.fn<() => Promise<string>>().mockResolvedValue('OA Name'),
      supportsAssetType: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      addWhitelistedToken: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      removeWhitelistedToken: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      setServiceFee: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      setFundManager: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      withdrawServiceFees: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      isTokenWhitelisted: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getServiceFee: jest.fn<() => Promise<number>>().mockResolvedValue(100),
      getValidationCriteria: jest.fn<() => Promise<{ requiredTraits: string[]; additionalCriteria: string; requireOperatingAgreement: boolean; requireDefinition: boolean }>>().mockResolvedValue({
        requiredTraits: ['foo'],
        additionalCriteria: '{}',
        requireOperatingAgreement: true,
        requireDefinition: false
      }),
      isCompatibleDeedNFT: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      registerOperatingAgreement: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      validateOperatingAgreement: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
      getRoyaltyFeePercentage: jest.fn<() => Promise<number>>().mockResolvedValue(5),
      setRoyaltyFeePercentage: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse),
      getRoyaltyReceiver: jest.fn<() => Promise<string>>().mockResolvedValue('0x123'),
      setRoyaltyReceiver: jest.fn<() => Promise<{ wait: jest.Mock }>>().mockResolvedValue(txResponse)
    };
  });

  it('should get base URI', async () => {
    const result = await validatorApi.getBaseUri(contract);
    expect(contract.getBaseUri).toHaveBeenCalled();
    expect(result).toBe('baseURI');
  });
  it('should set base URI', async () => {
    await validatorApi.setBaseUri(contract, 'newURI');
    expect(contract.setBaseUri).toHaveBeenCalledWith('newURI');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should get default operating agreement', async () => {
    const result = await validatorApi.getDefaultOperatingAgreement(contract);
    expect(contract.defaultOperatingAgreement).toHaveBeenCalled();
    expect(result).toBe('defaultOA');
  });
  it('should set default operating agreement', async () => {
    await validatorApi.setDefaultOperatingAgreement(contract, 'uri');
    expect(contract.setDefaultOperatingAgreement).toHaveBeenCalledWith('uri');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should set operating agreement name', async () => {
    await validatorApi.setOperatingAgreementName(contract, 'uri', 'name');
    expect(contract.setOperatingAgreementName).toHaveBeenCalledWith('uri', 'name');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should remove operating agreement name', async () => {
    await validatorApi.removeOperatingAgreementName(contract, 'uri');
    expect(contract.removeOperatingAgreementName).toHaveBeenCalledWith('uri');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should set DeedNFT', async () => {
    await validatorApi.setDeedNFT(contract, '0xabc');
    expect(contract.setDeedNFT).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should add compatible DeedNFT', async () => {
    await validatorApi.addCompatibleDeedNFT(contract, '0xabc');
    expect(contract.addCompatibleDeedNFT).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should remove compatible DeedNFT', async () => {
    await validatorApi.removeCompatibleDeedNFT(contract, '0xabc');
    expect(contract.removeCompatibleDeedNFT).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should set primary DeedNFT', async () => {
    await validatorApi.setPrimaryDeedNFT(contract, '0xabc');
    expect(contract.setPrimaryDeedNFT).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should set asset type support', async () => {
    await validatorApi.setAssetTypeSupport(contract, 1, true);
    expect(contract.setAssetTypeSupport).toHaveBeenCalledWith(1, true);
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should set validation criteria', async () => {
    await validatorApi.setValidationCriteria(contract, 1, ['foo'], '{}', true, false);
    expect(contract.setValidationCriteria).toHaveBeenCalledWith(1, ['foo'], '{}', true, false);
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should get operating agreement name', async () => {
    const result = await validatorApi.operatingAgreementName(contract, 'uri');
    expect(contract.operatingAgreementName).toHaveBeenCalledWith('uri');
    expect(result).toBe('OA Name');
  });
  it('should check asset type support', async () => {
    const result = await validatorApi.supportsAssetType(contract, 1);
    expect(contract.supportsAssetType).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });
  it('should add whitelisted token', async () => {
    await validatorApi.addWhitelistedToken(contract, '0xabc');
    expect(contract.addWhitelistedToken).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should remove whitelisted token', async () => {
    await validatorApi.removeWhitelistedToken(contract, '0xabc');
    expect(contract.removeWhitelistedToken).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should set service fee', async () => {
    await validatorApi.setServiceFee(contract, '0xabc', 100);
    expect(contract.setServiceFee).toHaveBeenCalledWith('0xabc', 100);
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should set fund manager', async () => {
    await validatorApi.setFundManager(contract, '0xabc');
    expect(contract.setFundManager).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should withdraw service fees', async () => {
    await validatorApi.withdrawServiceFees(contract, '0xabc');
    expect(contract.withdrawServiceFees).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should check if token is whitelisted', async () => {
    const result = await validatorApi.isTokenWhitelisted(contract, '0xabc');
    expect(contract.isTokenWhitelisted).toHaveBeenCalledWith('0xabc');
    expect(result).toBe(true);
  });
  it('should get service fee', async () => {
    const result = await validatorApi.getServiceFee(contract, '0xabc');
    expect(contract.getServiceFee).toHaveBeenCalledWith('0xabc');
    expect(result).toBe(100);
  });
  it('should get validation criteria', async () => {
    const result = await validatorApi.getValidationCriteria(contract, 1);
    expect(contract.getValidationCriteria).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      requiredTraits: ['foo'],
      additionalCriteria: '{}',
      requireOperatingAgreement: true,
      requireDefinition: false
    });
  });
  it('should check compatible DeedNFT', async () => {
    const result = await validatorApi.isCompatibleDeedNFT(contract, '0xabc');
    expect(contract.isCompatibleDeedNFT).toHaveBeenCalledWith('0xabc');
    expect(result).toBe(true);
  });
  it('should register operating agreement', async () => {
    await validatorApi.registerOperatingAgreement(contract, 'uri', 'name');
    expect(contract.registerOperatingAgreement).toHaveBeenCalledWith('uri', 'name');
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should validate operating agreement', async () => {
    const result = await validatorApi.validateOperatingAgreement(contract, 'oa');
    expect(contract.validateOperatingAgreement).toHaveBeenCalledWith('oa');
    expect(result).toBe(true);
  });
  it('should get royalty fee percentage', async () => {
    const result = await validatorApi.getRoyaltyFeePercentage(contract, 1);
    expect(contract.getRoyaltyFeePercentage).toHaveBeenCalledWith(1);
    expect(result).toBe(5);
  });
  it('should set royalty fee percentage', async () => {
    await validatorApi.setRoyaltyFeePercentage(contract, 10);
    expect(contract.setRoyaltyFeePercentage).toHaveBeenCalledWith(10);
    expect(txResponse.wait).toHaveBeenCalled();
  });
  it('should get royalty receiver', async () => {
    const result = await validatorApi.getRoyaltyReceiver(contract);
    expect(contract.getRoyaltyReceiver).toHaveBeenCalled();
    expect(result).toBe('0x123');
  });
  it('should set royalty receiver', async () => {
    await validatorApi.setRoyaltyReceiver(contract, '0xabc');
    expect(contract.setRoyaltyReceiver).toHaveBeenCalledWith('0xabc');
    expect(txResponse.wait).toHaveBeenCalled();
  });
}); 