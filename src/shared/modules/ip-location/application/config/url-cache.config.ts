export const IP_LOCATION_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const IP_LOCATION_CACHE_NOT_FOUND_TTL_MS = 1000 * 60 * 5;

export const IP_LOCATION_CACHE_KEY = (ipAddress: string) =>
  `ip-location:${ipAddress}`;
