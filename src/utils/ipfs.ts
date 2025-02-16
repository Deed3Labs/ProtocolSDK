import type { Blockstore } from 'interface-blockstore'
import { MemoryBlockstore } from 'blockstore-core/memory'
import { ProtocolError, ErrorType } from './errors'
import type { Helia } from 'helia'
import type { UnixFS } from '@helia/unixfs'

interface IPFSClientConfig {
  blockstore?: Blockstore
}

export class IPFSClient {
  private helia!: Helia
  private fs!: UnixFS
  private initialized: Promise<void>
  private disposed = false

  constructor(config: IPFSClientConfig = {}) {
    this.initialized = this.initialize(config)
  }

  private async initialize(config: IPFSClientConfig) {
    try {
      const blockstore = config.blockstore || new MemoryBlockstore()
      
      // Dynamic imports to avoid ESM/CJS issues
      const { createHelia } = await import('helia')
      const { unixfs } = await import('@helia/unixfs')
      
      this.helia = await createHelia({ blockstore })
      this.fs = unixfs(this.helia)
    } catch (error) {
      throw new ProtocolError(
        'Failed to initialize IPFS client',
        ErrorType.INITIALIZATION_ERROR,
        error
      )
    }
  }

  async addFile(content: string): Promise<string> {
    if (this.disposed) {
      throw new ProtocolError(
        'IPFS client has been disposed',
        ErrorType.CLIENT_ERROR
      )
    }

    try {
      await this.initialized
      const encoder = new TextEncoder()
      const cid = await this.fs.addBytes(encoder.encode(content))
      return cid.toString()
    } catch (error) {
      throw new ProtocolError(
        'Failed to add file to IPFS',
        ErrorType.IPFS_ERROR,
        error
      )
    }
  }

  async getFile(cid: string): Promise<string> {
    if (this.disposed) {
      throw new ProtocolError(
        'IPFS client has been disposed',
        ErrorType.CLIENT_ERROR
      )
    }

    try {
      await this.initialized
      const decoder = new TextDecoder()
      const chunks: Uint8Array[] = []
      for await (const chunk of this.fs.cat(cid)) {
        chunks.push(chunk)
      }
      return decoder.decode(Buffer.concat(chunks))
    } catch (error) {
      throw new ProtocolError(
        'Failed to get file from IPFS',
        ErrorType.IPFS_ERROR,
        error
      )
    }
  }

  async dispose(): Promise<void> {
    if (!this.disposed) {
      this.disposed = true
      await this.helia.stop()
    }
  }
}