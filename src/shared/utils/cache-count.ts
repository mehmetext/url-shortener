import { Cache } from '@nestjs/cache-manager';
import type { RedisClientType } from '@redis/client';

export class CacheCount {
  private readonly store: { getClient: () => Promise<RedisClientType> };

  constructor(private readonly cacheManager: Cache) {
    this.store = (
      this.cacheManager as {
        stores: { store: { getClient: () => Promise<RedisClientType> } }[];
      }
    ).stores[0].store;
  }

  private async getClient(): Promise<RedisClientType> {
    if (typeof this.store.getClient === 'function') {
      return this.store.getClient();
    }

    throw new Error('Redis store not supported getClient()');
  }

  async increment(key: string): Promise<number> {
    const redisClient = await this.getClient();
    const rawKey = `counter:${key}`;

    return await redisClient.incr(rawKey);
  }

  async get(key: string): Promise<number | null> {
    const redisClient = await this.getClient();
    const rawKey = `counter:${key}`;
    const value = await redisClient.get(rawKey);

    return value ? parseInt(value) : null;
  }

  async set(key: string, value: number): Promise<void> {
    const redisClient = await this.getClient();
    const rawKey = `counter:${key}`;
    await redisClient.set(rawKey, value.toString());
  }
}
