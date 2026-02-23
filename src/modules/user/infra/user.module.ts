import { Module } from '@nestjs/common';
import { IUserRepository } from '../domain/repositories/user.repository';
import { PrismaUserRepository } from './db/prisma-user.repository';

@Module({
  controllers: [],
  imports: [],
  providers: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [IUserRepository],
})
export class UserModule {}
