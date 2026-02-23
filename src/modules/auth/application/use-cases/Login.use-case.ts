import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { TokenGeneratorRepository } from '../../domain/repositories/token-generator.repository';
import { LoginResponseDto } from '../dtos/login.response';

export class LoginUseCase {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(TokenGeneratorRepository)
    private readonly tokenGenerator: TokenGeneratorRepository,
    private readonly configService: ConfigService,
    @Inject(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(user: User): Promise<LoginResponseDto> {
    const jti = crypto.randomUUID();
    const payload = { sub: user.id, jti };

    const accessToken = await this.tokenGenerator.generateToken(payload, {
      expiresIn: '15m',
      secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    });
    const refreshToken = await this.tokenGenerator.generateToken(payload, {
      expiresIn: '7d',
      secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
    });

    await this.refreshTokenRepository.save(
      user.id!,
      jti,
      refreshToken,
      7 * 24 * 60 * 60,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      user,
    };
  }
}
