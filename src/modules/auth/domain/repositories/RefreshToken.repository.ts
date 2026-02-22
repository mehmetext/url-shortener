export abstract class RefreshTokenRepository {
  abstract save(
    userId: string,
    jti: string,
    token: string,
    ttl: number,
  ): Promise<void>;
  abstract findByUserIdAndJti(
    userId: string,
    jti: string,
  ): Promise<string | null>;
  abstract delete(userId: string, jti: string): Promise<void>;
}
