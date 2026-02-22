export abstract class TokenGeneratorRepository {
  abstract generateToken(
    payload: Record<string, any>,
    options?: { expiresIn: string; secret: string },
  ): Promise<string>;
  abstract verifyToken(
    token: string,
    options?: { secret: string },
  ): Promise<{ sub: string; jti: string }>;
}
