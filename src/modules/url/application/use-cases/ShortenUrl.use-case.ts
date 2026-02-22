import { Inject } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Url } from '../../domain/entities/Url.entity';
import { IUrlRepository } from '../../domain/repositories/IUrlRepository';
import { ShortCodeVO } from '../../domain/value-objects/ShortCode.vo';
import { UrlVO } from '../../domain/value-objects/Url.vo';

export class ShortenUrlUseCase {
  constructor(
    @Inject(IUrlRepository) private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(originalUrl: UrlVO): Promise<Url> {
    const shortCode = new ShortCodeVO(nanoid(6));

    const url = new Url(
      undefined,
      originalUrl,
      shortCode,
      undefined,
      undefined,
      new Date(),
      new Date(),
      undefined,
    );

    return this.urlRepository.create(url);
  }
}
