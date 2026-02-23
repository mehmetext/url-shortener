import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateUserCommand } from 'src/modules/user/application/dtos/create-user.command';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { EmailVO } from 'src/modules/user/domain/value-objects/email.vo';
import { ApiCreatedResponseGeneric } from 'src/shared/decorators/api-created-response-generic.decorator';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
    @Inject(RegisterUseCase) private readonly registerUseCase: RegisterUseCase,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponseGeneric(LoginResponseDto)
  async login(@Req() req: Request & { user: User }): Promise<LoginResponseDto> {
    const response = await this.loginUseCase.execute(req.user);

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

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponseGeneric(LoginResponseDto)
  async register(@Body() body: RegisterDto): Promise<LoginResponseDto> {
    const createUserCommand = new CreateUserCommand(
      new EmailVO(body.email),
      body.password,
    );

    const user = await this.registerUseCase.execute(createUserCommand);

    return {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      expiresIn: user.expiresIn,
      user: {
        id: user.user.id!,
        email: user.user.email.value,
        createdAt: user.user.createdAt,
        updatedAt: user.user.updatedAt,
        deletedAt: user.user.deletedAt,
      },
    };
  }
}
