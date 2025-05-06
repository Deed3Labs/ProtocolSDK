import { ethers } from 'ethers';
import { createAllContracts } from '../factories/contracts';
import { deedNFTUtils, fundManagerUtils, validatorUtils, validatorRegistryUtils, metadataRendererUtils } from '../utils/contracts';
import { AssetType } from '../types/contracts';
import { expect, beforeAll } from '@jest/globals';

describe('Contract Interactions', () => {
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let contracts: ReturnType<typeof createAllContracts>;

  beforeAll(async () => {
    // Set up provider and signer
    provider = new ethers.JsonRpcProvider('http://localhost:8545');
    signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);

    // Deploy contracts or use existing addresses
    const addresses = {
      deedNFT: '0x...', // Replace with actual address
      fundManager: '0x...', // Replace with actual address
      validator: '0x...', // Replace with actual address
      validatorRegistry: '0x...', // Replace with actual address
      metadataRenderer: '0x...', // Replace with actual address
    };

    contracts = createAllContracts(addresses, signer);
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
  });

  describe('Validator', () => {
    it('should validate a deed', async () => {
      const tx = await validatorUtils.validateDeed(
        contracts.validator,
        ethers.toBigInt(1)
      );

      expect(tx).toBeDefined();
    });

    it('should set validation criteria', async () => {
      const tx = await validatorUtils.setValidationCriteria(
        contracts.validator,
        1, // Asset type ID
        ['trait1', 'trait2'], // Required traits
        'Additional criteria', // Additional criteria
        true, // Require operating agreement
        true // Require definition
      );

      expect(tx).toBeDefined();
    });
  });

  describe('ValidatorRegistry', () => {
    it('should get validator info', async () => {
      const info = await validatorRegistryUtils.getValidatorInfo(
        contracts.validatorRegistry,
        '0x...' // Validator address
      );

      expect(info).toBeDefined();
      expect(info.owner).toBeDefined();
      expect(info.name).toBeDefined();
      expect(info.isActive).toBeDefined();
      expect(info.supportedAssetTypes).toBeDefined();
      expect(info.commissionPercentage).toBeDefined();
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
  });
}); 