import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { setupTestEnvironment, TEST_CONFIG, getTestContract } from '../setup';
import { 
  mintAsset,
  burnAsset,
  burnBatchAssets,
  transferFrom,
  safeTransferFrom,
  updateMetadata,
  tokenURI,
  updateValidationStatus,
  addMinter,
  removeMinter,
  hasRole,
  setApprovedMarketplace,
  isApprovedMarketplace,
  setRoyaltyEnforcement,
  isRoyaltyEnforced,
  getTransferValidator,
  setTransferValidator
} from '../../api/deedNFT';
import { IDeedNFT } from '../../contracts/IDeedNFT';
import { AssetType } from '../../types/contracts';
import { TransactionManager } from '../../utils/transactionManager';

describe('DeedNFT API', () => {
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let deedNFT: ethers.Contract;
  let transactionManager: TransactionManager;
  let user1: ethers.Wallet;
  let validator: ethers.Wallet;
  let tokenId: string;

  beforeAll(async () => {
    const env = await setupTestEnvironment();
    provider = env.provider;
    signer = env.wallet;
    transactionManager = new TransactionManager(provider);

    // Create test wallets
    const privateKey1 = ethers.hexlify(ethers.randomBytes(32));
    const privateKey2 = ethers.hexlify(ethers.randomBytes(32));
    
    user1 = new ethers.Wallet(privateKey1, provider);
    validator = new ethers.Wallet(privateKey2, provider);

    // Initialize contract
    deedNFT = await getTestContract(TEST_CONFIG.contracts.deedNFT!, IDeedNFT.abi);
  });

  describe('Asset Management', () => {
    it('should mint a new deed NFT', async () => {
      const result = await mintAsset(
        deedNFT,
        await user1.getAddress(),
        AssetType.Land,
        'ipfs://metadata1',
        'Definition',
        'Configuration',
        await validator.getAddress(),
        1,
        transactionManager
      );
      expect(result).toBeDefined();
      expect(result.status).toBe('confirmed');
      expect(result.receipt).toBeDefined();
      if (result.receipt) {
        const event = result.receipt.logs[0];
        tokenId = event.topics[1];
      }
    });

    it('should handle different asset types', async () => {
      const assetTypes = [AssetType.Land, AssetType.Vehicle, AssetType.Estate];
      
      for (const assetType of assetTypes) {
        const result = await mintAsset(
          deedNFT,
          await user1.getAddress(),
          assetType,
          'ipfs://metadata',
          'Definition',
          'Configuration',
          await validator.getAddress(),
          1,
          transactionManager
        );
        expect(result).toBeDefined();
        expect(result.status).toBe('confirmed');
      }
    });

    it('should fail when minting with invalid parameters', async () => {
      await expect(
        mintAsset(
          deedNFT,
          ethers.ZeroAddress,
          AssetType.Land,
          'ipfs://metadata',
          'Definition',
          'Configuration',
          await validator.getAddress(),
          1,
          transactionManager
        )
      ).rejects.toThrow();
    });
  });

  describe('Metadata Management', () => {
    beforeEach(async () => {
      const result = await mintAsset(
        deedNFT,
        await user1.getAddress(),
        AssetType.Land,
        'ipfs://metadata',
        'Definition',
        'Configuration',
        await validator.getAddress(),
        1,
        transactionManager
      );
      expect(result.status).toBe('confirmed');
      expect(result.receipt).toBeDefined();
      if (result.receipt) {
        const event = result.receipt.logs[0];
        tokenId = event.topics[1];
      }
    });

    it('should update metadata', async () => {
      await updateMetadata(
        deedNFT,
        Number(tokenId),
        'ipfs://updated-metadata',
        'Updated Agreement',
        'Updated Definition',
        'Updated Configuration',
        transactionManager
      );

      const uri = await tokenURI(deedNFT, Number(tokenId));
      expect(uri).toBe('ipfs://updated-metadata');
    });
  });

  describe('Role Management', () => {
    it('should manage minter roles', async () => {
      const minter = await user1.getAddress();
      
      await addMinter(deedNFT, minter, transactionManager);
      expect(await hasRole(deedNFT, 'MINTER_ROLE', minter)).toBe(true);
      
      await removeMinter(deedNFT, minter, transactionManager);
      expect(await hasRole(deedNFT, 'MINTER_ROLE', minter)).toBe(false);
    });
  });

  describe('Marketplace Management', () => {
    it('should manage approved marketplaces', async () => {
      const marketplace = await user1.getAddress();
      
      await setApprovedMarketplace(deedNFT, marketplace, true, transactionManager);
      expect(await isApprovedMarketplace(deedNFT, marketplace)).toBe(true);
      
      await setApprovedMarketplace(deedNFT, marketplace, false, transactionManager);
      expect(await isApprovedMarketplace(deedNFT, marketplace)).toBe(false);
    });
  });

  describe('Royalty Management', () => {
    it('should manage royalty enforcement', async () => {
      await setRoyaltyEnforcement(deedNFT, true, transactionManager);
      expect(await isRoyaltyEnforced(deedNFT)).toBe(true);
      
      await setRoyaltyEnforcement(deedNFT, false, transactionManager);
      expect(await isRoyaltyEnforced(deedNFT)).toBe(false);
    });
  });

  describe('Transfer Management', () => {
    it('should manage transfer validator', async () => {
      const validator = await user1.getAddress();
      
      await setTransferValidator(deedNFT, validator, transactionManager);
      expect(await getTransferValidator(deedNFT)).toBe(validator);
    });
  });
}); 