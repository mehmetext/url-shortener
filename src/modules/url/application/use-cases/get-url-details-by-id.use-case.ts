import { Inject } from '@nestjs/common';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { GetUrlDetailsByIdCommand } from '../dtos/get-url-details-by-id.commands';

export class GetUrlDetailsByIdUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
  ) {}

  async execute(command: GetUrlDetailsByIdCommand) {
    const url = await this.urlRepository.findById(command.id);

    return url;
  }
}
