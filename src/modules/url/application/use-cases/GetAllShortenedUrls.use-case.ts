import { Inject } from '@nestjs/common';
import { IUrlRepository } from '../../domain/repositories/IUrlRepository';

export class GetAllShortenedUrlsUseCase {
  constructor(
    @Inject(IUrlRepository) private readonly urlRepository: IUrlRepository,
  ) {}

  async execute() {
    const urls = await this.urlRepository.findAll();
    return urls;
  }
}
