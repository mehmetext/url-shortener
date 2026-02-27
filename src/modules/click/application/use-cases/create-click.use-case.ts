import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UrlRedirectedEvent } from 'src/modules/url/domain/events/url-redirected.event';
import { FindByIpAddressUseCase } from 'src/shared/modules/ip-location/application/use-cases/find-by-ip-address.use-case';
import { CacheCount } from 'src/shared/services/cache-count.service';
import { Click } from '../../domain/entities/click.entity';
import { ClickRepository } from '../../domain/repositories/click.repository';
import { CLICK_COUNT_CACHE_KEY } from '../config/click-cache.config';

@Injectable()
export class CreateClickUseCase {
  constructor(
    @Inject(ClickRepository) private readonly clickRepository: ClickRepository,
    @Inject(CacheCount) private readonly cacheCount: CacheCount,
    @Inject(FindByIpAddressUseCase)
    private readonly findByIpAddressUseCase: FindByIpAddressUseCase,
  ) {}

  @OnEvent('click.created')
  async execute(event: UrlRedirectedEvent): Promise<void> {
    const ipLocation = event.ipAddress
      ? await this.findByIpAddressUseCase.execute(event.ipAddress)
      : null;

    const click = Click.create({
      urlId: event.urlId,
      ipAddress: event.ipAddress,
      country: ipLocation?.country ?? undefined,
      userAgent: event.userAgent,
    });

    await this.clickRepository.create(click);

    const cached = await this.cacheCount.get(
      CLICK_COUNT_CACHE_KEY(event.urlId),
    );

    if (!cached) {
      const count = await this.clickRepository.getCountByUrlId(event.urlId);
      await this.cacheCount.set(CLICK_COUNT_CACHE_KEY(event.urlId), count);
    } else {
      await this.cacheCount.increment(CLICK_COUNT_CACHE_KEY(event.urlId));
    }
  }
}
