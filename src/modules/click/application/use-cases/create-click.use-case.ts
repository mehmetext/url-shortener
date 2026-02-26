import { Inject, Injectable } from '@nestjs/common';
import { CacheCount } from 'src/shared/services/cache-count.service';
import { Click } from '../../domain/entities/click.entity';
import { ClickRepository } from '../../domain/repositories/click.repository';
import { CLICK_COUNT_CACHE_KEY } from '../config/click-cache.config';
import { CreateClickCommand } from '../dtos/create-click.command';

@Injectable()
export class CreateClickUseCase {
  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
    @Inject(CacheCount) private readonly cacheCount: CacheCount,
  ) {}

  async execute(command: CreateClickCommand): Promise<Click> {
    const click = await this.clickRepository.create(command);

    const cached = await this.cacheCount.get(
      CLICK_COUNT_CACHE_KEY(command.urlId),
    );

    if (!cached) {
      const count = await this.clickRepository.getCountByUrlId(command.urlId);
      await this.cacheCount.set(CLICK_COUNT_CACHE_KEY(command.urlId), count);
    } else {
      await this.cacheCount.increment(CLICK_COUNT_CACHE_KEY(command.urlId));
    }

    return click;
  }
}
