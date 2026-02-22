import { Module } from '@nestjs/common';
import { GetAllShortenedUrlsUseCase } from '../application/use-cases/GetAllShortenedUrls.use-case';
import { RedirectUrlUseCase } from '../application/use-cases/RedirectUrl.use-case';
import { ShortenUrlUseCase } from '../application/use-cases/ShortenUrl.use-case';
import { IUrlRepository } from '../domain/repositories/IUrlRepository';
import { PrismaUrlRepository } from './db/prisma-url.repository';
import { UrlController } from './http/url.controller';

@Module({
  controllers: [UrlController],
  imports: [],
  providers: [
    {
      provide: IUrlRepository,
      useClass: PrismaUrlRepository,
    },
    ShortenUrlUseCase,
    RedirectUrlUseCase,
    GetAllShortenedUrlsUseCase,
  ],
})
export class UrlModule {}
