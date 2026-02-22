import { Module } from '@nestjs/common';
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
  ],
})
export class UrlModule {}
