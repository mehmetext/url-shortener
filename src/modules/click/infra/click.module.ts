import { Module } from '@nestjs/common';
import { CreateClickUseCase } from '../application/use-cases/create-click.use-case';
import { GetClickCountUseCase } from '../application/use-cases/get-click-count.use-case';
import { ClickRepository } from '../domain/repositories/click.repository';
import { PrismaClickRepository } from './db/prisma-click.repository';

@Module({
  controllers: [],
  imports: [],
  providers: [
    {
      provide: ClickRepository,
      useClass: PrismaClickRepository,
    },
    CreateClickUseCase,
    GetClickCountUseCase,
  ],
  exports: [CreateClickUseCase, GetClickCountUseCase],
})
export class ClickModule {}
