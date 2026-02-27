import { ShortCodeVO } from '../value-objects/short-code.vo';
import { UrlVO } from '../value-objects/url.vo';

export interface UrlPrimitives {
  id?: string;
  originalUrl: string;
  shortCode: string;
  expiresAt?: string | null;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

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

  isExpired(now: Date = new Date()): boolean {
    return !!this.expiresAt && this.expiresAt < now;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  static create(params: {
    originalUrl: UrlVO;
    shortCode: ShortCodeVO;
    expiresAt: Date | undefined;
    userId: string | undefined;
  }): Url {
    return new Url(
      undefined,
      params.originalUrl,
      params.shortCode,
      params.expiresAt,
      params.userId,
      new Date(),
      new Date(),
      undefined,
    );
  }

  toPrimitives(): UrlPrimitives {
    return {
      id: this.id,
      originalUrl: this.originalUrl.value,
      shortCode: this.shortCode.value,
      expiresAt: this.expiresAt?.toISOString(),
      userId: this.userId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      deletedAt: this.deletedAt?.toISOString(),
    };
  }

  static fromPrimitives(primitives: UrlPrimitives): Url {
    return new Url(
      primitives.id,
      new UrlVO(primitives.originalUrl),
      new ShortCodeVO(primitives.shortCode),
      primitives.expiresAt ? new Date(primitives.expiresAt) : undefined,
      primitives.userId,
      new Date(primitives.createdAt),
      new Date(primitives.updatedAt),
      primitives.deletedAt ? new Date(primitives.deletedAt) : undefined,
    );
  }
}
