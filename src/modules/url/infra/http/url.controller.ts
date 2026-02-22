import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ShortenUrlUseCase } from '../../application/use-cases/ShortenUrl.use-case';
import { UrlVO } from '../../domain/value-objects/Url.vo';
import { ShortenUrlDto } from './dtos/shorten.dto';
import { ShortenUrlResponse } from './dtos/shorten.response';

@Controller('url')
export class UrlController {
  constructor(private readonly shortenUrlUseCase: ShortenUrlUseCase) {}

  @Post('shorten')
  @ApiCreatedResponse({ type: ShortenUrlResponse })
  async shortenUrl(@Body() body: ShortenUrlDto): Promise<ShortenUrlResponse> {
    const url = new UrlVO(body.originalUrl);

    const result = await this.shortenUrlUseCase.execute({
      originalUrl: url,
      expiresAt: body.expiresAt,
    });

    return {
      id: result.id!,
      originalUrl: result.originalUrl.value,
      shortCode: result.shortCode.value,
      expiresAt: result.expiresAt,
      userId: result.userId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
