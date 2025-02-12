import { create } from 'ipfs-http-client';
import { IPFSConfig } from '../types/config';

export class IPFSManager {
  private client: any;
  private gateway: string;

  constructor(config: IPFSConfig) {
    this.client = create({
      host: config.host,
      port: config.port,
      protocol: config.protocol
    });
    this.gateway = config.gateway;
  }

  async uploadMetadata(metadata: any): Promise<string> {
    const result = await this.client.add(JSON.stringify(metadata));
    return result.path;
  }

  async getMetadata(hash: string): Promise<any> {
    const stream = this.client.cat(hash);
    const data = await this.streamToString(stream);
    return JSON.parse(data);
  }
} 