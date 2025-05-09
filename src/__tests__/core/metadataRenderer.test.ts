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
import { IMetadataRenderer } from '../../contracts/IMetadataRenderer';
import { mintAsset } from '../../api/deedNFT';
import { IDeedNFT } from '../../contracts/IDeedNFT';
import { AssetType } from '../../types/contracts';

describe('MetadataRenderer API', () => {
  let metadataRenderer: ethers.Contract;
  let deedNFT: ethers.Contract;
  let user1: ethers.Wallet;
  let validator: ethers.Wallet;
  let tokenId: string;

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

    // Mock contract methods
    jest.spyOn(metadataRenderer, 'tokenURI').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      return tokenURIs.get(tokenId.toString()) || 'ipfs://metadata';
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

    jest.spyOn(metadataRenderer, 'getTokenFeatures').mockImplementation(async (...args: any[]) => {
      const [tokenId] = args;
      return tokenFeatures.get(tokenId.toString()) || [];
    });

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
  });

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

  describe('Metadata Management', () => {
    it('should get token URI', async () => {
      const uri = await tokenURI(metadataRenderer, Number(tokenId));
      expect(uri).toBe('ipfs://metadata');
    });

    it('should sync trait updates', async () => {
      await executeContractTransaction(
        metadataRenderer,
        'syncTraitUpdate',
        [Number(tokenId), 'traitKey', 'traitValue']
      );
    });

    it('should set custom metadata', async () => {
      const metadata = '{"custom": "metadata"}';
      await executeContractTransaction(
        metadataRenderer,
        'setTokenCustomMetadata',
        [Number(tokenId), metadata]
      );
    });
  });

  describe('Feature Management', () => {
    it('should manage token features', async () => {
      const features = ['feature1', 'feature2'];
      
      await executeContractTransaction(
        metadataRenderer,
        'setTokenFeatures',
        [Number(tokenId), features]
      );
      const retrievedFeatures = await getTokenFeatures(metadataRenderer, Number(tokenId));
      expect(retrievedFeatures).toEqual(features);
    });
  });

  describe('Asset Condition', () => {
    it('should manage asset condition information', async () => {
      const condition = 'Good';
      const lastInspectionDate = '2024-03-20';
      const knownIssues = ['None'];
      const improvements = ['Recent renovation'];
      const additionalNotes = 'Well maintained';

      await executeContractTransaction(
        metadataRenderer,
        'setAssetCondition',
        [Number(tokenId), condition, lastInspectionDate, knownIssues, improvements, additionalNotes]
      );

      const [retrievedCondition, retrievedDate, retrievedIssues, retrievedImprovements, retrievedNotes] = 
        await getAssetCondition(metadataRenderer, Number(tokenId));
      
      expect(retrievedCondition).toBe(condition);
      expect(retrievedDate).toBe(lastInspectionDate);
      expect(retrievedIssues).toEqual(knownIssues);
      expect(retrievedImprovements).toEqual(improvements);
      expect(retrievedNotes).toBe(additionalNotes);
    });
  });

  describe('Legal Information', () => {
    it('should manage legal information', async () => {
      const jurisdiction = 'California';
      const registrationNumber = 'REG123456';
      const registrationDate = '2024-01-01';
      const documents = ['doc1.pdf', 'doc2.pdf'];
      const restrictions = ['restriction1', 'restriction2'];
      const additionalInfo = 'Additional legal information';

      await executeContractTransaction(
        metadataRenderer,
        'setTokenLegalInfo',
        [Number(tokenId), jurisdiction, registrationNumber, registrationDate, documents, restrictions, additionalInfo]
      );

      const [retrievedJurisdiction, retrievedNumber, retrievedDate, retrievedDocs, retrievedRestrictions, retrievedInfo] = 
        await getTokenLegalInfo(metadataRenderer, Number(tokenId));
      
      expect(retrievedJurisdiction).toBe(jurisdiction);
      expect(retrievedNumber).toBe(registrationNumber);
      expect(retrievedDate).toBe(registrationDate);
      expect(retrievedDocs).toEqual(documents);
      expect(retrievedRestrictions).toEqual(restrictions);
      expect(retrievedInfo).toBe(additionalInfo);
    });
  });
}); 