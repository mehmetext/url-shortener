import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Url, UrlPrimitives } from '../../domain/entities/url.entity';
import { UrlExpiredError, UrlNotFoundError } from '../../domain/errors';
import { UrlRedirectedEvent } from '../../domain/events/url-redirected.event';
import { UrlRepository } from '../../domain/repositories/url.repository';
import {
  URL_CACHE_KEY,
  URL_CACHE_NOT_FOUND_TTL_MS,
  URL_CACHE_TTL_MS,
} from '../config/url-cache.config';
import { RedirectUrlCommand } from '../dtos/redirect-url.command';
import { ShortenUrlResult } from '../dtos/shorten-url.result';

export class RedirectUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: RedirectUrlCommand): Promise<ShortenUrlResult> {
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

    this.eventEmitter.emit(
      'click.created',
      new UrlRedirectedEvent(url.id!, command.ipAddress, command.userAgent),
    );

    return {
      id: url.id!,
      originalUrl: url.originalUrl.value,
      shortCode: url.shortCode.value,
      expiresAt: url.expiresAt,
      userId: url.userId,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }
}
