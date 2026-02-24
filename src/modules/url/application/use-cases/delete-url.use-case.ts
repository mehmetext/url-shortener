import { Inject } from '@nestjs/common';
import { UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { DeleteUrlCommand } from '../dtos/delete-url.command';

export class DeleteUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
  ) {}

  async execute(command: DeleteUrlCommand) {
    const url = await this.urlRepository.findById(command.id);

    if (!url) {
      throw new UrlNotFoundError();
    }

    await this.urlRepository.delete(command.id);
  }
}
