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

describe('MetadataRenderer API', () => {
  let contract: ethers.Contract;
  const validTokenId = 1;
  const validMetadata = 'ipfs://QmWWQSuPMS6aXCbZKpEjPHPUZN2NjB3YrhJTHsV4X3vb2t';
  const validFeatures = ['feature1', 'feature2'];
  const validImageUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
  const validExternalLink = 'https://example.com';
  const validAddress = '0x1234567890123456789012345678901234567890';

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

  describe('Basic Metadata Functions', () => {
    it('should get token URI successfully', async () => {
      const result = await tokenURI(contract, validTokenId);
      expect(result).toBe(validMetadata);
      expect(contract.tokenURI).toHaveBeenCalledWith(validTokenId);
    });

    it('should set token custom metadata successfully', async () => {
      await setTokenCustomMetadata(contract, validTokenId, validMetadata);
      expect(contract.setTokenCustomMetadata).toHaveBeenCalledWith(validTokenId, validMetadata);
    });
  });

  describe('Token Features Management', () => {
    it('should set token features successfully', async () => {
      await setTokenFeatures(contract, validTokenId, validFeatures);
      expect(contract.setTokenFeatures).toHaveBeenCalledWith(validTokenId, validFeatures);
    });

    it('should get token features successfully', async () => {
      const result = await getTokenFeatures(contract, validTokenId);
      expect(result).toEqual(validFeatures);
      expect(contract.getTokenFeatures).toHaveBeenCalledWith(validTokenId);
    });
  });

  describe('Asset Condition Management', () => {
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

    it('should get asset condition successfully', async () => {
      const result = await getAssetCondition(contract, validTokenId);
      expect(result).toEqual(['Good', '2024-03-20', ['issue1'], ['improvement1'], 'Notes']);
      expect(contract.getAssetCondition).toHaveBeenCalledWith(validTokenId);
    });
  });

  describe('Legal Information Management', () => {
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

    it('should get token legal info successfully', async () => {
      const result = await getTokenLegalInfo(contract, validTokenId);
      expect(result).toEqual(['US', 'REG123', '2024-03-20', ['doc1'], ['restriction1'], 'Info']);
      expect(contract.getTokenLegalInfo).toHaveBeenCalledWith(validTokenId);
    });
  });

  describe('Document Management', () => {
    it('should get token document successfully', async () => {
      const result = await getTokenDocument(contract, validTokenId, 'type1');
      expect(result).toBe('document1');
      expect(contract.getTokenDocument).toHaveBeenCalledWith(validTokenId, 'type1');
    });

    it('should get token document types successfully', async () => {
      const result = await getTokenDocumentTypes(contract, validTokenId);
      expect(result).toEqual(['type1', 'type2']);
      expect(contract.getTokenDocumentTypes).toHaveBeenCalledWith(validTokenId);
    });

    it('should get token documents successfully', async () => {
      const result = await getTokenDocuments(contract, validTokenId);
      expect(result).toEqual([{ type: 'type1', url: 'url1' }]);
      expect(contract.getTokenDocuments).toHaveBeenCalledWith(validTokenId);
    });
  });

  describe('Gallery and External Link Management', () => {
    it('should set token gallery successfully', async () => {
      await setTokenGallery(contract, validTokenId, validImageUrls);
      expect(contract.setTokenGallery).toHaveBeenCalledWith(validTokenId, validImageUrls);
    });

    it('should get token gallery successfully', async () => {
      const result = await getTokenGallery(contract, validTokenId);
      expect(result).toEqual(validImageUrls);
      expect(contract.getTokenGallery).toHaveBeenCalledWith(validTokenId);
    });

    it('should set token external link successfully', async () => {
      await setTokenExternalLink(contract, validTokenId, validExternalLink);
      expect(contract.setTokenExternalLink).toHaveBeenCalledWith(validTokenId, validExternalLink);
    });

    it('should get token animation URL successfully', async () => {
      const result = await getTokenAnimationURL(contract, validTokenId);
      expect(result).toBe('https://example.com/animation.mp4');
      expect(contract.getTokenAnimationURL).toHaveBeenCalledWith(validTokenId);
    });

    it('should get token external link successfully', async () => {
      const result = await getTokenExternalLink(contract, validTokenId);
      expect(result).toBe(validExternalLink);
      expect(contract.getTokenExternalLink).toHaveBeenCalledWith(validTokenId);
    });
  });

  describe('Trait Management', () => {
    it('should sync trait update successfully', async () => {
      const traitKey = 'color';
      const traitValue = 'blue';
      await syncTraitUpdate(contract, validTokenId, traitKey, traitValue);
      expect(contract.syncTraitUpdate).toHaveBeenCalledWith(validTokenId, traitKey, traitValue);
    });
  });

  describe('Document Management', () => {
    it('should manage token document successfully', async () => {
      const docType = 'certificate';
      const documentURI = 'ipfs://QmDocumentHash';
      await manageTokenDocument(contract, validTokenId, docType, documentURI, false);
      expect(contract.manageTokenDocument).toHaveBeenCalledWith(validTokenId, docType, documentURI, false);
    });

    it('should remove token document successfully', async () => {
      const docType = 'certificate';
      const documentURI = 'ipfs://QmDocumentHash';
      await manageTokenDocument(contract, validTokenId, docType, documentURI, true);
      expect(contract.manageTokenDocument).toHaveBeenCalledWith(validTokenId, docType, documentURI, true);
    });
  });

  describe('Animation and Media Management', () => {
    it('should set token animation URL successfully', async () => {
      const animationURL = 'https://example.com/animation.mp4';
      await setTokenAnimationURL(contract, validTokenId, animationURL);
      expect(contract.setTokenAnimationURL).toHaveBeenCalledWith(validTokenId, animationURL);
    });
  });

  describe('Asset Type Management', () => {
    it('should set asset type image URI successfully', async () => {
      const assetType = 1;
      const imageURI = 'ipfs://QmImageHash';
      await setAssetTypeImageURI(contract, assetType, imageURI);
      expect(contract.setAssetTypeImageURI).toHaveBeenCalledWith(assetType, imageURI);
    });

    it('should set asset type background color successfully', async () => {
      const assetType = 1;
      const backgroundColor = '#FF0000';
      await setAssetTypeBackgroundColor(contract, assetType, backgroundColor);
      expect(contract.setAssetTypeBackgroundColor).toHaveBeenCalledWith(assetType, backgroundColor);
    });
  });

  describe('Contract Configuration', () => {
    it('should set DeedNFT contract successfully', async () => {
      await setDeedNFT(contract, validAddress);
      expect(contract.setDeedNFT).toHaveBeenCalledWith(validAddress);
    });

    it('should set invalidated image URI successfully', async () => {
      const imageURI = 'ipfs://QmInvalidatedImageHash';
      await setInvalidatedImageURI(contract, imageURI);
      expect(contract.setInvalidatedImageURI).toHaveBeenCalledWith(imageURI);
    });
  });

  describe('Error Handling', () => {
    it('should handle read errors', async () => {
      jest.spyOn(contract, 'tokenURI').mockRejectedValue(new Error('Failed to get token URI'));
      await expect(tokenURI(contract, validTokenId)).rejects.toThrow('Failed to get token URI');
    });

    it('should handle write errors', async () => {
      jest.spyOn(contract, 'setTokenCustomMetadata').mockRejectedValue(new Error('Failed to set metadata'));
      await expect(setTokenCustomMetadata(contract, validTokenId, validMetadata))
        .rejects.toThrow('Failed to set metadata');
    });

    it('should handle trait update errors', async () => {
      jest.spyOn(contract, 'syncTraitUpdate').mockRejectedValue(new Error('Failed to update trait'));
      await expect(syncTraitUpdate(contract, validTokenId, 'color', 'blue'))
        .rejects.toThrow('Failed to update trait');
    });

    it('should handle document management errors', async () => {
      jest.spyOn(contract, 'manageTokenDocument').mockRejectedValue(new Error('Failed to manage document'));
      await expect(manageTokenDocument(contract, validTokenId, 'certificate', 'ipfs://hash', false))
        .rejects.toThrow('Failed to manage document');
    });

    it('should handle asset type configuration errors', async () => {
      jest.spyOn(contract, 'setAssetTypeImageURI').mockRejectedValue(new Error('Failed to set image URI'));
      await expect(setAssetTypeImageURI(contract, 1, 'ipfs://hash'))
        .rejects.toThrow('Failed to set image URI');
    });
  });
}); 