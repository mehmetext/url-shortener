interface IpApiBaseResponse {
  status: 'success' | 'fail';
  query: string;
  message?: string;
}

export interface IpApiSuccessResponse extends IpApiBaseResponse {
  status: 'success';
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

export interface IpApiFailResponse extends IpApiBaseResponse {
  status: 'fail';
}

export type IpApiResponse = IpApiSuccessResponse | IpApiFailResponse;
