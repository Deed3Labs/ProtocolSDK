/**
 * @file ValidatorRegistry Core Test Suite
 * @description This test suite verifies the core functionality of the ValidatorRegistry contract.
 * It tests the fundamental validator registration operations, state management, and event emissions.
 * The suite uses mocked contract methods to simulate blockchain interactions.
 * 
 * @module ValidatorRegistryCoreTest
 */

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

/**
 * @description Test suite for the ValidatorRegistry contract API
 */
describe('ValidatorRegistry API', () => {
  let validatorRegistry: ethers.Contract;
  let validator1: ethers.Wallet;
  let validator2: ethers.Wallet;

  /**
   * @description Sets up the test environment before all tests
   * - Creates test wallets
   * - Initializes contract with ABI
   * - Sets up mock contract methods
   * - Configures state tracking for validators and asset types
   */
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

    /**
     * @description Initializes a validator with default state
     * @param validator - The validator wallet
     * @param name - The validator name
     */
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

    /**
     * @description Mocks the getValidatorInfo function to simulate retrieving validator information
     * @param args - Array of arguments containing the validator address
     * @returns Mock validator info object
     */
    jest.spyOn(validatorRegistry, 'getValidatorInfo').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator) || { name: '', active: false };
      return {
        name: state.name,
        active: state.active
      };
    });

    /**
     * @description Mocks the getValidatorOwner function to simulate retrieving validator owner
     * @param args - Array of arguments containing the validator address
     * @returns Mock validator owner address
     */
    jest.spyOn(validatorRegistry, 'getValidatorOwner').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.owner || ethers.ZeroAddress;
    });

    /**
     * @description Mocks the getValidatorName function to simulate retrieving validator name
     * @param args - Array of arguments containing the validator address
     * @returns Mock validator name
     */
    jest.spyOn(validatorRegistry, 'getValidatorName').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.name || '';
    });

    /**
     * @description Mocks the isValidatorRegistered function to simulate checking registration status
     * @param args - Array of arguments containing the validator address
     * @returns Mock registration status
     */
    jest.spyOn(validatorRegistry, 'isValidatorRegistered').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.registered || false;
    });

    /**
     * @description Mocks the isValidatorActive function to simulate checking active status
     * @param args - Array of arguments containing the validator address
     * @returns Mock active status
     */
    jest.spyOn(validatorRegistry, 'isValidatorActive').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.active || false;
    });

    /**
     * @description Mocks the getValidatorsForAssetType function to simulate retrieving validators for an asset type
     * @param args - Array of arguments containing the asset type
     * @returns Mock array of validator addresses
     */
    jest.spyOn(validatorRegistry, 'getValidatorsForAssetType').mockImplementation(async (...args: any[]) => {
      const [assetType] = args;
      const validators = assetTypeValidators.get(assetType);
      return validators ? Array.from(validators) : [];
    });

    /**
     * @description Mocks the registerValidator function to simulate registering a new validator
     * @param args - Array of arguments containing validator address and name
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the setValidatorActive function to simulate updating validator active status
     * @param args - Array of arguments containing validator address and active status
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the addValidatorForAssetType function to simulate adding a validator to an asset type
     * @param args - Array of arguments containing validator address and asset type
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the removeValidatorForAssetType function to simulate removing a validator from an asset type
     * @param args - Array of arguments containing validator address and asset type
     * @returns Mock transaction response
     */
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

  /**
   * @description Test suite for validator information retrieval operations
   */
  describe('Validator Information', () => {
    /**
     * @description Tests retrieving validator information including name and active status
     */
    it('should get validator info', async () => {
      const validatorAddress = await validator1.getAddress();
      const info = await getValidatorInfo(validatorRegistry, validatorAddress);
      expect(info.name).toBe('Test Validator 1');
      expect(info.active).toBe(true);
    });

    /**
     * @description Tests retrieving validator owner address
     */
    it('should get validator owner', async () => {
      const validatorAddress = await validator1.getAddress();
      const owner = await getValidatorOwner(validatorRegistry, validatorAddress);
      expect(owner).toBe(await wallet.getAddress());
    });

    /**
     * @description Tests retrieving validator name
     */
    it('should get validator name', async () => {
      const validatorAddress = await validator1.getAddress();
      const name = await getValidatorName(validatorRegistry, validatorAddress);
      expect(name).toBe('Test Validator 1');
    });
  });

  /**
   * @description Test suite for validator status management operations
   */
  describe('Validator Status', () => {
    /**
     * @description Tests checking if a validator is registered
     */
    it('should check if validator is registered', async () => {
      const validatorAddress = await validator1.getAddress();
      const isRegistered = await isValidatorRegistered(validatorRegistry, validatorAddress);
      expect(isRegistered).toBe(true);
    });

    /**
     * @description Tests checking if a validator is active
     */
    it('should check if validator is active', async () => {
      const validatorAddress = await validator1.getAddress();
      const isActive = await isValidatorActive(validatorRegistry, validatorAddress);
      expect(isActive).toBe(true);
    });

    /**
     * @description Tests updating a validator's active status
     */
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

  /**
   * @description Test suite for asset type validator operations
   */
  describe('Asset Type Validators', () => {
    /**
     * @description Tests retrieving validators for a specific asset type
     */
    it('should get validators for asset type', async () => {
      const validators = await getValidatorsForAssetType(validatorRegistry, AssetType.Land);
      expect(validators).toContain(await validator1.getAddress());
      expect(validators).toContain(await validator2.getAddress());
    });

    /**
     * @description Tests adding and removing a validator for an asset type
     */
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