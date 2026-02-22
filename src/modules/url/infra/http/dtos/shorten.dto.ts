import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'The original URL to shorten',
    example: 'https://www.google.com',
  })
  originalUrl: string;
}
