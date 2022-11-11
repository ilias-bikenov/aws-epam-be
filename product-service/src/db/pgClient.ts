import { Client } from 'pg';
import AbstractDbClient from './dbClient';

export default class PG extends AbstractDbClient {
  private client: Client;

  constructor(pgConfig: any) {
    super(pgConfig);
    this.client = new Client(pgConfig);
  }

  public async execute(query: string, args: any[]) {
    const result = await this.client.query(query, args);
    return result;
  }
}
