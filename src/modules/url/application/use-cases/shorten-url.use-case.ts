import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Url } from '../../domain/entities/url.entity';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { URL_CACHE_KEY, URL_CACHE_TTL_MS } from '../config/url-cache.config';
import { ShortenUrlCommand } from '../dtos/shorten-url.command';

export class ShortenUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: ShortenUrlCommand): Promise<Url> {
    const shortCode = new ShortCodeVO(nanoid(6));

    const url = new Url(
      undefined,
      command.originalUrl,
      shortCode,
      command.expiresAt,
      command.userId,
      new Date(),
      new Date(),
      undefined,
    );

    const created = await this.urlRepository.create(url);

    await this.cacheManager.set(
      URL_CACHE_KEY(created.shortCode.value),
      created.toPrimitives(),
      URL_CACHE_TTL_MS,
    );

    return created;
  }
}
