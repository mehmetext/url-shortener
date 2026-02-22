import { UrlVO } from '../../domain/value-objects/Url.vo';

export class ShortenUrlDto {
  originalUrl: UrlVO;
  expiresAt?: Date;
}
