import { useState, useEffect, useCallback } from 'react';
import { type Address } from 'viem';
import { ProtocolSDK } from '../ProtocolSDK';
import { AssetType, DeedInfo } from '../types';

export function useDeedNFT(sdk: ProtocolSDK) {
  const [deeds, setDeeds] = useState<DeedInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const createDeed = useCallback(async (params: {
    assetType: AssetType;
    agreement: string;
    definition: string;
    configuration: string;
  }) => {
    const { walletClient } = await sdk.wallet.connect();
    
    if (!walletClient.account) {
      throw new Error('No wallet account connected');
    }

    return sdk.deedNFT.mintAsset(
      walletClient.account.address,
      params.assetType,
      params.agreement,
      params.definition,
      params.configuration
    );
  }, [sdk]);

  const loadDeeds = useCallback(async () => {
    setLoading(true);
    try {
      const totalSupply = await sdk.deedNFT.totalSupply();
      const deedPromises = Array.from({ length: Number(totalSupply) }, (_, i) => 
        sdk.deedNFT.getDeedInfo(BigInt(i))
          .then(([assetType, isValidated, operatingAgreement, definition, configuration, validator]) => ({
            assetType,
            isValidated,
            operatingAgreement,
            definition,
            configuration,
            validator
          }))
          .catch(() => null)
      );
      const deedInfos = await Promise.all(deedPromises);
      setDeeds(deedInfos.filter((deed): deed is DeedInfo => deed !== null));
    } finally {
      setLoading(false);
    }
  }, [sdk]);

  useEffect(() => {
    loadDeeds();
  }, [loadDeeds]);

  return { deeds, loading, createDeed, refreshDeeds: loadDeeds };
}

export function useSubdivide(sdk: ProtocolSDK) {
  const createSubdivision = useCallback(async (params: {
    deedId: bigint;
    name: string;
    totalUnits: number;
    description: string;
    symbol: string;
    collectionUri: string;
    burnable: boolean;
  }) => {
    return sdk.subdivide.createSubdivision({
      ...params,
      totalUnits: BigInt(params.totalUnits)
    });
  }, [sdk]);

  const mintUnits = useCallback(async (
    deedId: bigint,
    unitIds: bigint[],
    recipients: Address[]
  ) => {
    return sdk.subdivide.batchMintUnits(deedId, unitIds, recipients);
  }, [sdk]);

  return { createSubdivision, mintUnits };
} 