import { UrlVO } from '../../domain/value-objects/url.vo';

export class ShortenUrlCommand {
  originalUrl: UrlVO;
  expiresAt?: Date;
}
