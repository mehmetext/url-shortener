import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Click } from '../../domain/entities/click.entity';
import { ClickRepository } from '../../domain/repositories/click.repository';
import {
  CLICK_COUNT_CACHE_KEY,
  CLICK_COUNT_CACHE_TTL_MS,
} from '../config/click-cache.config';
import { CreateClickCommand } from '../dtos/create-click.command';

@Injectable()
export class CreateClickUseCase {
  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: CreateClickCommand): Promise<Click> {
    const click = await this.clickRepository.create(command);

    const cached = await this.cacheManager.get<number>(
      CLICK_COUNT_CACHE_KEY(command.urlId),
    );

    if (cached) {
      await this.cacheManager.set(
        CLICK_COUNT_CACHE_KEY(command.urlId),
        cached + 1,
        CLICK_COUNT_CACHE_TTL_MS,
      );
    }

    return click;
  }
}
