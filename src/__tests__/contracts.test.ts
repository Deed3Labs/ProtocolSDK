import { ethers } from 'ethers';
import { createAllContracts } from '../factories/contracts';
import { deedNFTUtils, fundManagerUtils, validatorUtils, validatorRegistryUtils, metadataRendererUtils } from '../utils/contracts';
import { AssetType } from '../types/contracts';
import { expect, beforeAll, afterAll } from '@jest/globals';
import { setupTestEnvironment, TEST_CONFIG, waitForTransaction, getTestContract } from './setup';
import { mintAsset, burnAsset, transferFrom } from '../api/deedNFT';
import { IDeedNFT } from '../contracts/IDeedNFT';
import { IFundManager } from '../contracts/IFundManager';
import { IValidator } from '../contracts/IValidator';
import { IValidatorRegistry } from '../contracts/IValidatorRegistry';
import { IMetadataRenderer } from '../contracts/IMetadataRenderer';

describe('Contract Interactions', () => {
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let contracts: ReturnType<typeof createAllContracts>;
  let wallet: ethers.Wallet;
  let transactionManager: any;
  let deedNFTContract: ethers.Contract;
  let deedNFT: ethers.Contract;
  let fundManager: ethers.Contract;
  let validator: ethers.Contract;
  let validatorRegistry: ethers.Contract;
  let metadataRenderer: ethers.Contract;

  beforeAll(async () => {
    const env = await setupTestEnvironment();
    provider = env.provider;
    signer = env.wallet;
    contracts = createAllContracts(TEST_CONFIG.contracts, signer);
    wallet = env.wallet;
    transactionManager = env.transactionManager;

    // Initialize contract
    deedNFTContract = new ethers.Contract(
      TEST_CONFIG.contracts.deedNFT!,
      [], // Add your contract ABI here
      wallet
    );

    // Initialize contracts
    deedNFT = await getTestContract(TEST_CONFIG.contracts.deedNFT!, IDeedNFT.abi);
    fundManager = await getTestContract(TEST_CONFIG.contracts.fundManager!, IFundManager.abi);
    validator = await getTestContract(TEST_CONFIG.contracts.validator!, IValidator.abi);
    validatorRegistry = await getTestContract(TEST_CONFIG.contracts.validatorRegistry!, IValidatorRegistry.abi);
    metadataRenderer = await getTestContract(TEST_CONFIG.contracts.metadataRenderer!, IMetadataRenderer.abi);
  });

  describe('DeedNFT', () => {
    it('should mint a new token', async () => {
      const owner = await signer.getAddress();
      const tokenId = await deedNFTUtils.mintAsset(
        contracts.deedNFT,
        owner,
        AssetType.Land,
        'ipfs://...',
        'Definition',
        'Configuration',
        '0x...', // Validator address
        ethers.toBigInt(1)
      );

      expect(tokenId).toBeDefined();
    });

    it('should transfer a token', async () => {
      const from = await signer.getAddress();
      const to = '0x...'; // Recipient address
      const tokenId = ethers.toBigInt(1);

      const tx = await deedNFTUtils.transferFrom(
        contracts.deedNFT,
        from,
        to,
        tokenId
      );

      expect(tx).toBeDefined();
    });

    it('should mint a new asset', async () => {
      const owner = await wallet.getAddress();
      const assetType = 1;
      const ipfsDetailsHash = 'QmTest123';
      const definition = 'Test Definition';
      const configuration = 'Test Configuration';
      const validatorAddress = TEST_CONFIG.contracts.validator;
      const salt = 1;

      const result = await mintAsset(
        deedNFTContract,
        owner,
        assetType,
        ipfsDetailsHash,
        definition,
        configuration,
        validatorAddress,
        salt,
        transactionManager
      );

      expect(result.status).toBe('confirmed');
      expect(result.receipt).toBeDefined();
    });

    it('should transfer an asset', async () => {
      const from = await wallet.getAddress();
      const to = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Test recipient
      const tokenId = 1;

      const result = await transferFrom(
        deedNFTContract,
        from,
        to,
        tokenId,
        transactionManager
      );

      expect(result.status).toBe('confirmed');
      expect(result.receipt).toBeDefined();
    });

    it('should burn an asset', async () => {
      const tokenId = 1;

      const result = await burnAsset(
        deedNFTContract,
        tokenId,
        transactionManager
      );

      expect(result.status).toBe('confirmed');
      expect(result.receipt).toBeDefined();
    });

    it('should mint a new deed', async () => {
      const tx = await deedNFT.mintAsset(
        wallet.address,
        'ASSET_TYPE',
        'IPFS_HASH',
        'DEFINITION',
        'CONFIGURATION',
        validator.address,
        'SALT'
      );
      
      const receipt = await waitForTransaction(tx.hash);
      expect(receipt.status).toBe(1);
    });

    it('should transfer a deed', async () => {
      const tokenId = 1;
      const newOwner = ethers.Wallet.createRandom().address;
      
      const tx = await deedNFT.transferFrom(
        wallet.address,
        newOwner,
        tokenId
      );
      
      const receipt = await waitForTransaction(tx.hash);
      expect(receipt.status).toBe(1);
    });
  });

  describe('FundManager', () => {
    it('should mint a token through fund manager', async () => {
      const owner = await signer.getAddress();
      const tx = await fundManagerUtils.mintDeedNFT(
        contracts.fundManager,
        owner,
        AssetType.Land,
        'ipfs://...',
        'Definition',
        'Configuration',
        '0x...' // Validator address
      );

      expect(tx).toBeDefined();
    });

    it('should withdraw validator fees', async () => {
      const tx = await fundManagerUtils.withdrawValidatorFees(
        contracts.fundManager,
        '0x...', // Validator address
        '0x...' // Token address
      );

      expect(tx).toBeDefined();
    });

    it('should withdraw fees', async () => {
      const tx = await fundManager.withdrawFees();
      const receipt = await waitForTransaction(tx.hash);
      expect(receipt.status).toBe(1);
    });
  });

  describe('Validator', () => {
    it('should validate a deed', async () => {
      const tokenId = 1;
      const tx = await validator.validateDeed(tokenId);
      const receipt = await waitForTransaction(tx.hash);
      expect(receipt.status).toBe(1);
    });

    it('should set validation criteria', async () => {
      const criteria = {
        minAmount: ethers.parseEther('1'),
        maxAmount: ethers.parseEther('10'),
        requiredDocuments: ['DOC1', 'DOC2'],
      };
      
      const tx = await validator.setValidationCriteria(
        criteria.minAmount,
        criteria.maxAmount,
        criteria.requiredDocuments
      );
      
      const receipt = await waitForTransaction(tx.hash);
      expect(receipt.status).toBe(1);
    });
  });

  describe('ValidatorRegistry', () => {
    it('should get validator info', async () => {
      const info = await validatorRegistry.getValidatorInfo(validator.address);
      expect(info).toBeDefined();
    });

    it('should get validators for asset type', async () => {
      const validators = await validatorRegistryUtils.getValidatorsForAssetType(
        contracts.validatorRegistry,
        1 // Asset type ID
      );

      expect(Array.isArray(validators)).toBe(true);
    });
  });

  describe('MetadataRenderer', () => {
    it('should set asset condition', async () => {
      const tx = await metadataRendererUtils.setAssetCondition(
        contracts.metadataRenderer,
        ethers.toBigInt(1),
        'Good',
        '2023-01-01',
        'None',
        'Recent maintenance',
        'No issues'
      );

      expect(tx).toBeDefined();
    });

    it('should set token legal info', async () => {
      const tx = await metadataRendererUtils.setTokenLegalInfo(
        contracts.metadataRenderer,
        ethers.toBigInt(1),
        'US',
        '12345',
        '2023-01-01',
        ['doc1', 'doc2'],
        ['restriction1', 'restriction2'],
        'Additional legal info'
      );

      expect(tx).toBeDefined();
    });

    it('should update metadata', async () => {
      const tokenId = 1;
      const newMetadata = 'NEW_METADATA';
      
      const tx = await metadataRenderer.updateMetadata(tokenId, newMetadata);
      const receipt = await waitForTransaction(tx.hash);
      expect(receipt.status).toBe(1);
    });
  });
}); 