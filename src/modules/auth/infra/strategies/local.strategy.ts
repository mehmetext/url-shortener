import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { UserInvalidCredentialsError } from 'src/modules/user/domain/errors';
import { EmailVO } from 'src/modules/user/domain/value-objects/email.vo';
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

  async validate(email: string, password: string): Promise<User> {
    const emailVO = new EmailVO(email);

    const user = await this.validateUserUseCase.execute(emailVO, password);

    if (!user) {
      throw new UserInvalidCredentialsError();
    }

    return user;
  }
}
