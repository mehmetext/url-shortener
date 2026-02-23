import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserNotFoundError } from 'src/modules/user/domain/errors';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { InvalidTokenError } from '../../domain/errors';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { TokenGeneratorRepository } from '../../domain/repositories/token-generator.repository';
import { LoginResult } from '../dtos/login.result';
import { LoginUseCase } from './login.use-case';

export class RefreshTokenUseCase {
  constructor(
    @Inject(TokenGeneratorRepository)
    private readonly tokenGenerator: TokenGeneratorRepository,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
  ) {}

  async execute(oldRefreshToken: string): Promise<LoginResult> {
    let payload: { sub: string; jti: string };

    try {
      payload = await this.tokenGenerator.verifyToken(oldRefreshToken, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new InvalidTokenError();
    }

    const savedToken = await this.refreshTokenRepository.findByUserIdAndJti(
      payload.sub,
      payload.jti,
    );

    if (!savedToken) {
      throw new InvalidTokenError();
    }

    if (savedToken !== oldRefreshToken) {
      await this.refreshTokenRepository.delete(payload.sub, payload.jti);
      throw new InvalidTokenError();
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UserNotFoundError();
    }

    await this.refreshTokenRepository.delete(payload.sub, payload.jti);

    return this.loginUseCase.execute(user);
  }
}
