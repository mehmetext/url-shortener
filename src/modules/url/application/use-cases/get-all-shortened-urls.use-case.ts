import { Inject } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';

export class GetAllShortenedUrlsUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
  ) {}

  async execute() {
    const urls = await this.urlRepository.findAll();
    return urls;
  }
}
