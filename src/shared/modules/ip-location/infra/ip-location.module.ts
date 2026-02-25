import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FindByIpAddressUseCase } from '../application/use-cases/find-by-ip-address.use-case';
import { IpLocationRepository } from '../domain/repositories/ip-location.repository';
import { IpApiIpLocationRepository } from './http/ip-api-ip-location.repository';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: IpLocationRepository,
      useClass: IpApiIpLocationRepository,
    },
    FindByIpAddressUseCase,
  ],
  exports: [FindByIpAddressUseCase],
})
export class IpLocationModule {}
