import { Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/application/dtos/create-user.dto';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository';
import { LoginResponseDto } from '../dtos/login.response';
import { LoginUseCase } from './login.use-case';

export class RegisterUseCase {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
  ) {}

  async execute(dto: CreateUserDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.create(dto);

    return this.loginUseCase.execute(user);
  }
}
