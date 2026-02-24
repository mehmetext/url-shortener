import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { StatusCode } from 'src/shared/constants/http-response-codes';
import { ApiCreatedResponseGeneric } from 'src/shared/decorators/api-created-response-generic.decorator';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { DeleteUrlUseCase } from '../../application/use-cases/delete-url.use-case';
import { GetAllShortenedUrlsUseCase } from '../../application/use-cases/get-all-shortened-urls.use-case';
import { GetUrlDetailsByIdUseCase } from '../../application/use-cases/get-url-details-by-id.use-case';
import { RedirectUrlUseCase } from '../../application/use-cases/redirect-url.use-case';
import { ShortenUrlUseCase } from '../../application/use-cases/shorten-url.use-case';
import { UrlVO } from '../../domain/value-objects/url.vo';
import { ShortenUrlResponseDto } from './dtos/shorten-url-response.dto';
import { ShortenUrlDto } from './dtos/shorten-url.dto';

@Controller('urls')
export class UrlController {
  constructor(
    private readonly shortenUrlUseCase: ShortenUrlUseCase,
    private readonly redirectUrlUseCase: RedirectUrlUseCase,
    private readonly getAllShortenedUrlsUseCase: GetAllShortenedUrlsUseCase,
    private readonly getUrlDetailsByIdUseCase: GetUrlDetailsByIdUseCase,
    private readonly deleteUrlUseCase: DeleteUrlUseCase,
  ) {}

  @Post('p-shorten')
  @ApiCreatedResponseGeneric(ShortenUrlResponseDto)
  async pShortenUrl(
    @Body() body: ShortenUrlDto,
  ): Promise<ShortenUrlResponseDto> {
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

  @Post('shorten')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiCreatedResponseGeneric(ShortenUrlResponseDto)
  async shortenUrl(
    @Req() req: Request & { user: UserResponseDto },
    @Body() body: ShortenUrlDto,
  ): Promise<ShortenUrlResponseDto> {
    const url = new UrlVO(body.originalUrl);

    const result = await this.shortenUrlUseCase.execute({
      originalUrl: url,
      expiresAt: body.expiresAt,
      userId: req.user.id,
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
  @ApiBearerAuth()
  @ApiOkResponseGeneric(ShortenUrlResponseDto, { isArray: true })
  @UseGuards(AuthGuard('jwt'))
  async getAllShortenedUrls(
    @Req() req: Request & { user: UserResponseDto },
  ): Promise<ShortenUrlResponseDto[]> {
    const urls = await this.getAllShortenedUrlsUseCase.execute({
      userId: req.user.id,
    });

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

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponseGeneric(ShortenUrlResponseDto)
  @UseGuards(AuthGuard('jwt'))
  async getUrlDetailsById(
    @Param('id') id: string,
  ): Promise<ShortenUrlResponseDto> {
    const url = await this.getUrlDetailsByIdUseCase.execute({ id });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return {
      id: url.id!,
      originalUrl: url.originalUrl.value,
      shortCode: url.shortCode.value,
      expiresAt: url.expiresAt,
      userId: url.userId,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      deletedAt: url.deletedAt,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(StatusCode.NO_CONTENT)
  async deleteUrl(@Param('id') id: string): Promise<void> {
    await this.deleteUrlUseCase.execute({ id });
  }
}
