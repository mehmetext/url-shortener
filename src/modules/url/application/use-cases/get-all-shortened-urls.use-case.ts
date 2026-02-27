import { Inject } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { GetAllShortenedUrlsCommand } from '../dtos/get-all-shortened-urls.command';
import { ShortenUrlResult } from '../dtos/shorten-url.result';

export class GetAllShortenedUrlsUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
  ) {}

  async execute(
    command: GetAllShortenedUrlsCommand,
  ): Promise<ShortenUrlResult[]> {
    const urls = await this.urlRepository.findAllByUserId(command.userId);

    return urls.map((url) => ({
      id: url.id!,
      originalUrl: url.originalUrl.value,
      shortCode: url.shortCode.value,
      expiresAt: url.expiresAt,
      userId: url.userId,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    }));
  }
}
