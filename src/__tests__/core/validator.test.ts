import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { setupTestEnvironment, TEST_CONFIG, getTestContract } from '../setup';
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

describe('Validator API', () => {
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let validator: ethers.Contract;
  let transactionManager: TransactionManager;
  let user1: ethers.Wallet;

  beforeAll(async () => {
    const env = await setupTestEnvironment();
    provider = env.provider;
    signer = env.wallet;
    transactionManager = new TransactionManager(provider);

    // Create test wallet
    const privateKey = ethers.hexlify(ethers.randomBytes(32));
    user1 = new ethers.Wallet(privateKey, provider);

    // Initialize contract
    validator = await getTestContract(TEST_CONFIG.contracts.validator!, IValidator.abi);
  });

  describe('Deed Validation', () => {
    it('should validate a deed', async () => {
      const tokenId = 1;
      const result = await validateDeed(validator, tokenId);
      expect(typeof result).toBe('boolean');
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
      const assetTypeId = 1;
      const requiredTraits = ['trait1', 'trait2'];
      const additionalCriteria = '{"minValue": "1000000"}';
      const requireOperatingAgreement = true;
      const requireDefinition = true;

      await setValidationCriteria(
        validator,
        assetTypeId,
        requiredTraits,
        additionalCriteria,
        requireOperatingAgreement,
        requireDefinition
      );

      const [retrievedTraits, retrievedCriteria, retrievedRequireAgreement, retrievedRequireDefinition] = 
        await getValidationCriteria(validator, assetTypeId);
      expect(retrievedTraits).toEqual(requiredTraits);
      expect(retrievedCriteria).toBe(additionalCriteria);
      expect(retrievedRequireAgreement).toBe(requireOperatingAgreement);
      expect(retrievedRequireDefinition).toBe(requireDefinition);
    });
  });

  describe('Operating Agreement Management', () => {
    it('should register operating agreement', async () => {
      const uri = 'ipfs://agreement1';
      const name = 'Test Agreement';
      await registerOperatingAgreement(validator, uri, name);
      const result = await operatingAgreementName(validator, uri);
      expect(result).toBe(name);
    });

    it('should get default operating agreement', async () => {
      const result = await defaultOperatingAgreement(validator);
      expect(typeof result).toBe('string');
    });
  });

  describe('Token Management', () => {
    it('should manage whitelisted tokens', async () => {
      const token = await user1.getAddress();
      
      await addWhitelistedToken(validator, token);
      expect(await isTokenWhitelisted(validator, token)).toBe(true);
      
      await removeWhitelistedToken(validator, token);
      expect(await isTokenWhitelisted(validator, token)).toBe(false);
    });

    it('should manage service fees', async () => {
      const token = await user1.getAddress();
      const fee = 500; // 5%
      
      await setServiceFee(validator, token, fee);
      expect(await getServiceFee(validator, token)).toBe(fee);
      
      await withdrawServiceFees(validator, token);
    });
  });

  describe('Royalty Management', () => {
    it('should manage royalty settings', async () => {
      const percentage = 250; // 2.5%
      const receiver = await user1.getAddress();
      
      await setRoyaltyFeePercentage(validator, percentage);
      expect(await getRoyaltyFeePercentage(validator, 1)).toBe(percentage);
      
      await setRoyaltyReceiver(validator, receiver);
      expect(await getRoyaltyReceiver(validator)).toBe(receiver);
    });
  });

  describe('DeedNFT Management', () => {
    it('should manage compatible DeedNFTs', async () => {
      const deedNFT = await user1.getAddress();
      
      await setPrimaryDeedNFT(validator, deedNFT);
      await addCompatibleDeedNFT(validator, deedNFT);
      expect(await isCompatibleDeedNFT(validator, deedNFT)).toBe(true);
      
      await removeCompatibleDeedNFT(validator, deedNFT);
      expect(await isCompatibleDeedNFT(validator, deedNFT)).toBe(false);
    });
  });
}); 