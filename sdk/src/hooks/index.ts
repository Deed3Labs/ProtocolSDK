import { useState, useEffect, useCallback } from 'react';
import { ProtocolSDK } from '../ProtocolSDK';
import { AssetType, DeedInfo, SubdivisionInfo } from '../types';

export function useDeedNFT(sdk: ProtocolSDK) {
  const [deeds, setDeeds] = useState<DeedInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const createDeed = useCallback(async (params: {
    assetType: AssetType;
    ipfsHash: string;
    agreement: string;
    definition: string;
  }) => {
    return sdk.deedNFT.mintAsset(
      params.assetType,
      params.ipfsHash,
      params.agreement,
      params.definition
    );
  }, [sdk]);

  const loadDeeds = useCallback(async () => {
    setLoading(true);
    try {
      const nextId = await sdk.deedNFT.nextDeedId();
      const deedPromises = Array.from({ length: nextId }, (_, i) => 
        sdk.deedNFT.getDeedInfo(i).catch(() => null)
      );
      const deedInfos = await Promise.all(deedPromises);
      setDeeds(deedInfos.filter(Boolean));
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
    deedId: number;
    name: string;
    totalUnits: number;
  }) => {
    return sdk.subdivide.createSubdivision(params);
  }, [sdk]);

  const mintUnits = useCallback(async (
    deedId: number,
    unitIds: number[],
    recipients: string[]
  ) => {
    return sdk.subdivide.batchMintUnits(deedId, unitIds, recipients);
  }, [sdk]);

  return { createSubdivision, mintUnits };
} 