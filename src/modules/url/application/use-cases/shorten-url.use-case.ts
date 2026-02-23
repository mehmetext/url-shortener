import { Inject } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Url } from '../../domain/entities/url.entity';
import { IUrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { ShortenUrlCommand } from '../dtos/shorten-url.command';

export class ShortenUrlUseCase {
  constructor(
    @Inject(IUrlRepository) private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(command: ShortenUrlCommand): Promise<Url> {
    const shortCode = new ShortCodeVO(nanoid(6));

    const url = new Url(
      undefined,
      command.originalUrl,
      shortCode,
      command.expiresAt,
      undefined,
      new Date(),
      new Date(),
      undefined,
    );

    return this.urlRepository.create(url);
  }
}
