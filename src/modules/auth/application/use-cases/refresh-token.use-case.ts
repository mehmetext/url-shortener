import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from 'src/modules/user/domain/repositories/IUserRepository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { TokenGeneratorRepository } from '../../domain/repositories/token-generator.repository';
import { LoginResponseDto } from '../dtos/login.response';
import { LoginUseCase } from './login.use-case';

export class RefreshTokenUseCase {
  constructor(
    @Inject(TokenGeneratorRepository)
    private readonly tokenGenerator: TokenGeneratorRepository,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
  ) {}

  async execute(oldRefreshToken: string): Promise<LoginResponseDto> {
    let payload: { sub: string; jti: string };

    try {
      payload = await this.tokenGenerator.verifyToken(oldRefreshToken, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new Error('Invalid token');
    }

    const savedToken = await this.refreshTokenRepository.findByUserIdAndJti(
      payload.sub,
      payload.jti,
    );

    if (!savedToken) {
      throw new Error('Invalid token');
    }

    if (savedToken !== oldRefreshToken) {
      await this.refreshTokenRepository.delete(payload.sub, payload.jti);
      throw new Error('Invalid token');
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new Error('User not found');
    }

    await this.refreshTokenRepository.delete(payload.sub, payload.jti);

    return this.loginUseCase.execute(user);
  }
}
