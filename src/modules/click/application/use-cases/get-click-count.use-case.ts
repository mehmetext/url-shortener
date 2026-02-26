import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { ClickRepository } from '../../domain/repositories/click.repository';
import {
  CLICK_COUNT_CACHE_KEY,
  CLICK_COUNT_CACHE_TTL_MS,
} from '../config/click-cache.config';

export class GetClickCountUseCase {
  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(urlId: string): Promise<number> {
    const cached = await this.cacheManager.get<number>(
      CLICK_COUNT_CACHE_KEY(urlId),
    );

    if (cached) {
      return cached;
    }

    const count = await this.clickRepository.getCountByUrlId(urlId);

    await this.cacheManager.set(
      CLICK_COUNT_CACHE_KEY(urlId),
      count,
      CLICK_COUNT_CACHE_TTL_MS,
    );

    return count;
  }
}
