import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ProtocolSDK } from '../ProtocolSDK';
import { NETWORKS } from '../config/networks';
import { SUPPORTED_CHAINS } from '../config/constants';

export function useProtocolSDK(chainId: number = SUPPORTED_CHAINS.LOCALHOST) {
  const [sdk, setSDK] = useState<ProtocolSDK | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initSDK() {
      try {
        const network = NETWORKS[chainId];
        if (!network) throw new Error(`Network ${chainId} not configured`);

        const provider = window.ethereum 
          ? new ethers.providers.Web3Provider(window.ethereum)
          : new ethers.providers.JsonRpcProvider(network.rpcUrl);
        
        const sdk = await ProtocolSDK.create({
          provider,
          network,
          walletConfig: {
            dynamicEnvId: process.env.DYNAMIC_ENV_ID,
            infuraId: process.env.INFURA_ID
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
  }, [chainId]);

  return { sdk, loading, error };
} 