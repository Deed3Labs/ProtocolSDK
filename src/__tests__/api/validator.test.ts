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

describe('Validator API', () => {
  let contract: ethers.Contract;
  const validAddress = '0x1234567890123456789012345678901234567890';
  const validIpfsHash = 'QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';

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

  describe('Validation Functions', () => {
    it('should validate deed successfully', async () => {
      const result = await validateDeed(contract, 1);
      expect(result).toBe(true);
      expect(contract.validateDeed).toHaveBeenCalledWith(1);
    });

    it('should validate operating agreement successfully', async () => {
      const result = await validateOperatingAgreement(contract, validIpfsHash);
      expect(result).toBe(true);
      expect(contract.validateOperatingAgreement).toHaveBeenCalledWith(validIpfsHash);
    });

    it('should get validation criteria successfully', async () => {
      const result = await getValidationCriteria(contract, 1);
      expect(result).toEqual([['trait1', 'trait2'], 'criteria', true, true]);
      expect(contract.getValidationCriteria).toHaveBeenCalledWith(1);
    });

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

  describe('Operating Agreement Functions', () => {
    it('should register operating agreement successfully', async () => {
      await registerOperatingAgreement(contract, validIpfsHash, 'Test Agreement');
      expect(contract.registerOperatingAgreement).toHaveBeenCalledWith(validIpfsHash, 'Test Agreement');
    });

    it('should get operating agreement name successfully', async () => {
      const result = await operatingAgreementName(contract, validIpfsHash);
      expect(result).toBe('Test Agreement');
      expect(contract.operatingAgreementName).toHaveBeenCalledWith(validIpfsHash);
    });

    it('should get default operating agreement successfully', async () => {
      const result = await defaultOperatingAgreement(contract);
      expect(result).toBe(validIpfsHash);
      expect(contract.defaultOperatingAgreement).toHaveBeenCalled();
    });
  });

  describe('Token Management Functions', () => {
    it('should add whitelisted token successfully', async () => {
      await addWhitelistedToken(contract, validAddress);
      expect(contract.addWhitelistedToken).toHaveBeenCalledWith(validAddress);
    });

    it('should remove whitelisted token successfully', async () => {
      await removeWhitelistedToken(contract, validAddress);
      expect(contract.removeWhitelistedToken).toHaveBeenCalledWith(validAddress);
    });

    it('should check if token is whitelisted successfully', async () => {
      const result = await isTokenWhitelisted(contract, validAddress);
      expect(result).toBe(true);
      expect(contract.isTokenWhitelisted).toHaveBeenCalledWith(validAddress);
    });
  });

  describe('Fee Management Functions', () => {
    it('should get service fee successfully', async () => {
      const result = await getServiceFee(contract, validAddress);
      expect(result).toBe(100);
      expect(contract.getServiceFee).toHaveBeenCalledWith(validAddress);
    });

    it('should set service fee successfully', async () => {
      await setServiceFee(contract, validAddress, 200);
      expect(contract.setServiceFee).toHaveBeenCalledWith(validAddress, 200);
    });

    it('should withdraw service fees successfully', async () => {
      await withdrawServiceFees(contract, validAddress);
      expect(contract.withdrawServiceFees).toHaveBeenCalledWith(validAddress);
    });
  });

  describe('Royalty Management Functions', () => {
    it('should get royalty fee percentage successfully', async () => {
      const result = await getRoyaltyFeePercentage(contract, 1);
      expect(result).toBe(250);
      expect(contract.getRoyaltyFeePercentage).toHaveBeenCalledWith(1);
    });

    it('should set royalty fee percentage successfully', async () => {
      await setRoyaltyFeePercentage(contract, 300);
      expect(contract.setRoyaltyFeePercentage).toHaveBeenCalledWith(300);
    });

    it('should get royalty receiver successfully', async () => {
      const result = await getRoyaltyReceiver(contract);
      expect(result).toBe(validAddress);
      expect(contract.getRoyaltyReceiver).toHaveBeenCalled();
    });

    it('should set royalty receiver successfully', async () => {
      await setRoyaltyReceiver(contract, validAddress);
      expect(contract.setRoyaltyReceiver).toHaveBeenCalledWith(validAddress);
    });
  });

  describe('DeedNFT Management Functions', () => {
    it('should set primary DeedNFT successfully', async () => {
      await setPrimaryDeedNFT(contract, validAddress);
      expect(contract.setPrimaryDeedNFT).toHaveBeenCalledWith(validAddress);
    });

    it('should add compatible DeedNFT successfully', async () => {
      await addCompatibleDeedNFT(contract, validAddress);
      expect(contract.addCompatibleDeedNFT).toHaveBeenCalledWith(validAddress);
    });

    it('should remove compatible DeedNFT successfully', async () => {
      await removeCompatibleDeedNFT(contract, validAddress);
      expect(contract.removeCompatibleDeedNFT).toHaveBeenCalledWith(validAddress);
    });

    it('should check if DeedNFT is compatible successfully', async () => {
      const result = await isCompatibleDeedNFT(contract, validAddress);
      expect(result).toBe(true);
      expect(contract.isCompatibleDeedNFT).toHaveBeenCalledWith(validAddress);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors', async () => {
      jest.spyOn(contract, 'validateDeed').mockRejectedValue(new Error('Validation failed'));
      await expect(validateDeed(contract, 1)).rejects.toThrow('Validation failed');
    });

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