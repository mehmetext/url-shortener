import { Module } from '@nestjs/common';
import { IpLocationModule } from 'src/shared/modules/ip-location/infra/ip-location.module';
import { CacheCount } from 'src/shared/services/cache-count.service';
import { CreateClickUseCase } from '../application/use-cases/create-click.use-case';
import { GetClickCountUseCase } from '../application/use-cases/get-click-count.use-case';
import { ClickRepository } from '../domain/repositories/click.repository';
import { PrismaClickRepository } from './db/prisma-click.repository';

@Module({
  controllers: [],
  imports: [IpLocationModule],
  providers: [
    {
      provide: ClickRepository,
      useClass: PrismaClickRepository,
    },
    CacheCount,
    CreateClickUseCase,
    GetClickCountUseCase,
  ],
  exports: [CreateClickUseCase, GetClickCountUseCase],
})
export class ClickModule {}
