export class LoginResult {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number,
    public readonly user: {
      id: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt?: Date | null;
    },
  ) {}
}
