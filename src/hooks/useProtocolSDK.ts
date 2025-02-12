import { useState, useEffect } from 'react';
import { ProtocolSDK } from '../ProtocolSDK';
import { NetworkConfig } from '../types/config';
import { NETWORKS } from '../utils/config/networks';

export function useProtocolSDK(networkName: string = 'localhost') {
  const [sdk, setSDK] = useState<ProtocolSDK | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initSDK() {
      try {
        const network = NETWORKS[networkName];
        if (!network) throw new Error(`Network ${networkName} not configured`);

        // Initialize SDK
        const provider = window.ethereum 
          ? new ethers.providers.Web3Provider(window.ethereum)
          : ethers.providers.getDefaultProvider(network.rpcUrl);
        
        const sdk = await ProtocolSDK.create({
          provider,
          network,
          walletConfig: {
            dynamicEnvId: process.env.DYNAMIC_ENV_ID
          }
        });

        setSDK(sdk);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    initSDK();
  }, [networkName]);

  return { sdk, loading, error };
} 