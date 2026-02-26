export const CLICK_COUNT_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export const CLICK_COUNT_CACHE_KEY = (urlId: string) => `click-count:${urlId}`;
