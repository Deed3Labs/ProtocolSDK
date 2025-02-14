import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash,
  type TransactionReceipt,
  type GetContractReturnType,
  getContract
} from 'viem'
import { ProtocolError } from '../utils/errors'

export abstract class BaseContract {
  protected contract: GetContractReturnType

  constructor(
    protected publicClient: PublicClient,
    protected walletClient: WalletClient,
    protected address: Address,
    protected abi: any
  ) {
    this.contract = getContract({
      address,
      abi,
      client: publicClient,
      walletClient
    })
  }

  protected async executeTransaction(
    method: string,
    args: any[]
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    try {
      const hash = await this.contract.write[method](args)
      return {
        hash,
        wait: async () => await this.publicClient.waitForTransactionReceipt({ hash })
      }
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  protected async executeCall<T>(method: string, args: any[]): Promise<T> {
    try {
      return await this.contract.read[method](...args)
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }
} 