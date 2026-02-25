import { Inject } from '@nestjs/common';
import { CreateClickUseCase } from 'src/modules/click/application/use-cases/create-click.use-case';
import { FindByIpAddressUseCase } from 'src/shared/modules/ip-location/application/use-cases/find-by-ip-address.use-case';
import { Url } from '../../domain/entities/url.entity';
import { UrlExpiredError, UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { RedirectUrlCommand } from '../dtos/redirect-url.command';

export class RedirectUrlUseCase {
  constructor(
    @Inject(UrlRepository) private readonly urlRepository: UrlRepository,
    @Inject(CreateClickUseCase)
    private readonly createClickUseCase: CreateClickUseCase,
    @Inject(FindByIpAddressUseCase)
    private readonly findByIpAddressUseCase: FindByIpAddressUseCase,
  ) {}

  async execute(command: RedirectUrlCommand): Promise<Url> {
    const url = await this.urlRepository.findByShortCode(command.shortCode);

    if (!url) {
      throw new UrlNotFoundError();
    }

    if (url.isExpired()) {
      throw new UrlExpiredError();
    }

    const ipLocation = command.ipAddress
      ? await this.findByIpAddressUseCase.execute(command.ipAddress)
      : null;

    await this.createClickUseCase.execute({
      urlId: url.id!,
      ipAddress: command.ipAddress,
      country: ipLocation?.country ?? undefined,
      userAgent: command.userAgent,
    });

    return url;
  }
}
