import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user/infra/user.module';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { LogoutUseCase } from '../application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { ValidateUserUseCase } from '../application/use-cases/validate-user.use-case';
import { RefreshTokenRepository } from '../domain/repositories/refresh-token.repository';
import { TokenGeneratorRepository } from '../domain/repositories/token-generator.repository';
import { AuthController } from './http/auth.controller';
import { JwtTokenGeneratorRepository } from './jwt/jwt-token-generator.repository';
import { RedisRefreshTokenRepository } from './refresh-token/redis-refresh-token.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  controllers: [AuthController],
  imports: [UserModule, PassportModule, JwtModule],
  providers: [
    LogoutUseCase,
    RefreshTokenUseCase,
    ValidateUserUseCase,
    LoginUseCase,
    RegisterUseCase,
    {
      provide: TokenGeneratorRepository,
      useClass: JwtTokenGeneratorRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: RedisRefreshTokenRepository,
    },
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}
