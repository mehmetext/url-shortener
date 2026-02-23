import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { TokenGeneratorRepository } from '../../domain/repositories/token-generator.repository';

export class JwtTokenGeneratorRepository implements TokenGeneratorRepository {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  async generateToken(
    payload: Record<string, any>,
    options?: { expiresIn: string; secret: string },
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: options?.expiresIn as StringValue,
      secret: options?.secret,
    });
  }

  async verifyToken(
    token: string,
    options?: { secret: string },
  ): Promise<{ sub: string; jti: string }> {
    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      jti: string;
    }>(token, {
      secret: options?.secret,
    });

    return { sub: payload.sub, jti: payload.jti };
  }
}
