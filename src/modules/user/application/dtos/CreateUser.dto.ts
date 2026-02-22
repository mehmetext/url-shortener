import { EmailVO } from '../../domain/value-objects/email.vo';

export class CreateUserDto {
  constructor(
    public readonly email: EmailVO,
    public readonly password: string,
  ) {}
}
