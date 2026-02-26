import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IpLocation } from '../../domain/entities/ip-location.entity';
import { IpLocationRepository } from '../../domain/repositories/ip-location.repository';
import { IpApiResponse } from './types/ip-api.response';

@Injectable()
export class IpApiIpLocationRepository implements IpLocationRepository {
  constructor(private readonly httpService: HttpService) {}

  async findByIpAddress(ipAddress: string): Promise<IpLocation | null> {
    const response$ = this.httpService.get<IpApiResponse>(
      `http://ip-api.com/json/${ipAddress}`,
    );

    const response = await firstValueFrom(response$);

    return new IpLocation(response.data.countryCode);
  }
}
