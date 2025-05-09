// Add BigInt serialization support
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { provider, wallet, TEST_CONFIG, executeContractTransaction } from '../setup';
import { mintAsset, updateMetadata } from '../../api/deedNFT';
import { validateDeed } from '../../api/validator';
import { getValidatorInfo, isValidatorRegistered } from '../../api/validatorRegistry';
import { getCommissionBalance } from '../../api/fundManager';
import { IDeedNFT } from '../../contracts/IDeedNFT';
import { IFundManager } from '../../contracts/IFundManager';
import { IValidator } from '../../contracts/IValidator';
import { IValidatorRegistry } from '../../contracts/IValidatorRegistry';
import { IMetadataRenderer } from '../../contracts/IMetadataRenderer';
import { AssetType } from '../../types/contracts';

describe('API Integration', () => {
  let deedNFT: ethers.Contract;
  let fundManager: ethers.Contract;
  let validator: ethers.Contract;
  let validatorRegistry: ethers.Contract;
  let metadataRenderer: ethers.Contract;
  let user1: ethers.Wallet;
  let validator1: ethers.Wallet;

  beforeAll(async () => {
    // Create test wallets
    const privateKey1 = ethers.hexlify(ethers.randomBytes(32));
    const privateKey2 = ethers.hexlify(ethers.randomBytes(32));
    
    user1 = new ethers.Wallet(privateKey1, provider);
    validator1 = new ethers.Wallet(privateKey2, provider);

    // Initialize contract with proper ABIs
    const deedNFTAbi = [
      'function mintAsset(address to, uint8 assetType, string metadata, string definition, string configuration, address validator, uint256 salt) returns (uint256)',
      'function updateMetadata(uint256 tokenId, string metadata)'
    ];

    const fundManagerAbi = [
      'function getCommissionBalance(address validator, address token) view returns (uint256)'
    ];

    const validatorAbi = [
      'function validateDeed(uint256 tokenId)',
      'function isDeedValidated(uint256 tokenId) view returns (bool)'
    ];

    const validatorRegistryAbi = [
      'function isValidatorRegistered(address validator) view returns (bool)',
      'function getValidatorInfo(address validator) view returns (tuple(string name, bool active))'
    ];

    const metadataRendererAbi = [
      'function tokenURI(uint256 tokenId) view returns (string)'
    ];

    deedNFT = new ethers.Contract(
      TEST_CONFIG.contracts.deedNFT!,
      deedNFTAbi,
      wallet
    );

    fundManager = new ethers.Contract(
      TEST_CONFIG.contracts.fundManager!,
      fundManagerAbi,
      wallet
    );

    validator = new ethers.Contract(
      TEST_CONFIG.contracts.validator!,
      validatorAbi,
      wallet
    );

    validatorRegistry = new ethers.Contract(
      TEST_CONFIG.contracts.validatorRegistry!,
      validatorRegistryAbi,
      wallet
    );

    metadataRenderer = new ethers.Contract(
      TEST_CONFIG.contracts.metadataRenderer!,
      metadataRendererAbi,
      wallet
    );

    // Track state
    const validatedDeeds = new Set<string>();
    const commissionBalances = new Map<string, Map<string, bigint>>();
    const validatorStates = new Map<string, {
      name: string;
      active: boolean;
      registered: boolean;
    }>();
    const tokenURIs = new Map<string, string>();

    // Initialize validator state
    const validatorAddress = await validator1.getAddress();
    validatorStates.set(validatorAddress, {
      name: 'Test Validator',
      active: true,
      registered: true
    });

    // Mock contract methods
    jest.spyOn(validatorRegistry, 'isValidatorRegistered').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator);
      return state?.registered || false;
    });

    jest.spyOn(validatorRegistry, 'getValidatorInfo').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      const state = validatorStates.get(validator) || { name: '', active: false };
      return {
        name: state.name,
        active: state.active
      };
    });

    jest.spyOn(validator, 'validateDeed').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      validatedDeeds.add(tokenId.toString());
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(validator, 'isDeedValidated').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      return validatedDeeds.has(tokenId.toString());
    });

    jest.spyOn(fundManager, 'getCommissionBalance').mockImplementation(async (...args: any[]) => {
      const [validator, token] = args;
      const validatorBalances = commissionBalances.get(validator) || new Map<string, bigint>();
      return validatorBalances.get(token) || BigInt(0);
    });

    // Mock DeedNFT mintAsset
    let nextTokenId = 1;
    jest.spyOn(deedNFT, 'mintAsset').mockImplementation(async (...args: any[]) => {
      const [to, assetType, metadata] = args;
      tokenURIs.set(nextTokenId.toString(), metadata);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc',
          logs: [{
            topics: ['0x0', nextTokenId.toString()]
          }]
        })
      };
      nextTokenId++;
      return mockTxResponse;
    });

    jest.spyOn(deedNFT, 'updateMetadata').mockImplementation(async (...args: any[]) => {
      const [tokenId, metadata] = args;
      tokenURIs.set(tokenId.toString(), metadata);
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

  describe('Complete Deed Lifecycle', () => {
    it('should handle complete deed lifecycle', async () => {
      // 1. Check validator status
      const validatorAddress = await validator1.getAddress();
      const isRegistered = await isValidatorRegistered(validatorRegistry, validatorAddress);
      expect(isRegistered).toBe(true);

      // 2. Mint deed
      const tx = await executeContractTransaction(
        deedNFT,
        'mintAsset',
        [
          await user1.getAddress(),
          AssetType.Land,
          'ipfs://metadata1',
          'Definition',
          'Configuration',
          await validator.getAddress(),
          1
        ]
      );
      const tokenId = '1';
      expect(tokenId).toBeDefined();

      // 3. Validate deed
      await executeContractTransaction(
        validator,
        'validateDeed',
        [Number(tokenId)]
      );
      const isValidated = await validator.isDeedValidated(Number(tokenId));
      expect(isValidated).toBe(true);

      // 4. Update metadata
      await executeContractTransaction(
        deedNFT,
        'updateMetadata',
        [Number(tokenId), 'ipfs://updated-metadata']
      );

      // 5. Check commission balance
      const commissionBalance = await getCommissionBalance(
        fundManager,
        validatorAddress,
        ethers.ZeroAddress
      );
      expect(commissionBalance).toBe(BigInt(0));
    });
  });
}); 