import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { CacheCount } from 'src/shared/utils/cache-count';
import { ClickRepository } from '../../domain/repositories/click.repository';
import { CLICK_COUNT_CACHE_KEY } from '../config/click-cache.config';

export class GetClickCountUseCase {
  private readonly cacheCount: CacheCount;

  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.cacheCount = new CacheCount(this.cacheManager);
  }

  async execute(urlId: string): Promise<number> {
    const cached = await this.cacheCount.get(CLICK_COUNT_CACHE_KEY(urlId));

    if (cached) {
      return cached;
    }

    const count = await this.clickRepository.getCountByUrlId(urlId);

    await this.cacheCount.set(CLICK_COUNT_CACHE_KEY(urlId), count);

    return count;
  }
}
