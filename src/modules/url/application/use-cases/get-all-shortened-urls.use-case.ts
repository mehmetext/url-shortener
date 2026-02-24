import { Inject } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { GetAllShortenedUrlsCommand } from '../dtos/get-all-shortened-urls.command';

export class GetAllShortenedUrlsUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
  ) {}

  async execute(command: GetAllShortenedUrlsCommand) {
    const urls = await this.urlRepository.findAllByUserId(command.userId);
    return urls;
  }
}
