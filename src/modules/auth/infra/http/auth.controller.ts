import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { EmailVO } from 'src/modules/user/domain/value-objects/email.vo';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user.response';
import { LoginUseCase } from '../../application/use-cases/Login.use-case';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseDto } from '../dtos/Login.response';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(
    @Req() req: Request & { user: UserResponseDto },
  ): Promise<LoginResponseDto> {
    const user = new User(
      req.user.id,
      new EmailVO(req.user.email),
      'password',
      req.user.createdAt,
      req.user.updatedAt,
      req.user.deletedAt ?? undefined,
    );

    const response = await this.loginUseCase.execute(user);

    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresIn: response.expiresIn,
      user: {
        id: response.user.id!,
        email: response.user.email.value,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
        deletedAt: response.user.deletedAt,
      },
    };
  }
}
