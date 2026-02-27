import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { TokenGeneratorRepository } from '../../domain/repositories/token-generator.repository';
import { LoginResult } from '../dtos/login.result';

export class LoginUseCase {
  constructor(
    @Inject(TokenGeneratorRepository)
    private readonly tokenGenerator: TokenGeneratorRepository,
    private readonly configService: ConfigService,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(user: User): Promise<LoginResult> {
    const jti = crypto.randomUUID();
    const payload = { sub: user.id, jti };

    const isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development';

    const accessTokenExpiresIn = isDevelopment ? '15d' : '15m';
    const accessTokenExpiresInSeconds = isDevelopment
      ? 15 * 24 * 60 * 60
      : 15 * 60;

    const accessToken = await this.tokenGenerator.generateToken(payload, {
      expiresIn: accessTokenExpiresIn,
      secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    });
    const refreshToken = await this.tokenGenerator.generateToken(payload, {
      expiresIn: '7d',
      secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
    });

    await this.refreshTokenRepository.save(
      user.id,
      jti,
      refreshToken,
      7 * 24 * 60 * 60,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresInSeconds,
      user: {
        id: user.id,
        email: user.email.value,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    };
  }
}
