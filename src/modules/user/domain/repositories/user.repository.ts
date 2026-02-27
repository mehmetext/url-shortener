import { CreateUserCommand } from '../../application/dtos/create-user.command';
import { User } from '../entities/user.entity';
import { EmailVO } from '../value-objects/email.vo';

export abstract class UserRepository {
  abstract create(command: CreateUserCommand): Promise<User>;
  abstract findByEmail(email: EmailVO): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
}
