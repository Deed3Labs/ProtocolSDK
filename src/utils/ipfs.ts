import { create } from 'ipfs-http-client';
import { IPFSConfig } from '../types/config';

export class IPFSManager {
  private client: any;

  constructor(config: IPFSConfig) {
    this.client = create({
      host: config.host,
      port: config.port,
      protocol: config.protocol
    });
  }

  async uploadMetadata(metadata: any): Promise<string> {
    const result = await this.client.add(JSON.stringify(metadata));
    return result.path;
  }

  private async streamToString(stream: any): Promise<string> {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString();
  }

  async getMetadata(hash: string): Promise<any> {
    const stream = this.client.cat(hash);
    return JSON.parse(await this.streamToString(stream));
  }
}