/**
 * @file MetadataRenderer Core Test Suite
 * @description This test suite verifies the core functionality of the MetadataRenderer contract.
 * It tests the fundamental metadata operations, state management, and event emissions.
 * The suite uses mocked contract methods to simulate blockchain interactions.
 * 
 * @module MetadataRendererCoreTest
 */

// Add BigInt serialization support
(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { provider, wallet, TEST_CONFIG, executeContractTransaction } from '../setup';
import { 
  tokenURI,
  syncTraitUpdate,
  setTokenCustomMetadata,
  setTokenFeatures,
  getTokenFeatures,
  setAssetCondition,
  getAssetCondition,
  setTokenLegalInfo,
  getTokenLegalInfo
} from '../../api/metadataRenderer';
import { IMetadataRendererContract } from '../../contracts/IMetadataRenderer';
import { mintAsset } from '../../api/deedNFT';
import { IDeedNFTContract } from '../../contracts/IDeedNFT';
import { AssetType } from '../../types/contracts';

/**
 * @description Test suite for the MetadataRenderer contract API
 */
describe('MetadataRenderer API', () => {
  let metadataRenderer: ethers.Contract;
  let deedNFT: ethers.Contract;
  let user1: ethers.Wallet;
  let validator: ethers.Wallet;
  let tokenId: string;

  /**
   * @description Sets up the test environment before all tests
   * - Creates test wallets
   * - Initializes contracts with ABIs
   * - Sets up mock contract methods
   * - Configures state tracking for token metadata
   */
  beforeAll(async () => {
    // Create test wallets
    const privateKey1 = ethers.hexlify(ethers.randomBytes(32));
    const privateKey2 = ethers.hexlify(ethers.randomBytes(32));
    
    user1 = new ethers.Wallet(privateKey1, provider);
    validator = new ethers.Wallet(privateKey2, provider);

    // Initialize contract with proper ABI
    const metadataRendererAbi = [
      'function tokenURI(uint256 tokenId) view returns (string)',
      'function syncTraitUpdate(uint256 tokenId, string key, string value)',
      'function setTokenCustomMetadata(uint256 tokenId, string metadata)',
      'function setTokenFeatures(uint256 tokenId, string[] features)',
      'function getTokenFeatures(uint256 tokenId) view returns (string[])',
      'function setAssetCondition(uint256 tokenId, string condition, string lastInspectionDate, string[] knownIssues, string[] improvements, string additionalNotes)',
      'function getAssetCondition(uint256 tokenId) view returns (string, string, string[], string[], string)',
      'function setTokenLegalInfo(uint256 tokenId, string jurisdiction, string registrationNumber, string registrationDate, string[] documents, string[] restrictions, string additionalInfo)',
      'function getTokenLegalInfo(uint256 tokenId) view returns (string, string, string, string[], string[], string)'
    ];

    metadataRenderer = new ethers.Contract(
      TEST_CONFIG.contracts.metadataRenderer!,
      metadataRendererAbi,
      wallet
    );

    const deedNFTAbi = [
      'function mintAsset(address to, uint8 assetType, string metadata, string definition, string configuration, address validator, uint256 salt) returns (uint256)'
    ];

    deedNFT = new ethers.Contract(
      TEST_CONFIG.contracts.deedNFT!,
      deedNFTAbi,
      wallet
    );

    // Track state
    const tokenFeatures = new Map<string, string[]>();
    const tokenConditions = new Map<string, {
      condition: string;
      lastInspectionDate: string;
      knownIssues: string[];
      improvements: string[];
      additionalNotes: string;
    }>();
    const tokenLegalInfo = new Map<string, {
      jurisdiction: string;
      registrationNumber: string;
      registrationDate: string;
      documents: string[];
      restrictions: string[];
      additionalInfo: string;
    }>();
    const tokenURIs = new Map<string, string>();

    /**
     * @description Mocks the tokenURI function to simulate retrieving token metadata URI
     * @param args - Array of arguments containing the token ID
     * @returns Mock token URI
     */
    jest.spyOn(metadataRenderer, 'tokenURI').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      return tokenURIs.get(tokenId.toString()) || 'ipfs://metadata';
    });

    /**
     * @description Mocks the syncTraitUpdate function to simulate updating token traits
     * @param args - Array of arguments containing token ID, key, and value
     * @returns Mock transaction response
     */
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

    /**
     * @description Mocks the setTokenCustomMetadata function to simulate setting custom metadata
     * @param args - Array of arguments containing token ID and metadata
     * @returns Mock transaction response
     */
    jest.spyOn(metadataRenderer, 'setTokenCustomMetadata').mockImplementation(async (...args: any[]) => {
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
     * @description Mocks the setTokenFeatures function to simulate setting token features
     * @param args - Array of arguments containing token ID and features array
     * @returns Mock transaction response
     */
    jest.spyOn(metadataRenderer, 'setTokenFeatures').mockImplementation(async (...args: any[]) => {
      const [tokenId, features] = args;
      tokenFeatures.set(tokenId.toString(), features);
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
     * @description Mocks the getTokenFeatures function to simulate retrieving token features
     * @param args - Array of arguments containing the token ID
     * @returns Mock array of token features
     */
    jest.spyOn(metadataRenderer, 'getTokenFeatures').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      return tokenFeatures.get(tokenId.toString()) || [];
    });

    /**
     * @description Mocks the setAssetCondition function to simulate setting asset condition
     * @param args - Array of arguments containing token ID and condition details
     * @returns Mock transaction response
     */
    jest.spyOn(metadataRenderer, 'setAssetCondition').mockImplementation(async (...args: any[]) => {
      const [tokenId, condition, lastInspectionDate, knownIssues, improvements, additionalNotes] = args;
      tokenConditions.set(tokenId.toString(), {
        condition,
        lastInspectionDate,
        knownIssues,
        improvements,
        additionalNotes
      });
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
     * @description Mocks the getAssetCondition function to simulate retrieving asset condition
     * @param args - Array of arguments containing the token ID
     * @returns Mock asset condition details
     */
    jest.spyOn(metadataRenderer, 'getAssetCondition').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      const condition = tokenConditions.get(tokenId.toString()) || {
        condition: '',
        lastInspectionDate: '',
        knownIssues: [],
        improvements: [],
        additionalNotes: ''
      };
      return [
        condition.condition,
        condition.lastInspectionDate,
        condition.knownIssues,
        condition.improvements,
        condition.additionalNotes
      ];
    });

    /**
     * @description Mocks the setTokenLegalInfo function to simulate setting legal information
     * @param args - Array of arguments containing token ID and legal details
     * @returns Mock transaction response
     */
    jest.spyOn(metadataRenderer, 'setTokenLegalInfo').mockImplementation(async (...args: any[]) => {
      const [tokenId, jurisdiction, registrationNumber, registrationDate, documents, restrictions, additionalInfo] = args;
      tokenLegalInfo.set(tokenId.toString(), {
        jurisdiction,
        registrationNumber,
        registrationDate,
        documents,
        restrictions,
        additionalInfo
      });
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
     * @description Mocks the getTokenLegalInfo function to simulate retrieving legal information
     * @param args - Array of arguments containing the token ID
     * @returns Mock legal information details
     */
    jest.spyOn(metadataRenderer, 'getTokenLegalInfo').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      const info = tokenLegalInfo.get(tokenId.toString()) || {
        jurisdiction: '',
        registrationNumber: '',
        registrationDate: '',
        documents: [],
        restrictions: [],
        additionalInfo: ''
      };
      return [
        info.jurisdiction,
        info.registrationNumber,
        info.registrationDate,
        info.documents,
        info.restrictions,
        info.additionalInfo
      ];
    });

    /**
     * @description Mocks the DeedNFT mintAsset function to simulate minting a new token
     * @param args - Array of arguments containing minting parameters
     * @returns Mock transaction response with token ID
     */
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
  });

  /**
   * @description Sets up a new token for each test
   */
  beforeEach(async () => {
    // Mint a new token for each test
    const tx = await executeContractTransaction(
      deedNFT,
      'mintAsset',
      [
        await user1.getAddress(),
        AssetType.Land,
        'ipfs://metadata',
        'Definition',
        'Configuration',
        await validator.getAddress(),
        1
      ]
    );
    tokenId = '1';
  });

  /**
   * @description Test suite for metadata management operations
   */
  describe('Metadata Management', () => {
    /**
     * @description Tests retrieving token URI
     */
    it('should get token URI', async () => {
      const uri = await tokenURI(metadataRenderer as IMetadataRendererContract, Number(tokenId));
      expect(uri).toBe('ipfs://metadata');
    });

    /**
     * @description Tests updating token traits
     */
    it('should update token traits', async () => {
      await executeContractTransaction(
        metadataRenderer,
        'syncTraitUpdate',
        [Number(tokenId), 'color', 'blue']
      );
    });

    /**
     * @description Tests setting custom metadata
     */
    it('should set custom metadata', async () => {
      await executeContractTransaction(
        metadataRenderer,
        'setTokenCustomMetadata',
        [Number(tokenId), '{"custom": "metadata"}']
      );
    });
  });

  /**
   * @description Test suite for token features operations
   */
  describe('Token Features', () => {
    /**
     * @description Tests setting and retrieving token features
     */
    it('should set and get token features', async () => {
      const features = ['feature1', 'feature2'];
      await executeContractTransaction(
        metadataRenderer,
        'setTokenFeatures',
        [Number(tokenId), features]
      );

      const retrievedFeatures = await getTokenFeatures(metadataRenderer as IMetadataRendererContract, Number(tokenId));
      expect(retrievedFeatures).toEqual(features);
    });
  });

  /**
   * @description Test suite for asset condition operations
   */
  describe('Asset Condition', () => {
    /**
     * @description Tests setting and retrieving asset condition
     */
    it('should set and get asset condition', async () => {
      const condition = {
        condition: 'Good',
        lastInspectionDate: '2024-03-20',
        knownIssues: ['issue1'],
        improvements: ['improvement1'],
        additionalNotes: 'Notes'
      };

      await executeContractTransaction(
        metadataRenderer,
        'setAssetCondition',
        [
          Number(tokenId),
          condition.condition,
          condition.lastInspectionDate,
          condition.knownIssues,
          condition.improvements,
          condition.additionalNotes
        ]
      );

      const retrievedCondition = await getAssetCondition(metadataRenderer as IMetadataRendererContract, Number(tokenId));
      expect(retrievedCondition).toEqual([
        condition.condition,
        condition.lastInspectionDate,
        condition.knownIssues,
        condition.improvements,
        condition.additionalNotes
      ]);
    });
  });

  /**
   * @description Test suite for legal information operations
   */
  describe('Legal Information', () => {
    /**
     * @description Tests setting and retrieving legal information
     */
    it('should set and get legal information', async () => {
      const legalInfo = {
        jurisdiction: 'US',
        registrationNumber: '12345',
        registrationDate: '2024-03-20',
        documents: ['doc1'],
        restrictions: ['restriction1'],
        additionalInfo: 'Additional info'
      };

      await executeContractTransaction(
        metadataRenderer,
        'setTokenLegalInfo',
        [
          Number(tokenId),
          legalInfo.jurisdiction,
          legalInfo.registrationNumber,
          legalInfo.registrationDate,
          legalInfo.documents,
          legalInfo.restrictions,
          legalInfo.additionalInfo
        ]
      );

      const retrievedInfo = await getTokenLegalInfo(metadataRenderer as IMetadataRendererContract, Number(tokenId));
      expect(retrievedInfo).toEqual([
        legalInfo.jurisdiction,
        legalInfo.registrationNumber,
        legalInfo.registrationDate,
        legalInfo.documents,
        legalInfo.restrictions,
        legalInfo.additionalInfo
      ]);
    });
  });

  it('should sync trait update', async () => {
    const tokenId = 1;
    const traitKey = 'testTrait';
    const traitValue = 'testValue';
    await syncTraitUpdate(metadataRenderer as IMetadataRendererContract, tokenId, traitKey, traitValue);
    expect(metadataRenderer.syncTraitUpdate).toHaveBeenCalledWith(tokenId, traitKey, traitValue);
  });
}); 