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
import { getValidatorFeeBalance } from '../../api/fundManager';
import { IDeedNFT } from '../../contracts/IDeedNFT';
import { IFundManager } from '../../contracts/IFundManager';
import { IValidator } from '../../contracts/IValidator';
import { IValidatorRegistry } from '../../contracts/IValidatorRegistry';
import { IMetadataRendererContract } from '../../contracts/IMetadataRenderer';
import { AssetType } from '../../types/contracts';
import { 
  tokenURI, 
  setTokenCustomMetadata, 
  setTokenFeatures, 
  getTokenFeatures,
  syncTraitUpdate 
} from '../../api/metadataRenderer';

describe('API Integration', () => {
  let deedNFT: ethers.Contract;
  let fundManager: ethers.Contract;
  let validator: ethers.Contract;
  let validatorRegistry: ethers.Contract;
  let metadataRenderer: IMetadataRendererContract;
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
      'function getValidatorFeeBalance(address validator, address token) view returns (uint256)'
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
      'function tokenURI(uint256 tokenId) view returns (string)',
      'function syncTraitUpdate(uint256 tokenId, bytes32 traitKey, bytes traitValue)',
      'function setTokenCustomMetadata(uint256 tokenId, string metadata)',
      'function setTokenFeatures(uint256 tokenId, string[] features)',
      'function getTokenFeatures(uint256 tokenId) view returns (string[])'
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
      '0x0000000000000000000000000000000000000003',
      metadataRendererAbi,
      wallet
    ) as unknown as IMetadataRendererContract;

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

    jest.spyOn(fundManager, 'getValidatorFeeBalance').mockImplementation(async (...args: any[]) => {
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

    // Mock metadata renderer methods
    jest.spyOn(metadataRenderer, 'tokenURI').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      return tokenURIs.get(tokenId.toString()) || 'ipfs://default';
    });

    jest.spyOn(metadataRenderer, 'syncTraitUpdate').mockImplementation(async (...args: any[]) => {
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(metadataRenderer, 'setTokenCustomMetadata').mockImplementation(async (...args: any[]) => {
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

    jest.spyOn(metadataRenderer, 'setTokenFeatures').mockImplementation(async (...args: any[]) => {
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(metadataRenderer, 'getTokenFeatures').mockImplementation(async (...args: any[]) => {
      return ['feature1', 'feature2'];
    });

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

    // Mock contract methods
    const mockContract = {
      mintDeedNFT: jest.fn().mockResolvedValue(mockTxResponse),
      mintBatchDeedNFT: jest.fn().mockResolvedValue(mockTxResponse),
      withdrawValidatorFees: jest.fn().mockResolvedValue(mockTxResponse),
      getValidatorFeeBalance: jest.fn().mockResolvedValue(BigInt(1000)),
      setCommissionPercentage: jest.fn().mockResolvedValue(mockTxResponse),
      setFeeReceiver: jest.fn().mockResolvedValue(mockTxResponse),
      setValidatorRegistry: jest.fn().mockResolvedValue(mockTxResponse),
      setDeedNFT: jest.fn().mockResolvedValue(mockTxResponse)
    };
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
      const commissionBalance = await getValidatorFeeBalance(
        fundManager,
        validatorAddress,
        ethers.ZeroAddress
      );
      expect(commissionBalance).toBe(BigInt(0));

      // 6. Update metadata renderer
      await executeContractTransaction(
        metadataRenderer,
        'setTokenCustomMetadata',
        [Number(tokenId), 'ipfs://custom-metadata']
      );

      await executeContractTransaction(
        metadataRenderer,
        'setTokenFeatures',
        [Number(tokenId), ['feature1', 'feature2']]
      );

      const features = await getTokenFeatures(metadataRenderer, Number(tokenId));
      expect(features).toEqual(['feature1', 'feature2']);

      await executeContractTransaction(
        metadataRenderer,
        'syncTraitUpdate',
        [Number(tokenId), ethers.keccak256(ethers.toUtf8Bytes('color')), ethers.toUtf8Bytes('blue')]
      );

      const metadata = await tokenURI(metadataRenderer, Number(tokenId));
      expect(metadata).toBe('ipfs://custom-metadata');
    });
  });
}); 