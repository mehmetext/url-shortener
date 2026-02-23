import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlResponseDto {
  @ApiProperty({
    description: 'The ID of the shortened URL',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The original URL',
    example: 'https://www.google.com',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'The short code of the shortened URL',
    example: 'abc123',
  })
  shortCode: string;

  @ApiProperty({
    description: 'The expiration date of the shortened URL (optional)',
    example: new Date().toISOString(),
    nullable: true,
  })
  expiresAt?: Date | null;

  @ApiProperty({
    description: 'The user ID of the shortened URL (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  userId?: string | null;

  @ApiProperty({
    description: 'The created at date of the shortened URL',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the shortened URL',
    example: new Date().toISOString(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The deleted at date of the shortened URL (optional)',
    example: new Date().toISOString(),
    nullable: true,
  })
  deletedAt?: Date | null;
}
