import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Url } from '../../domain/entities/url.entity';
import { ShortCodeGenerationFailedError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { URL_CACHE_KEY, URL_CACHE_TTL_MS } from '../config/url-cache.config';
import { ShortenUrlCommand } from '../dtos/shorten-url.command';
import { ShortenUrlResult } from '../dtos/shorten-url.result';

export class ShortenUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: ShortenUrlCommand): Promise<ShortenUrlResult> {
    let shortCode: ShortCodeVO;
    let isUnique = false;
    let retryCount = 0;

    while (!isUnique && retryCount < 3) {
      shortCode = new ShortCodeVO(nanoid(6));
      const existing = await this.urlRepository.findByShortCode(
        shortCode.value,
      );
      if (!existing) isUnique = true;
      retryCount++;
    }

    if (!isUnique) {
      throw new ShortCodeGenerationFailedError();
    }

    const url = Url.create({
      originalUrl: command.originalUrl,
      shortCode: shortCode!,
      expiresAt: command.expiresAt,
      userId: command.userId,
    });

    const created = await this.urlRepository.create(url);

    await this.cacheManager.set(
      URL_CACHE_KEY(created.shortCode.value),
      created.toPrimitives(),
      URL_CACHE_TTL_MS,
    );

    return {
      id: created.id!,
      originalUrl: created.originalUrl.value,
      shortCode: created.shortCode.value,
      expiresAt: created.expiresAt,
      userId: created.userId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
