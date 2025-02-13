import { ProtocolSDK } from '../../src/ProtocolSDK';
import { SUPPORTED_CHAINS } from '../../src/config/constants';
import { NETWORKS } from '../../src/config/networks';

describe('ProtocolSDK Integration', () => {
  let sdk: ProtocolSDK;

  beforeEach(async () => {
    sdk = await ProtocolSDK.create({
      provider: mockProvider,
      network: NETWORKS[SUPPORTED_CHAINS.LOCALHOST],
      walletConfig: {
        dynamicEnvId: 'test-env-id',
        infuraId: 'test-infura-id'
      }
    });
  });

  describe('Full Flow Tests', () => {
    it('should create and subdivide a deed', async () => {
      // Test full deed creation and subdivision flow
    });

    it('should handle validator registration and validation', async () => {
      // Test validator flow
    });
  });

  describe('Network Management', () => {
    it('should switch networks correctly', async () => {
      await sdk.wallet.switchNetwork(SUPPORTED_CHAINS.POLYGON_MUMBAI);
      const network = await sdk.wallet.getNetwork();
      expect(network.chainId).toBe(SUPPORTED_CHAINS.POLYGON_MUMBAI);
    });
  });
}); 