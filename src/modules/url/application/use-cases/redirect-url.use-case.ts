import { Inject } from '@nestjs/common';
import { CreateClickUseCase } from 'src/modules/click/application/use-cases/create-click.use-case';
import { Url } from '../../domain/entities/url.entity';
import { UrlExpiredError, UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';

export class RedirectUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
    @Inject(CreateClickUseCase)
    private readonly createClickUseCase: CreateClickUseCase,
  ) {}

  async execute(shortCode: string): Promise<Url> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      throw new UrlNotFoundError();
    }

    if (url.isExpired()) {
      throw new UrlExpiredError();
    }

    await this.createClickUseCase.execute({ urlId: url.id! });

    return url;
  }
}
