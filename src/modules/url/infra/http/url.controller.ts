import { Body, Controller, Post } from '@nestjs/common';
import { ShortenUrlUseCase } from '../../application/use-cases/ShortenUrl.use-case';
import { UrlVO } from '../../domain/value-objects/Url.vo';
import { ShortenUrlDto } from './dtos/shorten.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly shortenUrlUseCase: ShortenUrlUseCase) {}

  @Post('shorten')
  async shortenUrl(@Body() body: ShortenUrlDto) {
    return this.shortenUrlUseCase.execute(new UrlVO(body.originalUrl));
  }
}
