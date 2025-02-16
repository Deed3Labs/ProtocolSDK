import { useCallback } from 'react';
import { ProtocolSDK } from '../ProtocolSDK';
import { type Hash, type TransactionReceipt } from 'viem';

export function useValidation(sdk: ProtocolSDK) {
  const validateDeed = useCallback(async (deedId: bigint, validatorAddress: string) => {
    return sdk.validatorRegistry.validate(deedId, validatorAddress);
  }, [sdk]);

  const registerValidator = useCallback(async (params: {
    name: string;
    description: string;
    supportedAssetTypes: number[];
    uri: string;
  }) => {
    return sdk.validatorRegistry.registerValidator(params);
  }, [sdk]);

  return { validateDeed, registerValidator };
}

export async function validateDeed(
  sdk: ProtocolSDK, 
  deedId: bigint,
  validatorAddress: string
): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
  return sdk.validatorRegistry.validate(deedId, validatorAddress);
}