import { useState, useCallback } from 'react';
import { type Hash, type TransactionReceipt } from 'viem';
import { TransactionState, TransactionStatus } from '../types/transactions';
import { ProtocolError } from '../utils/errors';

export function useTransaction() {
  const [state, setState] = useState<TransactionState>({
    status: TransactionStatus.PENDING
  });

  const execute = useCallback(async (
    transaction: () => Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }>,
    {
      onSuccess,
      onError,
      onSubmitted,
      onMining
    }: {
      onSuccess?: (receipt: TransactionReceipt) => void;
      onError?: (error: ProtocolError) => void;
      onSubmitted?: (hash: Hash) => void;
      onMining?: (confirmations: number) => void;
    } = {}
  ) => {
    try {
      setState({ status: TransactionStatus.PENDING });
      
      const tx = await transaction();
      setState({
        status: TransactionStatus.MINING,
        hash: tx.hash
      });
      onSubmitted?.(tx.hash);

      const receipt = await tx.wait();
      setState({
        status: TransactionStatus.SUCCESS,
        hash: tx.hash,
        receipt
      });
      onSuccess?.(receipt);
      
      return receipt;
    } catch (error: any) {
      const protocolError = ProtocolError.fromError(error);
      setState({
        status: TransactionStatus.FAILED,
        error: protocolError.message
      });
      onError?.(protocolError);
      throw protocolError;
    }
  }, []);

  return {
    state,
    execute,
    isLoading: state.status === TransactionStatus.PENDING || 
               state.status === TransactionStatus.MINING,
    isSuccess: state.status === TransactionStatus.SUCCESS,
    isError: state.status === TransactionStatus.FAILED
  };
} 