import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { URL_CACHE_KEY } from '../config/url-cache.config';
import { DeleteUrlCommand } from '../dtos/delete-url.command';

export class DeleteUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(command: DeleteUrlCommand) {
    const url = await this.urlRepository.findById(command.id);

    if (!url) {
      throw new UrlNotFoundError();
    }

    await this.cacheManager.del(URL_CACHE_KEY(url.shortCode.value));

    await this.urlRepository.delete(command.id);
  }
}
