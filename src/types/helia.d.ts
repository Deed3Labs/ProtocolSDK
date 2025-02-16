declare module 'helia' {
  export interface HeliaInit {
    blockstore?: any
  }

  export interface Helia {
    stop(): Promise<void>
  }

  export function createHelia(init?: HeliaInit): Promise<Helia>
}

declare module '@helia/unixfs' {
  import type { Helia } from 'helia'

  export interface UnixFS {
    addBytes(bytes: Uint8Array): Promise<{ toString(): string }>
    cat(cid: string): AsyncIterable<Uint8Array>
  }

  export function unixfs(helia: Helia): UnixFS
} 