import { Inject } from '@nestjs/common';
import { Url } from '../../domain/entities/url.entity';
import { UrlExpiredError, UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';

export class RedirectUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
  ) {}

  async execute(shortCode: string): Promise<Url> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      throw new UrlNotFoundError();
    }

    if (url.isExpired()) {
      throw new UrlExpiredError();
    }

    return url;
  }
}
