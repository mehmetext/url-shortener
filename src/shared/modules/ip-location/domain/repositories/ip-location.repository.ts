import { IpLocation } from '../entities/ip-location.entity';

export abstract class IpLocationRepository {
  abstract findByIpAddress(ipAddress: string): Promise<IpLocation | null>;
}
