import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'The access token',
    example: 'token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token',
    example: 'token',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The expires in',
    example: 15 * 60,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'The user',
  })
  user: UserResponseDto;
}
