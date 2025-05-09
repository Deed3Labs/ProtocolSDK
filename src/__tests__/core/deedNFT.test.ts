/**
 * @file DeedNFT Core Test Suite
 * @description This test suite verifies the core functionality of the DeedNFT contract.
 * It tests the fundamental contract operations, state management, and event emissions.
 * The suite uses mocked contract methods to simulate blockchain interactions.
 * 
 * @module DeedNFTCoreTest
 */

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

/**
 * @description Enum defining the supported asset types for DeedNFTs
 */
enum AssetType {
  Land = 0,
  Building = 1,
  Vehicle = 2
}

/**
 * @description Test suite for the DeedNFT contract API
 */
describe('DeedNFT API', () => {
  let deedNFT: ethers.Contract;
  let user1: ethers.Wallet;
  const contractAddresses = getContractAddresses(ChainId.BASE_SEPOLIA);

  /**
   * @description Sets up the test environment before all tests
   * - Creates test wallet
   * - Initializes contract with ABI
   * - Sets up mock contract methods
   * - Configures state tracking for minters, marketplaces, and other settings
   */
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

    /**
     * @description Mocks the isMinter function to simulate checking minter status
     * @param args - Array of arguments containing the account address
     * @returns Mock minter status
     */
    jest.spyOn(deedNFT, 'isMinter').mockImplementation(async (...args: any[]) => {
      const [account] = args;
      return minters.has(account);
    });

    /**
     * @description Mocks the addMinter function to simulate adding a minter
     * @param args - Array of arguments containing the minter address
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the removeMinter function to simulate removing a minter
     * @param args - Array of arguments containing the minter address
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the isApprovedMarketplace function to simulate checking marketplace approval
     * @param args - Array of arguments containing the marketplace address
     * @returns Mock approval status
     */
    jest.spyOn(deedNFT, 'isApprovedMarketplace').mockImplementation(async (...args: any[]) => {
      const [marketplace] = args;
      return approvedMarketplaces.has(marketplace);
    });

    /**
     * @description Mocks the addApprovedMarketplace function to simulate adding an approved marketplace
     * @param args - Array of arguments containing the marketplace address
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the removeApprovedMarketplace function to simulate removing an approved marketplace
     * @param args - Array of arguments containing the marketplace address
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the isRoyaltyEnforced function to simulate checking royalty enforcement status
     * @returns Mock royalty enforcement status
     */
    jest.spyOn(deedNFT, 'isRoyaltyEnforced').mockImplementation(async () => royaltyEnforced);

    /**
     * @description Mocks the setRoyaltyEnforcement function to simulate setting royalty enforcement
     * @param args - Array of arguments containing the enforcement status
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the getTransferValidator function to simulate retrieving transfer validator
     * @returns Mock transfer validator address
     */
    jest.spyOn(deedNFT, 'getTransferValidator').mockImplementation(async () => transferValidator);

    /**
     * @description Mocks the setTransferValidator function to simulate setting transfer validator
     * @param args - Array of arguments containing the validator address
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the mintDeedNFT function to simulate minting a new DeedNFT
     * @param args - Array of arguments containing minting parameters
     * @returns Mock transaction response with token ID
     */
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

    /**
     * @description Mocks the mintBatchDeedNFT function to simulate batch minting DeedNFTs
     * @param args - Array of arguments containing batch minting parameters
     * @returns Mock transaction response with token IDs
     */
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

    /**
     * @description Mocks the updateMetadata function to simulate updating token metadata
     * @returns Mock transaction response
     */
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

  /**
   * @description Test suite for asset management operations
   */
  describe('Asset Management', () => {
    /**
     * @description Tests minting a new DeedNFT
     */
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

    /**
     * @description Tests minting DeedNFTs with different asset types
     */
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

    /**
     * @description Tests handling invalid minting parameters
     */
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
      ).rejects.toThrow('Invalid parameters');
    });
  });

  /**
   * @description Test suite for minter management operations
   */
  describe('Minter Management', () => {
    /**
     * @description Tests adding and removing minters
     */
    it('should manage minters', async () => {
      const minterAddress = await user1.getAddress();

      // Add minter
      await executeContractTransaction(
        deedNFT,
        'addMinter',
        [minterAddress]
      );
      expect(await isMinter(deedNFT, minterAddress)).toBe(true);

      // Remove minter
      await executeContractTransaction(
        deedNFT,
        'removeMinter',
        [minterAddress]
      );
      expect(await isMinter(deedNFT, minterAddress)).toBe(false);
    });
  });

  /**
   * @description Test suite for marketplace approval operations
   */
  describe('Marketplace Approval', () => {
    /**
     * @description Tests managing approved marketplaces
     */
    it('should manage approved marketplaces', async () => {
      const marketplaceAddress = await user1.getAddress();

      // Add marketplace
      await executeContractTransaction(
        deedNFT,
        'addApprovedMarketplace',
        [marketplaceAddress]
      );
      expect(await isApprovedMarketplace(deedNFT, marketplaceAddress)).toBe(true);

      // Remove marketplace
      await executeContractTransaction(
        deedNFT,
        'removeApprovedMarketplace',
        [marketplaceAddress]
      );
      expect(await isApprovedMarketplace(deedNFT, marketplaceAddress)).toBe(false);
    });
  });

  /**
   * @description Test suite for royalty enforcement operations
   */
  describe('Royalty Enforcement', () => {
    /**
     * @description Tests managing royalty enforcement
     */
    it('should manage royalty enforcement', async () => {
      // Check initial state
      expect(await isRoyaltyEnforced(deedNFT)).toBe(true);

      // Disable enforcement
      await executeContractTransaction(
        deedNFT,
        'setRoyaltyEnforcement',
        [false]
      );
      expect(await isRoyaltyEnforced(deedNFT)).toBe(false);

      // Enable enforcement
      await executeContractTransaction(
        deedNFT,
        'setRoyaltyEnforcement',
        [true]
      );
      expect(await isRoyaltyEnforced(deedNFT)).toBe(true);
    });
  });

  /**
   * @description Test suite for transfer validator operations
   */
  describe('Transfer Validator', () => {
    /**
     * @description Tests managing transfer validator
     */
    it('should manage transfer validator', async () => {
      const validatorAddress = await user1.getAddress();

      // Set validator
      await executeContractTransaction(
        deedNFT,
        'setTransferValidator',
        [validatorAddress]
      );
      expect(await getTransferValidator(deedNFT)).toBe(validatorAddress);

      // Reset validator
      await executeContractTransaction(
        deedNFT,
        'setTransferValidator',
        [ethers.ZeroAddress]
      );
      expect(await getTransferValidator(deedNFT)).toBe(ethers.ZeroAddress);
    });
  });
}); 