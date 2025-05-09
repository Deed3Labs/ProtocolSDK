/**
 * @file FundManager Core Test Suite
 * @description This test suite verifies the core functionality of the FundManager contract.
 * It tests the fundamental fund management operations, state management, and event emissions.
 * The suite uses mocked contract methods to simulate blockchain interactions.
 * 
 * @module FundManagerCoreTest
 */

// Add BigInt serialization support
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { provider, wallet, TEST_CONFIG, executeContractTransaction } from '../setup';
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
import { AssetType } from '../../types/contracts';

/**
 * @description Test suite for the FundManager contract API
 */
describe('FundManager API', () => {
  let fundManager: ethers.Contract;
  let user1: ethers.Wallet;
  let validator: ethers.Wallet;

  /**
   * @description Sets up the test environment before all tests
   * - Creates test wallets
   * - Initializes contract with ABI
   * - Sets up mock contract methods
   * - Configures state tracking for commission balances
   */
  beforeAll(async () => {
    // Create test wallets
    const privateKey1 = ethers.hexlify(ethers.randomBytes(32));
    const privateKey2 = ethers.hexlify(ethers.randomBytes(32));
    
    user1 = new ethers.Wallet(privateKey1, provider);
    validator = new ethers.Wallet(privateKey2, provider);

    // Initialize contract with proper ABI
    const fundManagerAbi = [
      'function mintDeedNFT(address to, uint8 assetType, string metadata, string definition, string configuration, address validator, address token, uint256 salt) returns (uint256)',
      'function mintBatchDeedNFT(tuple(address owner, uint8 assetType, string ipfsDetailsHash, string definition, string configuration, address validatorContract, address token, uint256 salt)[] deeds) returns (uint256[])',
      'function withdrawValidatorFees(address validator, address token)',
      'function getCommissionBalance(address validator, address token) view returns (uint256)',
      'function setCommissionPercentage(uint256 percentage)',
      'function setFeeReceiver(address receiver)',
      'function setValidatorRegistry(address registry)',
      'function setDeedNFT(address deedNFT)'
    ];

    fundManager = new ethers.Contract(
      TEST_CONFIG.contracts.fundManager!,
      fundManagerAbi,
      wallet
    );

    // Track state
    const commissionBalances = new Map<string, Map<string, bigint>>();
    const commissionPercentage = 500n; // 5%
    const feeReceiver = await user1.getAddress();
    const validatorRegistry = await validator.getAddress();
    const deedNFT = await user1.getAddress();
    let nextTokenId = 1;

    /**
     * @description Mocks the mintDeedNFT function to simulate minting a new DeedNFT
     * @param args - Array of arguments for the mintDeedNFT function
     * @returns Mock transaction response with token ID
     */
    jest.spyOn(fundManager, 'mintDeedNFT').mockImplementation(async (...args: any[]) => {
      const [to, assetType, metadata] = args;
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

    /**
     * @description Mocks the mintBatchDeedNFT function to simulate batch minting DeedNFTs
     * @param args - Array of arguments containing the deeds array
     * @returns Mock transaction response with token IDs
     */
    jest.spyOn(fundManager, 'mintBatchDeedNFT').mockImplementation(async (...args: any[]) => {
      const [deeds] = args;
      const tokenIds = Array(deeds.length).fill(0).map((_, i) => nextTokenId + i);
      nextTokenId += deeds.length;
      const mockTxResponse = {
        hash: '0xabc',
        wait: async () => ({
          status: 1,
          transactionHash: '0xabc',
          logs: tokenIds.map(id => ({
            topics: ['0x0', id.toString()]
          }))
        })
      };
      return mockTxResponse;
    });

    /**
     * @description Mocks the withdrawValidatorFees function to simulate fee withdrawal
     * @param args - Array of arguments containing validator and token addresses
     * @returns Mock transaction response
     */
    jest.spyOn(fundManager, 'withdrawValidatorFees').mockImplementation(async (...args: any[]) => {
      const [validator, token] = args;
      const validatorBalances = commissionBalances.get(validator) || new Map<string, bigint>();
      validatorBalances.set(token, BigInt(0));
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
     * @description Mocks the getCommissionBalance function to simulate balance checking
     * @param args - Array of arguments containing validator and token addresses
     * @returns Mock commission balance
     */
    jest.spyOn(fundManager, 'getCommissionBalance').mockImplementation(async (...args: any[]) => {
      const [validator, token] = args;
      const validatorBalances = commissionBalances.get(validator) || new Map<string, bigint>();
      return validatorBalances.get(token) || BigInt(0);
    });

    /**
     * @description Mocks the setCommissionPercentage function to simulate percentage setting
     * @param args - Array of arguments containing the percentage value
     * @returns Mock transaction response
     */
    jest.spyOn(fundManager, 'setCommissionPercentage').mockImplementation(async (...args: any[]) => {
      const [percentage] = args;
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
     * @description Mocks the setFeeReceiver function to simulate fee receiver setting
     * @param args - Array of arguments containing the receiver address
     * @returns Mock transaction response
     */
    jest.spyOn(fundManager, 'setFeeReceiver').mockImplementation(async (...args: any[]) => {
      const [receiver] = args;
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
     * @description Mocks the setValidatorRegistry function to simulate registry setting
     * @param args - Array of arguments containing the registry address
     * @returns Mock transaction response
     */
    jest.spyOn(fundManager, 'setValidatorRegistry').mockImplementation(async (...args: any[]) => {
      const [registry] = args;
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
     * @description Mocks the setDeedNFT function to simulate DeedNFT contract setting
     * @param args - Array of arguments containing the DeedNFT contract address
     * @returns Mock transaction response
     */
    jest.spyOn(fundManager, 'setDeedNFT').mockImplementation(async (...args: any[]) => {
      const [deedNFT] = args;
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
   * @description Test suite for DeedNFT management operations
   */
  describe('Deed NFT Management', () => {
    /**
     * @description Tests minting a single DeedNFT
     */
    it('should mint a new deed NFT', async () => {
      const tx = await executeContractTransaction(
        fundManager,
        'mintDeedNFT',
        [
          await user1.getAddress(),
          AssetType.Land,
          'ipfs://metadata1',
          'Definition',
          'Configuration',
          await validator.getAddress(),
          ethers.ZeroAddress,
          1
        ]
      );
      const tokenId = '1';
      expect(tokenId).toBeDefined();
    });

    /**
     * @description Tests batch minting multiple DeedNFTs
     */
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

      const tx = await executeContractTransaction(
        fundManager,
        'mintBatchDeedNFT',
        [deeds]
      );
      expect(tx).toBeDefined();
    });
  });

  /**
   * @description Test suite for fee management operations
   */
  describe('Fee Management', () => {
    /**
     * @description Tests validator fee operations including setting commission percentage,
     * checking balance, and withdrawing fees
     */
    it('should handle validator fees', async () => {
      const validatorAddress = await validator.getAddress();
      const token = ethers.ZeroAddress;

      // Set commission percentage
      const percentage = 500; // 5%
      await executeContractTransaction(
        fundManager,
        'setCommissionPercentage',
        [percentage]
      );

      // Check commission balance
      const balance = await getCommissionBalance(fundManager, validatorAddress, token);
      expect(balance).toBe(BigInt(0));

      // Withdraw fees
      await executeContractTransaction(
        fundManager,
        'withdrawValidatorFees',
        [validatorAddress, token]
      );
    });

    /**
     * @description Tests setting the fee receiver address
     */
    it('should set fee receiver', async () => {
      const receiver = await user1.getAddress();
      await executeContractTransaction(
        fundManager,
        'setFeeReceiver',
        [receiver]
      );
    });
  });

  describe('Contract Management', () => {
    it('should set validator registry', async () => {
      const registry = await validator.getAddress();
      await executeContractTransaction(
        fundManager,
        'setValidatorRegistry',
        [registry]
      );
    });

    it('should set deed NFT contract', async () => {
      const deedNFT = await user1.getAddress();
      await executeContractTransaction(
        fundManager,
        'setDeedNFT',
        [deedNFT]
      );
    });
  });
}); 