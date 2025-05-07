import { ethers } from 'ethers';
import { expect, beforeAll, beforeEach } from '@jest/globals';
import { setupTestEnvironment, TEST_CONFIG, getTestContract } from '../setup';
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
import { TransactionManager } from '../../utils/transactionManager';

describe('MetadataRenderer API', () => {
  let provider: ethers.JsonRpcProvider;
  let signer: ethers.Wallet;
  let metadataRenderer: ethers.Contract;
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

    // Initialize contracts
    metadataRenderer = await getTestContract(TEST_CONFIG.contracts.metadataRenderer!, IMetadataRenderer.abi);
    deedNFT = await getTestContract(TEST_CONFIG.contracts.deedNFT!, IDeedNFT.abi);
  });

    beforeEach(async () => {
    // Mint a new token for each test
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

  describe('Metadata Management', () => {
    it('should get token URI', async () => {
      const uri = await tokenURI(metadataRenderer, Number(tokenId));
      expect(uri).toBe('ipfs://metadata');
    });

    it('should sync trait updates', async () => {
      await syncTraitUpdate(metadataRenderer, Number(tokenId), 'traitKey', 'traitValue');
    });

    it('should set custom metadata', async () => {
      const metadata = '{"custom": "metadata"}';
      await setTokenCustomMetadata(metadataRenderer, Number(tokenId), metadata);
    });
  });

  describe('Feature Management', () => {
    it('should manage token features', async () => {
      const features = ['feature1', 'feature2'];
      
      await setTokenFeatures(metadataRenderer, Number(tokenId), features);
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

      await setAssetCondition(
        metadataRenderer,
        Number(tokenId),
        condition,
        lastInspectionDate,
        knownIssues,
        improvements,
        additionalNotes
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

      await setTokenLegalInfo(
        metadataRenderer,
        Number(tokenId),
        jurisdiction,
        registrationNumber,
        registrationDate,
        documents,
        restrictions,
        additionalInfo
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