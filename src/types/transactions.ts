import { 
  type TransactionRequestBase,
  type TransactionReceipt,
  type Hash 
} from 'viem'

export interface TransactionConfig extends TransactionRequestBase {
  nonce?: number;
}

export interface TransactionResponse {
  hash: Hash;
  wait: (confirmations?: number) => Promise<TransactionReceipt>;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  MINING = 'MINING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface TransactionState {
  status: TransactionStatus
  hash?: Hash
  receipt?: TransactionReceipt
  error?: string
}

export interface TransactionResult {
  status: TransactionStatus
  hash?: Hash
  receipt?: TransactionReceipt
  error?: string
}

export interface TransactionEventCallbacks {
  onSubmitted?: (hash: Hash) => void
  onPending?: () => void
  onConfirmation?: (confirmations: number) => void
  onSuccess?: (receipt: TransactionReceipt) => void
  onError?: (error: Error) => void
  onSpeedUp?: (newHash: Hash, oldHash: Hash) => void
  onBlockMined?: (confirmations: number) => void
  onFailed?: (error: Error) => void
} 