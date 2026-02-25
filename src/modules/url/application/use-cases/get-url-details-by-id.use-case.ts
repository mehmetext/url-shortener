import { Inject } from '@nestjs/common';
import { GetClickCountUseCase } from 'src/modules/click/application/use-cases/get-click-count.use-case';
import { UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { GetUrlDetailsByIdCommand } from '../dtos/get-url-details-by-id.commands';
import { GetUrlDetailsByIdResult } from '../dtos/get-url-details-by-id.result';

export class GetUrlDetailsByIdUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
    @Inject(GetClickCountUseCase)
    private readonly getClickCountUseCase: GetClickCountUseCase,
  ) {}

  async execute(
    command: GetUrlDetailsByIdCommand,
  ): Promise<GetUrlDetailsByIdResult> {
    const url = await this.urlRepository.findById(command.id);

    if (!url) {
      throw new UrlNotFoundError();
    }

    const clicks = await this.getClickCountUseCase.execute(url.id!);

    return {
      id: url.id!,
      originalUrl: url.originalUrl.value,
      shortCode: url.shortCode.value,
      expiresAt: url.expiresAt ?? null,
      userId: url.userId ?? null,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      deletedAt: url.deletedAt ?? null,
      clicks: clicks,
    };
  }
}
