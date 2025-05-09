// Add BigInt serialization support
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { provider, wallet, TEST_CONFIG, getTestContract, executeContractTransaction } from '../setup';
import {
  mintDeedNFT,
  mintBatchDeedNFT,
  updateMetadata,
  addMinter,
  removeMinter,
  isMinter,
  addApprovedMarketplace,
  removeApprovedMarketplace,
  isApprovedMarketplace,
  setRoyaltyEnforcement,
  isRoyaltyEnforced,
  getTransferValidator,
  setTransferValidator
} from '../../api/deedNFT';
import { IDeedNFT } from '../../contracts/IDeedNFT';
import { getContractAddresses } from '../../config/contracts';
import { ChainId } from '../../types/network';

// Define asset types
enum AssetType {
  Land = 0,
  Building = 1,
  Vehicle = 2
}

describe('DeedNFT API', () => {
  let deedNFT: ethers.Contract;
  let user1: ethers.Wallet;
  const contractAddresses = getContractAddresses(ChainId.BASE_SEPOLIA);

  beforeAll(async () => {
    // Create test wallet
    const privateKey = ethers.hexlify(ethers.randomBytes(32));
    user1 = new ethers.Wallet(privateKey, provider);

    // Initialize contract with proper ABI
    const deedNFTAbi = [
      'function mintDeedNFT(address to, uint8 assetType, string metadata, string definition, string configuration, address validator, address royaltyReceiver, uint256 royaltyFee) returns (uint256)',
      'function mintBatchDeedNFT(address[] to, uint8[] assetType, string[] metadata, string[] definition, string[] configuration, address[] validator, address[] royaltyReceiver, uint256[] royaltyFee) returns (uint256[])',
      'function updateMetadata(uint256 tokenId, string metadata)',
      'function addMinter(address minter)',
      'function removeMinter(address minter)',
      'function isMinter(address account) view returns (bool)',
      'function addApprovedMarketplace(address marketplace)',
      'function removeApprovedMarketplace(address marketplace)',
      'function isApprovedMarketplace(address marketplace) view returns (bool)',
      'function setRoyaltyEnforcement(bool enforce)',
      'function isRoyaltyEnforced() view returns (bool)',
      'function getTransferValidator() view returns (address)',
      'function setTransferValidator(address validator)'
    ];

    deedNFT = new ethers.Contract(
      TEST_CONFIG.contracts.deedNFT!,
      deedNFTAbi,
      wallet
    );

    // Track state
    const minters = new Set<string>();
    const approvedMarketplaces = new Set<string>();
    let royaltyEnforced = true;
    let transferValidator = ethers.ZeroAddress;

    // Mock contract methods
    jest.spyOn(deedNFT, 'isMinter').mockImplementation(async (...args: any[]) => {
      const [account] = args;
      return minters.has(account);
    });

    jest.spyOn(deedNFT, 'addMinter').mockImplementation(async (...args: any[]) => {
      const [minter] = args;
      minters.add(minter);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(deedNFT, 'removeMinter').mockImplementation(async (...args: any[]) => {
      const [minter] = args;
      minters.delete(minter);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(deedNFT, 'isApprovedMarketplace').mockImplementation(async (...args: any[]) => {
      const [marketplace] = args;
      return approvedMarketplaces.has(marketplace);
    });

    jest.spyOn(deedNFT, 'addApprovedMarketplace').mockImplementation(async (...args: any[]) => {
      const [marketplace] = args;
      approvedMarketplaces.add(marketplace);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(deedNFT, 'removeApprovedMarketplace').mockImplementation(async (...args: any[]) => {
      const [marketplace] = args;
      approvedMarketplaces.delete(marketplace);
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(deedNFT, 'isRoyaltyEnforced').mockImplementation(async () => royaltyEnforced);
    jest.spyOn(deedNFT, 'setRoyaltyEnforcement').mockImplementation(async (...args: any[]) => {
      const [enforce] = args;
      royaltyEnforced = enforce;
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(deedNFT, 'getTransferValidator').mockImplementation(async () => transferValidator);
    jest.spyOn(deedNFT, 'setTransferValidator').mockImplementation(async (...args: any[]) => {
      const [validator] = args;
      transferValidator = validator;
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc'
        })
      };
      return mockTxResponse;
    });

    // Mock minting methods
    let nextTokenId = 1;
    jest.spyOn(deedNFT, 'mintDeedNFT').mockImplementation(async (...args: any[]) => {
      const [to, assetType, metadata, definition, configuration, validator, royaltyReceiver, royaltyFee] = args;
      
      // Validate parameters
      if (to === ethers.ZeroAddress || !metadata || !definition || !configuration || validator === ethers.ZeroAddress) {
        throw new Error('Invalid parameters');
      }

      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc',
          logs: [{
            topics: ['0x0', '0x0', '0x0', nextTokenId.toString()]
          }]
        })
      };
      nextTokenId++;
      return mockTxResponse;
    });

    jest.spyOn(deedNFT, 'mintBatchDeedNFT').mockImplementation(async (...args: any[]) => {
      const [to] = args;
      const tokenIds = Array.from({ length: to.length }, (_, i) => nextTokenId + i);
      nextTokenId += to.length;
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc',
          logs: tokenIds.map(id => ({
            topics: ['0x0', '0x0', '0x0', id.toString()]
          }))
        })
      };
      return mockTxResponse;
    });

    jest.spyOn(deedNFT, 'updateMetadata').mockImplementation(async () => {
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

  describe('Asset Management', () => {
    it('should mint a new deed NFT', async () => {
      const result = await mintDeedNFT(
        deedNFT,
        await user1.getAddress(),
        AssetType.Land,
        'ipfs://metadata1',
        'Definition',
        'Configuration',
        TEST_CONFIG.contracts.validator!,
        ethers.ZeroAddress,
        1
      );
      expect(typeof result).toBe('number');
    });

    it('should handle different asset types', async () => {
      const result = await mintDeedNFT(
        deedNFT,
        await user1.getAddress(),
        AssetType.Building,
        'ipfs://metadata2',
        'Definition',
        'Configuration',
        TEST_CONFIG.contracts.validator!,
        ethers.ZeroAddress,
        2
      );
      expect(typeof result).toBe('number');
    });

    it('should fail when minting with invalid parameters', async () => {
      await expect(
        mintDeedNFT(
          deedNFT,
          ethers.ZeroAddress,
          AssetType.Land,
          '',
          '',
          '',
          ethers.ZeroAddress,
          ethers.ZeroAddress,
          0
        )
      ).rejects.toThrow();
    });
  });

  describe('Metadata Management', () => {
    let tokenId: number;

    beforeEach(async () => {
      const result = await mintDeedNFT(
        deedNFT,
        await user1.getAddress(),
        AssetType.Land,
        'ipfs://metadata1',
        'Definition',
        'Configuration',
        TEST_CONFIG.contracts.validator!,
        ethers.ZeroAddress,
        1
      );
      tokenId = result;
    });

    it('should update metadata', async () => {
      await executeContractTransaction(
        deedNFT,
        'updateMetadata',
        [tokenId, 'ipfs://metadata2']
      );
    });
  });

  describe('Role Management', () => {
    it('should manage minter roles', async () => {
      const minter = await user1.getAddress();
      
      await executeContractTransaction(
        deedNFT,
        'addMinter',
        [minter]
      );
      expect(await isMinter(deedNFT, minter)).toBe(true);
      
      await executeContractTransaction(
        deedNFT,
        'removeMinter',
        [minter]
      );
      expect(await isMinter(deedNFT, minter)).toBe(false);
    });
  });

  describe('Marketplace Management', () => {
    it('should manage approved marketplaces', async () => {
      const marketplace = await user1.getAddress();
      
      await executeContractTransaction(
        deedNFT,
        'addApprovedMarketplace',
        [marketplace]
      );
      expect(await isApprovedMarketplace(deedNFT, marketplace)).toBe(true);
      
      await executeContractTransaction(
        deedNFT,
        'removeApprovedMarketplace',
        [marketplace]
      );
      expect(await isApprovedMarketplace(deedNFT, marketplace)).toBe(false);
    });
  });

  describe('Royalty Management', () => {
    it('should manage royalty enforcement', async () => {
      await executeContractTransaction(
        deedNFT,
        'setRoyaltyEnforcement',
        [false]
      );
      expect(await isRoyaltyEnforced(deedNFT)).toBe(false);
    });
  });

  describe('Transfer Management', () => {
    it('should manage transfer validator', async () => {
      const validator = await user1.getAddress();
      
      await executeContractTransaction(
        deedNFT,
        'setTransferValidator',
        [validator]
      );
      expect(await getTransferValidator(deedNFT)).toBe(validator);
    });
  });
}); 