/**
 * @file MetadataRenderer API Test Suite
 * @description This test suite verifies the functionality of the MetadataRenderer contract API.
 * It tests metadata management, token features, asset conditions, legal information,
 * document management, gallery settings, and trait synchronization. The suite uses
 * mocked contract methods to simulate blockchain interactions.
 * 
 * @module MetadataRendererAPITest
 */

import { expect, jest } from '@jest/globals';
import { ethers } from 'ethers';
import {
  tokenURI,
  setTokenCustomMetadata,
  setTokenFeatures,
  getTokenFeatures,
  setAssetCondition,
  getAssetCondition,
  setTokenLegalInfo,
  getTokenLegalInfo,
  getTokenDocument,
  getTokenDocumentTypes,
  getTokenDocuments,
  setTokenGallery,
  getTokenGallery,
  setTokenExternalLink,
  getTokenAnimationURL,
  getTokenExternalLink,
  syncTraitUpdate,
  manageTokenDocument,
  setTokenAnimationURL,
  setDeedNFT,
  setAssetTypeImageURI,
  setAssetTypeBackgroundColor,
  setInvalidatedImageURI
} from '../../api/metadataRenderer';
import { TEST_CONFIG, provider } from '../setup';

/**
 * @description Test suite for the MetadataRenderer contract API
 */
describe('MetadataRenderer API', () => {
  let contract: ethers.Contract;
  const validTokenId = 1;
  const validMetadata = 'ipfs://QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';
  const validFeatures = ['feature1', 'feature2'];
  const validImageUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
  const validExternalLink = 'https://example.com';
  const validAddress = '0x1234567890123456789012345678901234567890';

  /**
   * @description Sets up the test environment before each test
   * - Resets all mocks
   * - Creates mock transaction response
   * - Initializes mock contract with all required functions
   */
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock transaction response
    const mockTxResponse = {
      hash: '0x123',
      wait: async () => ({
        status: 1,
        logs: [{
          topics: ['0x0', '0x0', '0x0', '0x1'],
          data: '0x'
        }]
      } as unknown as ethers.TransactionReceipt)
    } as ethers.TransactionResponse;

    // Create mock contract with proper types
    contract = {
      // Read functions
      tokenURI: jest.fn<() => Promise<string>>().mockResolvedValue(validMetadata),
      getTokenFeatures: jest.fn<() => Promise<string[]>>().mockResolvedValue(validFeatures),
      getAssetCondition: jest.fn<() => Promise<[string, string, string[], string[], string]>>()
        .mockResolvedValue(['Good', '2024-03-20', ['issue1'], ['improvement1'], 'Notes']),
      getTokenLegalInfo: jest.fn<() => Promise<[string, string, string, string[], string[], string]>>()
        .mockResolvedValue(['US', 'REG123', '2024-03-20', ['doc1'], ['restriction1'], 'Info']),
      getTokenDocument: jest.fn<() => Promise<string>>().mockResolvedValue('document1'),
      getTokenDocumentTypes: jest.fn<() => Promise<string[]>>().mockResolvedValue(['type1', 'type2']),
      getTokenDocuments: jest.fn<() => Promise<any[]>>().mockResolvedValue([{ type: 'type1', url: 'url1' }]),
      getTokenGallery: jest.fn<() => Promise<string[]>>().mockResolvedValue(validImageUrls),
      getTokenAnimationURL: jest.fn<() => Promise<string>>().mockResolvedValue('https://example.com/animation.mp4'),
      getTokenExternalLink: jest.fn<() => Promise<string>>().mockResolvedValue(validExternalLink),

      // Write functions
      syncTraitUpdate: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setTokenCustomMetadata: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setTokenFeatures: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setAssetCondition: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setTokenLegalInfo: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      manageTokenDocument: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setTokenGallery: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setTokenAnimationURL: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setTokenExternalLink: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setDeedNFT: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setAssetTypeImageURI: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setAssetTypeBackgroundColor: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),
      setInvalidatedImageURI: jest.fn<() => Promise<ethers.TransactionResponse>>().mockResolvedValue(mockTxResponse),

      interface: {
        format: () => ({})
      }
    } as unknown as ethers.Contract;
  });

  /**
   * @description Test suite for basic metadata operations
   */
  describe('Basic Metadata Functions', () => {
    /**
     * @description Tests successful retrieval of token URI
     */
    it('should get token URI successfully', async () => {
      const result = await tokenURI(contract, validTokenId);
      expect(result).toBe(validMetadata);
      expect(contract.tokenURI).toHaveBeenCalledWith(validTokenId);
    });

    /**
     * @description Tests successful setting of custom metadata
     */
    it('should set token custom metadata successfully', async () => {
      await setTokenCustomMetadata(contract, validTokenId, validMetadata);
      expect(contract.setTokenCustomMetadata).toHaveBeenCalledWith(validTokenId, validMetadata);
    });
  });

  /**
   * @description Test suite for token features management
   */
  describe('Token Features Management', () => {
    /**
     * @description Tests successful setting of token features
     */
    it('should set token features successfully', async () => {
      await setTokenFeatures(contract, validTokenId, validFeatures);
      expect(contract.setTokenFeatures).toHaveBeenCalledWith(validTokenId, validFeatures);
    });

    /**
     * @description Tests successful retrieval of token features
     */
    it('should get token features successfully', async () => {
      const result = await getTokenFeatures(contract, validTokenId);
      expect(result).toEqual(validFeatures);
      expect(contract.getTokenFeatures).toHaveBeenCalledWith(validTokenId);
    });
  });

  /**
   * @description Test suite for asset condition management
   */
  describe('Asset Condition Management', () => {
    /**
     * @description Tests successful setting of asset condition
     */
    it('should set asset condition successfully', async () => {
      const condition = 'Good';
      const lastInspectionDate = '2024-03-20';
      const knownIssues = ['issue1'];
      const improvements = ['improvement1'];
      const additionalNotes = 'Notes';

      await setAssetCondition(
        contract,
        validTokenId,
        condition,
        lastInspectionDate,
        knownIssues,
        improvements,
        additionalNotes
      );

      expect(contract.setAssetCondition).toHaveBeenCalledWith(
        validTokenId,
        condition,
        lastInspectionDate,
        knownIssues,
        improvements,
        additionalNotes
      );
    });

    /**
     * @description Tests successful retrieval of asset condition
     */
    it('should get asset condition successfully', async () => {
      const result = await getAssetCondition(contract, validTokenId);
      expect(result).toEqual(['Good', '2024-03-20', ['issue1'], ['improvement1'], 'Notes']);
      expect(contract.getAssetCondition).toHaveBeenCalledWith(validTokenId);
    });
  });

  /**
   * @description Test suite for legal information management
   */
  describe('Legal Information Management', () => {
    /**
     * @description Tests successful setting of token legal information
     */
    it('should set token legal info successfully', async () => {
      const jurisdiction = 'US';
      const registrationNumber = 'REG123';
      const registrationDate = '2024-03-20';
      const documents = ['doc1'];
      const restrictions = ['restriction1'];
      const additionalInfo = 'Info';

      await setTokenLegalInfo(
        contract,
        validTokenId,
        jurisdiction,
        registrationNumber,
        registrationDate,
        documents,
        restrictions,
        additionalInfo
      );

      expect(contract.setTokenLegalInfo).toHaveBeenCalledWith(
        validTokenId,
        jurisdiction,
        registrationNumber,
        registrationDate,
        documents,
        restrictions,
        additionalInfo
      );
    });

    /**
     * @description Tests successful retrieval of token legal information
     */
    it('should get token legal info successfully', async () => {
      const result = await getTokenLegalInfo(contract, validTokenId);
      expect(result).toEqual(['US', 'REG123', '2024-03-20', ['doc1'], ['restriction1'], 'Info']);
      expect(contract.getTokenLegalInfo).toHaveBeenCalledWith(validTokenId);
    });
  });

  /**
   * @description Test suite for document management
   */
  describe('Document Management', () => {
    /**
     * @description Tests successful retrieval of token document
     */
    it('should get token document successfully', async () => {
      const result = await getTokenDocument(contract, validTokenId, 'type1');
      expect(result).toBe('document1');
      expect(contract.getTokenDocument).toHaveBeenCalledWith(validTokenId, 'type1');
    });

    /**
     * @description Tests successful retrieval of token document types
     */
    it('should get token document types successfully', async () => {
      const result = await getTokenDocumentTypes(contract, validTokenId);
      expect(result).toEqual(['type1', 'type2']);
      expect(contract.getTokenDocumentTypes).toHaveBeenCalledWith(validTokenId);
    });

    /**
     * @description Tests successful retrieval of all token documents
     */
    it('should get token documents successfully', async () => {
      const result = await getTokenDocuments(contract, validTokenId);
      expect(result).toEqual([{ type: 'type1', url: 'url1' }]);
      expect(contract.getTokenDocuments).toHaveBeenCalledWith(validTokenId);
    });
  });

  /**
   * @description Test suite for gallery and external link management
   */
  describe('Gallery and External Link Management', () => {
    /**
     * @description Tests successful setting of token gallery
     */
    it('should set token gallery successfully', async () => {
      await setTokenGallery(contract, validTokenId, validImageUrls);
      expect(contract.setTokenGallery).toHaveBeenCalledWith(validTokenId, validImageUrls);
    });

    /**
     * @description Tests successful retrieval of token gallery
     */
    it('should get token gallery successfully', async () => {
      const result = await getTokenGallery(contract, validTokenId);
      expect(result).toEqual(validImageUrls);
      expect(contract.getTokenGallery).toHaveBeenCalledWith(validTokenId);
    });

    /**
     * @description Tests successful setting of token external link
     */
    it('should set token external link successfully', async () => {
      await setTokenExternalLink(contract, validTokenId, validExternalLink);
      expect(contract.setTokenExternalLink).toHaveBeenCalledWith(validTokenId, validExternalLink);
    });

    /**
     * @description Tests successful retrieval of token animation URL
     */
    it('should get token animation URL successfully', async () => {
      const result = await getTokenAnimationURL(contract, validTokenId);
      expect(result).toBe('https://example.com/animation.mp4');
      expect(contract.getTokenAnimationURL).toHaveBeenCalledWith(validTokenId);
    });

    /**
     * @description Tests successful retrieval of token external link
     */
    it('should get token external link successfully', async () => {
      const result = await getTokenExternalLink(contract, validTokenId);
      expect(result).toBe(validExternalLink);
      expect(contract.getTokenExternalLink).toHaveBeenCalledWith(validTokenId);
    });
  });

  /**
   * @description Test suite for trait management
   */
  describe('Trait Management', () => {
    /**
     * @description Tests successful synchronization of trait updates
     */
    it('should sync trait update successfully', async () => {
      const traitKey = 'color';
      const traitValue = 'blue';
      await syncTraitUpdate(contract, validTokenId, traitKey, traitValue);
      expect(contract.syncTraitUpdate).toHaveBeenCalledWith(validTokenId, traitKey, traitValue);
    });
  });

  /**
   * @description Test suite for error handling scenarios
   */
  describe('Error Handling', () => {
    /**
     * @description Tests handling of token URI retrieval errors
     */
    it('should handle token URI retrieval errors', async () => {
      jest.spyOn(contract, 'tokenURI').mockRejectedValue(new Error('Failed to get token URI'));
      await expect(tokenURI(contract, validTokenId)).rejects.toThrow('Failed to get token URI');
    });

    /**
     * @description Tests handling of metadata setting errors
     */
    it('should handle metadata setting errors', async () => {
      jest.spyOn(contract, 'setTokenCustomMetadata').mockRejectedValue(new Error('Failed to set metadata'));
      await expect(setTokenCustomMetadata(contract, validTokenId, validMetadata))
        .rejects.toThrow('Failed to set metadata');
    });

    /**
     * @description Tests handling of feature setting errors
     */
    it('should handle feature setting errors', async () => {
      jest.spyOn(contract, 'setTokenFeatures').mockRejectedValue(new Error('Failed to set features'));
      await expect(setTokenFeatures(contract, validTokenId, validFeatures))
        .rejects.toThrow('Failed to set features');
    });

    /**
     * @description Tests handling of asset condition setting errors
     */
    it('should handle asset condition setting errors', async () => {
      jest.spyOn(contract, 'setAssetCondition').mockRejectedValue(new Error('Failed to set asset condition'));
      await expect(setAssetCondition(
        contract,
        validTokenId,
        'Good',
        '2024-03-20',
        ['issue1'],
        ['improvement1'],
        'Notes'
      )).rejects.toThrow('Failed to set asset condition');
    });
  });
}); 