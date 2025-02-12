import { useState, useCallback } from 'react';
import { ProtocolSDK } from '../ProtocolSDK';
import { ValidatorInfo } from '../types';

export function useValidation(sdk: ProtocolSDK) {
  const [validators, setValidators] = useState<ValidatorInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const validateDeed = useCallback(async (deedId: number, validatorAddress: string) => {
    return sdk.validatorRegistry.validateDeed(deedId, validatorAddress);
  }, [sdk]);

  const registerValidator = useCallback(async (params: {
    name: string;
    description: string;
    supportedAssetTypes: number[];
    uri: string;
  }) => {
    return sdk.validatorRegistry.registerValidator(params);
  }, [sdk]);

  return { validators, loading, validateDeed, registerValidator };
} 