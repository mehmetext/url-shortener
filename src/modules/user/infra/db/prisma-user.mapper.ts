import { User as PrismaUser } from 'src/generated/prisma/client';
import { User } from '../../domain/entities/user.entity';
import { EmailVO } from '../../domain/value-objects/email.vo';

export class PrismaUserMapper {
  static toDomain(user: PrismaUser): User {
    return new User(
      user.id,
      new EmailVO(user.email),
      user.password,
      user.createdAt,
      user.updatedAt,
      user.deletedAt ?? undefined,
    );
  }
}
