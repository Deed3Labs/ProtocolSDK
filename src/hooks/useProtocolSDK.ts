import { useState, useEffect } from 'react';
import { createPublicClient, http, type Chain } from 'viem';
import { ProtocolSDK } from '../ProtocolSDK';
import { NETWORKS } from '../config/networks';
import { SUPPORTED_CHAINS } from '../config/constants';
import { ProtocolError } from '../utils/errors';

export function useProtocolSDK(chainId: number = SUPPORTED_CHAINS.LOCALHOST) {
  const [sdk, setSDK] = useState<ProtocolSDK | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function initSDK() {
      try {
        const network = NETWORKS[chainId];
        if (!network) throw new Error(`Network ${chainId} not configured`);

        // Create chain configuration for viem
        const chain: Chain = {
          id: network.chainId,
          name: network.name,
          rpcUrls: {
            default: { http: [network.rpcUrl] },
            public: { http: [network.rpcUrl] },
          },
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          }
        };

        const publicClient = createPublicClient({
          transport: http(network.rpcUrl),
          chain
        });
        
        const newSdk = await ProtocolSDK.create({
          publicClient,
          network,
          walletConfig: {
            walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
            fallbackRpcUrl: network.rpcUrl,
            supportedChainIds: Object.keys(NETWORKS).map(Number)
          }
        });

        if (mounted) {
          setSDK(newSdk);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(ProtocolError.fromError(err));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initSDK();

    return () => {
      mounted = false;
      if (sdk?.wallet) {
        sdk.wallet.disconnect();
      }
    };
  }, [chainId]);

  return { sdk, loading, error };
} 