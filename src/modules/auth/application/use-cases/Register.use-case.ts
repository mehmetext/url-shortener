import { Inject } from '@nestjs/common';
import { CreateUserCommand } from 'src/modules/user/application/dtos/create-user.command';
import { CreateUserUseCase } from 'src/modules/user/application/use-cases/create-user.use-case';
import { LoginResult } from '../dtos/login.result';
import { LoginUseCase } from './login.use-case';

export class RegisterUseCase {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
  ) {}

  async execute(command: CreateUserCommand): Promise<LoginResult> {
    const user = await this.createUserUseCase.execute(command);
    return this.loginUseCase.execute(user);
  }
}
