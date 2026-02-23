import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';

export class RedisRefreshTokenRepository implements RefreshTokenRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async save(
    userId: string,
    jti: string,
    token: string,
    ttl: number,
  ): Promise<void> {
    await this.cache.set(`refresh_token:${userId}:${jti}`, token, ttl);
  }

  async findByUserIdAndJti(
    userId: string,
    jti: string,
  ): Promise<string | null> {
    const value = await this.cache.get<string>(
      `refresh_token:${userId}:${jti}`,
    );

    return value ?? null;
  }

  async delete(userId: string, jti: string): Promise<void> {
    await this.cache.del(`refresh_token:${userId}:${jti}`);
  }
}
