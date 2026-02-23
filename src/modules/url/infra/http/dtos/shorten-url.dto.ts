import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class ShortenUrlDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'The original URL to shorten',
    example: 'https://www.google.com',
  })
  originalUrl: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'The expiration date',
    example: new Date().toISOString(),
  })
  expiresAt?: Date;
}
