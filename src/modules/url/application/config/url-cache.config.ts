export const URL_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const URL_CACHE_NOT_FOUND_TTL_MS = 1000 * 60 * 5;

export const URL_CACHE_KEY = (shortCode: string) => `url:${shortCode}`;
