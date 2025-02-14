import { 
  type PublicClient, 
  type Log,
  type Address,
  type Abi,
  createEventFilter,
  getEventArgs,
  type GetLogsParameters,
  watchContractEvent
} from 'viem'
import { ProtocolError, ErrorType } from './errors'

export type EventCallback = (log: Log) => void
export type ContractEvents = Record<string, Abi>

export class EventManager {
  private watchers: Map<string, () => void> = new Map()

  constructor(private publicClient: PublicClient) {}

  async getLogs(params: GetLogsParameters): Promise<Log[]> {
    try {
      return await this.publicClient.getLogs(params)
    } catch (error) {
      throw ProtocolError.fromError(error)
    }
  }

  watchEvent(
    address: Address,
    eventName: string,
    callback: (log: Log) => void
  ): void {
    const unwatch = watchContractEvent(this.publicClient, {
      address,
      eventName,
      onLogs: callback
    })
    
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
      const filter = await createEventFilter(this.publicClient, {
        address,
        event: abi.find(x => x.type === 'event' && x.name === eventName),
        fromBlock
      })

      const unwatch = this.publicClient.watchContractEvent({
        ...filter,
        onLogs: (logs) => {
          logs.forEach(log => {
            const args = getEventArgs({ abi, eventName, log })
            callback({ ...log, args })
          })
        }
      })

      const subscriptionId = `${address}-${eventName}-${Date.now()}`
      this.watchers.set(subscriptionId, unwatch)
      return subscriptionId

    } catch (error) {
      throw new ProtocolError(
        ErrorType.EVENT_SUBSCRIPTION,
        `Failed to subscribe to event ${eventName}`,
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
      const logs = await this.publicClient.getContractEvents({
        address,
        abi,
        eventName,
        fromBlock,
        toBlock
      })

      return logs.map(log => ({
        ...log,
        args: getEventArgs({ abi, eventName, log })
      }))
    } catch (error) {
      throw new ProtocolError(
        ErrorType.EVENT_SUBSCRIPTION,
        `Failed to get past events for ${eventName}`,
        error
      )
    }
  }
} 