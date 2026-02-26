import { Inject, Injectable } from '@nestjs/common';
import { CacheCount } from 'src/shared/services/cache-count.service';
import { ClickRepository } from '../../domain/repositories/click.repository';
import { CLICK_COUNT_CACHE_KEY } from '../config/click-cache.config';

@Injectable()
export class GetClickCountUseCase {
  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
    @Inject(CacheCount) private readonly cacheCount: CacheCount,
  ) {}

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
