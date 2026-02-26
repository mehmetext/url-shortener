import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { CreateClickUseCase } from 'src/modules/click/application/use-cases/create-click.use-case';
import { FindByIpAddressUseCase } from 'src/shared/modules/ip-location/application/use-cases/find-by-ip-address.use-case';
import { Url, UrlPrimitives } from '../../domain/entities/url.entity';
import { UrlExpiredError, UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import {
  URL_CACHE_KEY,
  URL_CACHE_NOT_FOUND_TTL_MS,
  URL_CACHE_TTL_MS,
} from '../config/url-cache.config';
import { RedirectUrlCommand } from '../dtos/redirect-url.command';

export class RedirectUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
    @Inject(CreateClickUseCase)
    private readonly createClickUseCase: CreateClickUseCase,
    @Inject(FindByIpAddressUseCase)
    private readonly findByIpAddressUseCase: FindByIpAddressUseCase,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: RedirectUrlCommand): Promise<Url> {
    const cached = await this.cacheManager.get<
      UrlPrimitives | { notFound: true }
    >(URL_CACHE_KEY(command.shortCode));

    let url: Url | null = null;

    if (cached) {
      if ('notFound' in cached) {
        throw new UrlNotFoundError();
      }

      url = Url.fromPrimitives(cached);
    } else {
      url = await this.urlRepository.findByShortCode(command.shortCode);

      if (!url) {
        await this.cacheManager.set(
          URL_CACHE_KEY(command.shortCode),
          { notFound: true },
          URL_CACHE_NOT_FOUND_TTL_MS,
        );
        throw new UrlNotFoundError();
      }

      await this.cacheManager.set(
        URL_CACHE_KEY(command.shortCode),
        url.toPrimitives(),
        URL_CACHE_TTL_MS,
      );
    }

    if (url.isExpired()) {
      throw new UrlExpiredError();
    }

    const ipLocation = command.ipAddress
      ? await this.findByIpAddressUseCase.execute(command.ipAddress)
      : null;

    await this.createClickUseCase.execute({
      urlId: url.id!,
      ipAddress: command.ipAddress,
      country: ipLocation?.country ?? undefined,
      userAgent: command.userAgent,
    });

    return url;
  }
}
