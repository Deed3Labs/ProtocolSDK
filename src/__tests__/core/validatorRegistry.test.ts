// Add BigInt serialization support
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { provider, wallet, TEST_CONFIG, executeContractTransaction } from '../setup';
import { getValidatorInfo, getValidatorOwner, getValidatorsForAssetType, isValidatorActive, isValidatorRegistered, getValidatorName } from '../../api/validatorRegistry';
import { IValidatorRegistry } from '../../contracts/IValidatorRegistry';
import { AssetType } from '../../types/contracts';

describe('ValidatorRegistry API', () => {
  let validatorRegistry: ethers.Contract;
  let validator1: ethers.Wallet;
  let validator2: ethers.Wallet;

  beforeAll(async () => {
    // Create test wallets
    const privateKey1 = ethers.hexlify(ethers.randomBytes(32));
    const privateKey2 = ethers.hexlify(ethers.randomBytes(32));
    
    validator1 = new ethers.Wallet(privateKey1, provider);
    validator2 = new ethers.Wallet(privateKey2, provider);

    // Initialize contract with proper ABI
    const validatorRegistryAbi = [
      'function getValidatorInfo(address validator) view returns (tuple(string name, bool active))',
      'function getValidatorOwner(address validator) view returns (address)',
      'function getValidatorName(address validator) view returns (string)',
      'function isValidatorRegistered(address validator) view returns (bool)',
      'function isValidatorActive(address validator) view returns (bool)',
      'function getValidatorsForAssetType(uint8 assetType) view returns (address[])',
      'function registerValidator(address validator, string name)',
      'function setValidatorActive(address validator, bool active)',
      'function addValidatorForAssetType(address validator, uint8 assetType)',
      'function removeValidatorForAssetType(address validator, uint8 assetType)'
    ];

    validatorRegistry = new ethers.Contract(
      TEST_CONFIG.contracts.validatorRegistry!,
      validatorRegistryAbi,
      wallet
    );

    // Track state
    const validatorStates = new Map<string, {
      name: string;
      active: boolean;
      owner: string;
      registered: boolean;
    }>();

    const assetTypeValidators = new Map<number, Set<string>>();

    // Initialize state for test validators
    const initializeValidator = async (validator: ethers.Wallet, name: string) => {
      const address = await validator.getAddress();
      validatorStates.set(address, {
        name,
        active: true,
        owner: await wallet.getAddress(),
        registered: true
      });
    };

    await initializeValidator(validator1, 'Test Validator 1');
    await initializeValidator(validator2, 'Test Validator 2');

    // Add validators to Land asset type
    const landValidators = new Set<string>();
    landValidators.add(await validator1.getAddress());
    landValidators.add(await validator2.getAddress());
    assetTypeValidators.set(AssetType.Land, landValidators);

    // Mock contract methods
    jest.spyOn(validatorRegistry, 'getValidatorInfo').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator) || { name: '', active: false };
      return {
        name: state.name,
        active: state.active
      };
    });

    jest.spyOn(validatorRegistry, 'getValidatorOwner').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.owner || ethers.ZeroAddress;
    });

    jest.spyOn(validatorRegistry, 'getValidatorName').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.name || '';
    });

    jest.spyOn(validatorRegistry, 'isValidatorRegistered').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.registered || false;
    });

    jest.spyOn(validatorRegistry, 'isValidatorActive').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.active || false;
    });

    jest.spyOn(validatorRegistry, 'getValidatorsForAssetType').mockImplementation(async (...args: any[]) => {
      const [assetType] = args;
      const validators = assetTypeValidators.get(assetType);
      return validators ? Array.from(validators) : [];
    });

    jest.spyOn(validatorRegistry, 'registerValidator').mockImplementation(async (...args: any[]) => {
      const [validator, name] = args;
      validatorStates.set(validator, {
        name,
        active: true,
        owner: await wallet.getAddress(),
        registered: true
      });
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(validatorRegistry, 'setValidatorActive').mockImplementation(async (...args: any[]) => {
      const [validator, active] = args;
      const state = validatorStates.get(validator);
      if (state) {
        state.active = active;
        validatorStates.set(validator, state);
      }
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(validatorRegistry, 'addValidatorForAssetType').mockImplementation(async (...args: any[]) => {
      const [validator, assetType] = args;
      let validators = assetTypeValidators.get(assetType);
      if (!validators) {
        validators = new Set<string>();
        assetTypeValidators.set(assetType, validators);
      }
      validators.add(validator);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(validatorRegistry, 'removeValidatorForAssetType').mockImplementation(async (...args: any[]) => {
      const [validator, assetType] = args;
      const validators = assetTypeValidators.get(assetType);
      if (validators) {
        validators.delete(validator);
      }
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });
  });

  describe('Validator Information', () => {
    it('should get validator info', async () => {
      const validatorAddress = await validator1.getAddress();
      const info = await getValidatorInfo(validatorRegistry, validatorAddress);
      expect(info.name).toBe('Test Validator 1');
      expect(info.active).toBe(true);
    });

    it('should get validator owner', async () => {
      const validatorAddress = await validator1.getAddress();
      const owner = await getValidatorOwner(validatorRegistry, validatorAddress);
      expect(owner).toBe(await wallet.getAddress());
    });

    it('should get validator name', async () => {
      const validatorAddress = await validator1.getAddress();
      const name = await getValidatorName(validatorRegistry, validatorAddress);
      expect(name).toBe('Test Validator 1');
    });
  });

  describe('Validator Status', () => {
    it('should check if validator is registered', async () => {
      const validatorAddress = await validator1.getAddress();
      const isRegistered = await isValidatorRegistered(validatorRegistry, validatorAddress);
      expect(isRegistered).toBe(true);
    });

    it('should check if validator is active', async () => {
      const validatorAddress = await validator1.getAddress();
      const isActive = await isValidatorActive(validatorRegistry, validatorAddress);
      expect(isActive).toBe(true);
    });

    it('should update validator active status', async () => {
      const validatorAddress = await validator1.getAddress();
      
      await executeContractTransaction(
        validatorRegistry,
        'setValidatorActive',
        [validatorAddress, false]
      );
      
      const isActive = await isValidatorActive(validatorRegistry, validatorAddress);
      expect(isActive).toBe(false);
    });
  });

  describe('Asset Type Validators', () => {
    it('should get validators for asset type', async () => {
      const validators = await getValidatorsForAssetType(validatorRegistry, AssetType.Land);
      expect(validators).toContain(await validator1.getAddress());
      expect(validators).toContain(await validator2.getAddress());
    });

    it('should add and remove validator for asset type', async () => {
      const validatorAddress = await validator1.getAddress();
      
      await executeContractTransaction(
        validatorRegistry,
        'removeValidatorForAssetType',
        [validatorAddress, AssetType.Land]
      );
      
      let validators = await getValidatorsForAssetType(validatorRegistry, AssetType.Land);
      expect(validators).not.toContain(validatorAddress);
      
      await executeContractTransaction(
        validatorRegistry,
        'addValidatorForAssetType',
        [validatorAddress, AssetType.Land]
      );
      
      validators = await getValidatorsForAssetType(validatorRegistry, AssetType.Land);
      expect(validators).toContain(validatorAddress);
    });
  });
}); 