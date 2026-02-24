import { Module } from '@nestjs/common';
import { ClickModule } from 'src/modules/click/infra/click.module';
import { DeleteUrlUseCase } from '../application/use-cases/delete-url.use-case';
import { GetAllShortenedUrlsUseCase } from '../application/use-cases/get-all-shortened-urls.use-case';
import { GetUrlDetailsByIdUseCase } from '../application/use-cases/get-url-details-by-id.use-case';
import { RedirectUrlUseCase } from '../application/use-cases/redirect-url.use-case';
import { ShortenUrlUseCase } from '../application/use-cases/shorten-url.use-case';
import { UrlRepository } from '../domain/repositories/url.repository';
import { PrismaUrlRepository } from './db/prisma-url.repository';
import { UrlController } from './http/url.controller';

@Module({
  controllers: [UrlController],
  imports: [ClickModule],
  providers: [
    {
      provide: UrlRepository,
      useClass: PrismaUrlRepository,
    },
    ShortenUrlUseCase,
    RedirectUrlUseCase,
    GetAllShortenedUrlsUseCase,
    GetUrlDetailsByIdUseCase,
    DeleteUrlUseCase,
  ],
})
export class UrlModule {}
