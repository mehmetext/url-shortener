import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { CacheCount } from 'src/shared/utils/cache-count';
import { Click } from '../../domain/entities/click.entity';
import { ClickRepository } from '../../domain/repositories/click.repository';
import { CLICK_COUNT_CACHE_KEY } from '../config/click-cache.config';
import { CreateClickCommand } from '../dtos/create-click.command';

@Injectable()
export class CreateClickUseCase {
  private readonly cacheCount: CacheCount;
  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.cacheCount = new CacheCount(this.cacheManager);
  }

  async execute(command: CreateClickCommand): Promise<Click> {
    const click = await this.clickRepository.create(command);

    const cachedCount = await this.cacheCount.get(
      CLICK_COUNT_CACHE_KEY(command.urlId),
    );

    if (cachedCount) {
      await this.cacheCount.set(
        CLICK_COUNT_CACHE_KEY(command.urlId),
        cachedCount + 1,
      );
    }

    return click;
  }
}
