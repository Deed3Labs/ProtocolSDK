import { ethers } from 'ethers';
import { DeedNFTContract } from '../../src/contracts/DeedNFTContract';
import { mockProvider, mockSigner } from '../mocks/ethers';

describe('DeedNFTContract', () => {
  let contract: DeedNFTContract;

  beforeEach(() => {
    contract = new DeedNFTContract('0x123', mockProvider);
  });

  describe('mintDeed', () => {
    it('should successfully mint a deed', async () => {
      const params = {
        assetType: 0,
        ipfsDetailsHash: 'hash',
        operatingAgreement: 'agreement',
        definition: 'definition',
        configuration: 'config',
        validatorContract: '0x456',
        token: '0x789',
        ipfsTokenURI: 'uri'
      };

      const tx = await contract.mintDeed(params);
      expect(tx.status).toBe('SUCCESS');
    });

    it('should handle errors properly', async () => {
      // Test error cases
    });
  });
}); 