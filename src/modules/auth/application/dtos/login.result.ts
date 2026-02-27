import { UserResult } from 'src/modules/user/application/dtos/user.result';

export class LoginResult {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number,
    public readonly user: UserResult,
  ) {}
}
