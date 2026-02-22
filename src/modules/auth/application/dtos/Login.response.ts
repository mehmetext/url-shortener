import { User } from 'src/modules/user/domain/entities/user.entity';

export class LoginResponseDto {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number,
    public readonly user: User,
  ) {}
}
