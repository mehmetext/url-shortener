import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The created at date of the user',
    example: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the user',
    example: new Date().toISOString(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The deleted at date of the user (optional)',
    example: new Date().toISOString(),
    nullable: true,
  })
  deletedAt?: Date | null;
}
