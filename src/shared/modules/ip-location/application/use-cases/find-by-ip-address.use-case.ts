import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import {
  IpLocation,
  IpLocationPrimitives,
} from '../../domain/entities/ip-location.entity';
import { IpLocationRepository } from '../../domain/repositories/ip-location.repository';

@Injectable()
export class FindByIpAddressUseCase {
  constructor(
    @Inject(IpLocationRepository)
    private readonly ipLocationRepository: IpLocationRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(ipAddress: string): Promise<IpLocation | null> {
    const cacheKey = `ip-location:${ipAddress}`;
    const cached = await this.cacheManager.get<IpLocationPrimitives>(cacheKey);

    let ipLocation: IpLocation | null = null;

    if (cached) {
      ipLocation = IpLocation.fromPrimitives(cached);
    } else {
      ipLocation = await this.ipLocationRepository.findByIpAddress(ipAddress);

      if (ipLocation) {
        await this.cacheManager.set(
          cacheKey,
          ipLocation.toPrimitives(),
          60 * 60 * 24 * 30,
        );
      } else {
        await this.cacheManager.set(cacheKey, null, 60 * 60 * 24 * 30);
      }
    }

    return ipLocation;
  }
}
