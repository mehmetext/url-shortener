import { ShortCodeVO } from '../value-objects/short-code.vo';
import { UrlVO } from '../value-objects/url.vo';

export class Url {
  constructor(
    public readonly id: string | undefined,
    public readonly originalUrl: UrlVO,
    public readonly shortCode: ShortCodeVO,
    public readonly expiresAt: Date | undefined,
    public readonly userId: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
  ) {}
}
