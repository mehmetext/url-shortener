import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import {
  IpLocation,
  IpLocationPrimitives,
} from '../../domain/entities/ip-location.entity';
import { IpLocationRepository } from '../../domain/repositories/ip-location.repository';
import {
  IP_LOCATION_CACHE_KEY,
  IP_LOCATION_CACHE_NOT_FOUND_TTL_MS,
  IP_LOCATION_CACHE_TTL_MS,
} from '../config/url-cache.config';

@Injectable()
export class FindByIpAddressUseCase {
  constructor(
    @Inject(IpLocationRepository)
    private readonly ipLocationRepository: IpLocationRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(ipAddress: string): Promise<IpLocation | null> {
    const cached = await this.cacheManager.get<
      IpLocationPrimitives | { notFound: true }
    >(IP_LOCATION_CACHE_KEY(ipAddress));

    if (cached) {
      if ('notFound' in cached) {
        return null;
      }

      return IpLocation.fromPrimitives(cached);
    }

    const ipLocation =
      await this.ipLocationRepository.findByIpAddress(ipAddress);

    if (!ipLocation) {
      await this.cacheManager.set(
        IP_LOCATION_CACHE_KEY(ipAddress),
        { notFound: true },
        IP_LOCATION_CACHE_NOT_FOUND_TTL_MS,
      );
      return null;
    }

    await this.cacheManager.set(
      IP_LOCATION_CACHE_KEY(ipAddress),
      ipLocation.toPrimitives(),
      IP_LOCATION_CACHE_TTL_MS,
    );

    return ipLocation;
  }
}
