import { 
  type PublicClient, 
  type Log,
  type Address,
  type Abi,
  type GetContractEventsParameters,
  getContract
} from 'viem'
import { ProtocolError, ErrorType } from './errors'

export type EventCallback = (log: Log) => void
export type ContractEvents = Record<string, Abi>

export class EventManager {
  private watchers: Map<string, () => void> = new Map()
  private listeners: Map<string, Function[]> = new Map()

  constructor(private publicClient: PublicClient) {}

  async getLogs(params: GetContractEventsParameters): Promise<Log[]> {
    try {
      return await this.publicClient.getContractEvents(params)
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  watchContractEvent(
    address: Address,
    abi: Abi,
    eventName: string,
    callback: (logs: Log[]) => void,
    fromBlock?: bigint
  ): void {
    const contract = getContract({
      address,
      abi,
      client: {
        public: this.publicClient
      }
    })

    const unwatch = contract.watchEvent.subscribe(
      [eventName],
      {
        onLogs: callback,
        strict: true,
        fromBlock
      }
    )
    
    this.watchers.set(`${address}-${eventName}`, unwatch)
  }

  cleanup(): void {
    this.watchers.forEach(unwatch => unwatch())
    this.watchers.clear()
  }

  async subscribe(
    address: Address,
    abi: Abi,
    eventName: string,
    callback: EventCallback,
    fromBlock?: bigint
  ): Promise<string> {
    try {
      const subscriptionId = `${address}-${eventName}-${Date.now()}`
      
      this.watchContractEvent(
        address,
        abi,
        eventName,
        (logs) => logs.forEach(callback),
        fromBlock
      )
      
      return subscriptionId
    } catch (error) {
      throw new ProtocolError(
        ErrorType.CONTRACT_ERROR,
        ErrorType.CONTRACT_ERROR,
        error
      )
    }
  }

  unsubscribe(subscriptionId: string): void {
    const unwatch = this.watchers.get(subscriptionId)
    if (unwatch) {
      unwatch()
      this.watchers.delete(subscriptionId)
    }
  }

  async getPastEvents(
    address: Address,
    abi: Abi,
    eventName: string,
    fromBlock: bigint,
    toBlock: bigint
  ): Promise<Log[]> {
    try {
      return await this.publicClient.getContractEvents({
        address,
        abi,
        eventName,
        fromBlock,
        toBlock
      })
    } catch (error) {
      throw new ProtocolError(
        ErrorType.CONTRACT_ERROR,
        ErrorType.CONTRACT_ERROR,
        error
      )
    }
  }

  removeAllListeners(): void {
    this.listeners.clear()
  }
} 