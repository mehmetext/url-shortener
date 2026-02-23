import { Inject } from '@nestjs/common';
import { CreateUserCommand } from 'src/modules/user/application/dtos/create-user.command';
import { UserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { LoginResult } from '../dtos/login.result';
import { LoginUseCase } from './login.use-case';

export class RegisterUseCase {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
  ) {}

  async execute(command: CreateUserCommand): Promise<LoginResult> {
    const user = await this.userRepository.create(command);

    return this.loginUseCase.execute(user);
  }
}
