import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { EmailVO } from '../../domain/value-objects/email.vo';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const data = {
      id: user.id,
      email: user.email.value,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const created = await this.prisma.user.create({ data });

    return new User(
      created.id,
      new EmailVO(created.email),
      created.password,
      created.createdAt,
      created.updatedAt,
      created.deletedAt ?? undefined,
    );
  }

  async findByEmail(email: EmailVO): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value },
    });
    if (!user) return null;
    return new User(
      user.id,
      new EmailVO(user.email),
      user.password,
      user.createdAt,
      user.updatedAt,
      user.deletedAt ?? undefined,
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return new User(
      user.id,
      new EmailVO(user.email),
      user.password,
      user.createdAt,
      user.updatedAt,
      user.deletedAt ?? undefined,
    );
  }

  async update(user: User): Promise<User | null> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email.value,
        password: user.password,
      },
    });

    return new User(
      updated.id,
      new EmailVO(updated.email),
      updated.password,
      updated.createdAt,
      updated.updatedAt,
      updated.deletedAt ?? undefined,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
