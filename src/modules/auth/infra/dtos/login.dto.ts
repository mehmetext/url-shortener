import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  @ApiProperty({
    description: 'The password of the user',
    example: 'Password@123',
  })
  password: string;
}
