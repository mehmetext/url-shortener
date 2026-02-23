import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EmailVO } from 'src/modules/user/domain/value-objects/email.vo';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user.response';
import { ValidateUserUseCase } from '../../application/use-cases/validate-user.use-case';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ValidateUserUseCase)
    private readonly validateUserUseCase: ValidateUserUseCase,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserResponseDto> {
    const emailVO = new EmailVO(email);

    const user = await this.validateUserUseCase.execute(emailVO, password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id!,
      email: user.email.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
