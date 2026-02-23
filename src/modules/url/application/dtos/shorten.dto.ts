import { UrlVO } from '../../domain/value-objects/url.vo';

export class ShortenUrlDto {
  originalUrl: UrlVO;
  expiresAt?: Date;
}
