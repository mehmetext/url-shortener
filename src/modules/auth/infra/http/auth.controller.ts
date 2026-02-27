import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateUserCommand } from 'src/modules/user/application/dtos/create-user.command';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { EmailVO } from 'src/modules/user/domain/value-objects/email.vo';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiCreatedResponseGeneric } from 'src/shared/decorators/api-created-response-generic.decorator';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RegisterDto } from '../dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
    @Inject(RegisterUseCase) private readonly registerUseCase: RegisterUseCase,
    @Inject(RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponseGeneric(LoginResponseDto)
  async login(@Req() req: Request & { user: User }): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(req.user);
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponseGeneric(LoginResponseDto)
  async register(@Body() body: RegisterDto): Promise<LoginResponseDto> {
    const createUserCommand = new CreateUserCommand(
      new EmailVO(body.email),
      body.password,
    );

    return this.registerUseCase.execute(createUserCommand);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponseGeneric(UserResponseDto)
  @UseGuards(AuthGuard('jwt'))
  me(
    @Req() req: Request & { user: UserResponseDto & { jti: string } },
  ): UserResponseDto {
    return {
      id: req.user.id,
      email: req.user.email,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };
  }

  @Post('refresh-token')
  @ApiBearerAuth()
  @ApiOkResponseGeneric(LoginResponseDto)
  @UseGuards(AuthGuard('jwt'))
  async refreshToken(@Body() body: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.refreshTokenUseCase.execute(body.refreshToken);
  }
}
