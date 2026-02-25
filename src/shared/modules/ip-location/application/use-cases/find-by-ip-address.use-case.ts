import { Inject, Injectable } from '@nestjs/common';
import { IpLocation } from '../../domain/entities/ip-location.entity';
import { IpLocationRepository } from '../../domain/repositories/ip-location.repository';

@Injectable()
export class FindByIpAddressUseCase {
  constructor(
    @Inject(IpLocationRepository)
    private readonly ipLocationRepository: IpLocationRepository,
  ) {}

  async execute(ipAddress: string): Promise<IpLocation | null> {
    const ipLocation =
      await this.ipLocationRepository.findByIpAddress(ipAddress);

    return ipLocation;
  }
}
