import { Inject } from '@nestjs/common';
import { Url } from '../../domain/entities/Url.entity';
import { IUrlRepository } from '../../domain/repositories/IUrlRepository';

export class RedirectUrlUseCase {
  constructor(
    @Inject(IUrlRepository) private readonly urlRepository: IUrlRepository,
  ) {}

  async execute(shortCode: string): Promise<Url | null> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      return null;
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      await this.urlRepository.delete(url.id!);
      return null;
    }

    return url;
  }
}
