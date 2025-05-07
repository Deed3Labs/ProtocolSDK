import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { setupTestEnvironment, TEST_CONFIG, getTestContract } from '../setup';
import {
  mintDeedNFT,
  mintBatchDeedNFT,
  withdrawValidatorFees,
  getCommissionBalance,
  setCommissionPercentage,
  setFeeReceiver,
  setValidatorRegistry,
  setDeedNFT
} from '../../api/fundManager';
import { IFundManager } from '../../contracts/IFundManager';
import { TransactionManager } from '../../utils/transactionManager';
import { AssetType } from '../../types/contracts';

describe('FundManager API', () => {
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let fundManager: ethers.Contract;
  let transactionManager: TransactionManager;
  let user1: ethers.Wallet;
  let validator: ethers.Wallet;

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
    fundManager = await getTestContract(TEST_CONFIG.contracts.fundManager!, IFundManager.abi);
  });

  describe('Deed NFT Management', () => {
    it('should mint a new deed NFT', async () => {
      const tokenId = await mintDeedNFT(
        fundManager,
        await user1.getAddress(),
        AssetType.Land,
        'ipfs://metadata1',
        'Definition',
        'Configuration',
        await validator.getAddress(),
        ethers.ZeroAddress,
        1
      );
      expect(typeof tokenId).toBe('number');
    });

    it('should mint batch deed NFTs', async () => {
      const deeds = [
        {
          owner: await user1.getAddress(),
          assetType: AssetType.Land,
          ipfsDetailsHash: 'ipfs://metadata1',
          definition: 'Definition1',
          configuration: 'Configuration1',
          validatorContract: await validator.getAddress(),
          token: ethers.ZeroAddress,
          salt: 1
        },
        {
          owner: await user1.getAddress(),
          assetType: AssetType.Vehicle,
          ipfsDetailsHash: 'ipfs://metadata2',
          definition: 'Definition2',
          configuration: 'Configuration2',
          validatorContract: await validator.getAddress(),
          token: ethers.ZeroAddress,
          salt: 2
        }
      ];

      const tokenIds = await mintBatchDeedNFT(fundManager, deeds);
      expect(Array.isArray(tokenIds)).toBe(true);
      expect(tokenIds.length).toBe(2);
    });
  });

  describe('Fee Management', () => {
    it('should handle validator fees', async () => {
      const validatorAddress = await validator.getAddress();
      const token = ethers.ZeroAddress;

      // Set commission percentage
      const percentage = 500; // 5%
      await setCommissionPercentage(fundManager, percentage);

      // Check commission balance
      const balance = await getCommissionBalance(fundManager, validatorAddress, token);
      expect(typeof balance).toBe('number');

      // Withdraw fees
      await withdrawValidatorFees(fundManager, validatorAddress, token);
    });

    it('should set fee receiver', async () => {
      const receiver = await user1.getAddress();
      await setFeeReceiver(fundManager, receiver);
    });
  });

  describe('Contract Management', () => {
    it('should set validator registry', async () => {
      const registry = await validator.getAddress();
      await setValidatorRegistry(fundManager, registry);
    });

    it('should set deed NFT contract', async () => {
      const deedNFT = await user1.getAddress();
      await setDeedNFT(fundManager, deedNFT);
    });
  });
}); 