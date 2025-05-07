import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { setupTestEnvironment, TEST_CONFIG, getTestContract } from './setup';
import { mintAsset, updateMetadata } from '../api/deedNFT';
import { validateDeed } from '../api/validator';
import { getValidatorInfo, isValidatorRegistered } from '../api/validatorRegistry';
import { getCommissionBalance } from '../api/fundManager';
import { IDeedNFT } from '../contracts/IDeedNFT';
import { IFundManager } from '../contracts/IFundManager';
import { IValidator } from '../contracts/IValidator';
import { IValidatorRegistry } from '../contracts/IValidatorRegistry';
import { IMetadataRenderer } from '../contracts/IMetadataRenderer';
import { TransactionManager } from '../utils/transactionManager';
import { AssetType } from '../types/contracts';

describe('API Integration', () => {
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let deedNFT: ethers.Contract;
  let fundManager: ethers.Contract;
  let validator: ethers.Contract;
  let validatorRegistry: ethers.Contract;
  let metadataRenderer: ethers.Contract;
  let transactionManager: TransactionManager;
  let user1: ethers.Wallet;
  let validator1: ethers.Wallet;

  beforeAll(async () => {
    const env = await setupTestEnvironment();
    provider = env.provider;
    signer = env.wallet;
    transactionManager = new TransactionManager(provider);

    // Create test wallets
    const privateKey1 = ethers.hexlify(ethers.randomBytes(32));
    const privateKey2 = ethers.hexlify(ethers.randomBytes(32));
    
    user1 = new ethers.Wallet(privateKey1, provider);
    validator1 = new ethers.Wallet(privateKey2, provider);

    // Initialize contracts
    deedNFT = await getTestContract(TEST_CONFIG.contracts.deedNFT!, IDeedNFT.abi);
    fundManager = await getTestContract(TEST_CONFIG.contracts.fundManager!, IFundManager.abi);
    validator = await getTestContract(TEST_CONFIG.contracts.validator!, IValidator.abi);
    validatorRegistry = await getTestContract(TEST_CONFIG.contracts.validatorRegistry!, IValidatorRegistry.abi);
    metadataRenderer = await getTestContract(TEST_CONFIG.contracts.metadataRenderer!, IMetadataRenderer.abi);
  });

  describe('Complete Deed Lifecycle', () => {
    it('should handle complete deed lifecycle', async () => {
      // 1. Check validator status
      const validatorAddress = await validator1.getAddress();
      const isRegistered = await isValidatorRegistered(validatorRegistry, validatorAddress);
      expect(isRegistered).toBeDefined();

      // 2. Mint deed
      const mintResult = await mintAsset(
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
      const event = mintResult.receipt?.logs[0];
      const tokenId = event?.topics[1];
      expect(tokenId).toBeDefined();

      // 3. Validate deed
      await validateDeed(validator, Number(tokenId));
      const isValidated = await validator.isDeedValidated(Number(tokenId));
      expect(isValidated).toBe(true);

      // 4. Update metadata
      await updateMetadata(
        deedNFT,
        Number(tokenId),
        'ipfs://updated-metadata',
        'Updated Agreement',
        'Updated Definition',
        'Updated Configuration',
        transactionManager
      );

      // 5. Check commission balance
      const commissionBalance = await getCommissionBalance(
        fundManager,
        validatorAddress,
        ethers.ZeroAddress
      );
      expect(commissionBalance).toBeDefined();
    });
  });
}); 