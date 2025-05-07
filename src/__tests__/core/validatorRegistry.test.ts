import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { setupTestEnvironment, TEST_CONFIG, getTestContract } from '../setup';
import { getValidatorInfo, getValidatorOwner, getValidatorsForAssetType, isValidatorActive, isValidatorRegistered, getValidatorName } from '../../api/validatorRegistry';
import { IValidatorRegistry } from '../../contracts/IValidatorRegistry';
import { AssetType } from '../../types/contracts';

describe('ValidatorRegistry API', () => {
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let validatorRegistry: ethers.Contract;
  let validator1: ethers.Wallet;
  let validator2: ethers.Wallet;

  beforeAll(async () => {
    const env = await setupTestEnvironment();
    provider = env.provider;
    signer = env.wallet;

    // Create test wallets
    const privateKey1 = ethers.hexlify(ethers.randomBytes(32));
    const privateKey2 = ethers.hexlify(ethers.randomBytes(32));
    
    validator1 = new ethers.Wallet(privateKey1, provider);
    validator2 = new ethers.Wallet(privateKey2, provider);

    // Initialize contract
    validatorRegistry = await getTestContract(TEST_CONFIG.contracts.validatorRegistry!, IValidatorRegistry.abi);
  });

  describe('Validator Information', () => {
    it('should get validator info', async () => {
      const validatorAddress = await validator1.getAddress();
      const info = await getValidatorInfo(validatorRegistry, validatorAddress);
      expect(info).toBeDefined();
    });

    it('should get validator owner', async () => {
      const validatorAddress = await validator1.getAddress();
      const owner = await getValidatorOwner(validatorRegistry, validatorAddress);
      expect(owner).toBeDefined();
    });

    it('should get validator name', async () => {
      const validatorAddress = await validator1.getAddress();
      const name = await getValidatorName(validatorRegistry, validatorAddress);
      expect(name).toBeDefined();
    });
  });

  describe('Validator Status', () => {
    it('should check if validator is registered', async () => {
      const validatorAddress = await validator1.getAddress();
      const isRegistered = await isValidatorRegistered(validatorRegistry, validatorAddress);
      expect(typeof isRegistered).toBe('boolean');
    });

    it('should check if validator is active', async () => {
      const validatorAddress = await validator1.getAddress();
      const isActive = await isValidatorActive(validatorRegistry, validatorAddress);
      expect(typeof isActive).toBe('boolean');
    });
  });

  describe('Asset Type Validators', () => {
    it('should get validators for asset type', async () => {
      const validators = await getValidatorsForAssetType(validatorRegistry, AssetType.Land);
      expect(Array.isArray(validators)).toBe(true);
    });
  });
}); 