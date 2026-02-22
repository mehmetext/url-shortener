import { Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/application/dtos/CreateUser.dto';
import { IUserRepository } from 'src/modules/user/domain/repositories/IUserRepository';
import { LoginResponseDto } from '../dtos/Login.response';
import { LoginUseCase } from './Login.use-case';

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
