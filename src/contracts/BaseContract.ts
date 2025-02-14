import { 
  type PublicClient, 
  type WalletClient,
  type Address,
  type Hash,
  type TransactionReceipt,
  type Abi,
  type GetContractReturnType,
  getContract
} from 'viem'
import { ProtocolError, ErrorType } from '../utils/errors'

export abstract class BaseContract {
  protected contract!: GetContractReturnType<Abi>

  constructor(
    protected publicClient: PublicClient,
    protected walletClient: WalletClient,
    protected address: Address,
    protected abi: Abi
  ) {
    this.contract = getContract({
      address: this.address,
      abi: this.abi as Abi,
      client: this.publicClient
    }) as GetContractReturnType<Abi>
  }

  protected async executeTransaction(
    method: string,
    args: any[]
  ): Promise<{ hash: Hash; wait: () => Promise<TransactionReceipt> }> {
    try {
      if (!this.walletClient) {
        throw new ProtocolError(
          'Wallet client is required for signing transactions',
          ErrorType.UNAUTHORIZED
        )
      }

      const { request } = await this.publicClient.simulateContract({
        address: this.address,
        abi: this.abi as Abi,
        functionName: method,
        args,
        account: this.walletClient.account
      })

      const hash = await this.walletClient.writeContract(request)
      
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
      const data = await this.publicClient.readContract({
        address: this.address,
        abi: this.abi as Abi,
        functionName: method,
        args
      })
      return data as T
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }
} 