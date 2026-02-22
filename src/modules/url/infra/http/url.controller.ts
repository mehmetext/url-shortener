import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { GetAllShortenedUrlsUseCase } from '../../application/use-cases/GetAllShortenedUrls.use-case';
import { RedirectUrlUseCase } from '../../application/use-cases/RedirectUrl.use-case';
import { ShortenUrlUseCase } from '../../application/use-cases/ShortenUrl.use-case';
import { UrlVO } from '../../domain/value-objects/Url.vo';
import { ShortenUrlDto } from './dtos/shorten.dto';
import { ShortenUrlResponse } from './dtos/shorten.response';

@Controller('url')
export class UrlController {
  constructor(
    private readonly shortenUrlUseCase: ShortenUrlUseCase,
    private readonly redirectUrlUseCase: RedirectUrlUseCase,
    private readonly getAllShortenedUrlsUseCase: GetAllShortenedUrlsUseCase,
  ) {}

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

  @Get(':shortCode')
  @Redirect()
  async redirectUrl(
    @Param('shortCode') shortCode: string,
  ): Promise<{ url: string; statusCode: number }> {
    const url = await this.redirectUrlUseCase.execute(shortCode);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return {
      url: url.originalUrl.value,
      statusCode: 302,
    };
  }

  @Get()
  @ApiOkResponse({ type: [ShortenUrlResponse] })
  async getAllShortenedUrls(): Promise<ShortenUrlResponse[]> {
    const urls = await this.getAllShortenedUrlsUseCase.execute();

    return urls.map((url) => ({
      id: url.id!,
      originalUrl: url.originalUrl.value,
      shortCode: url.shortCode.value,
      expiresAt: url.expiresAt,
      userId: url.userId,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      deletedAt: url.deletedAt,
    }));
  }
}
