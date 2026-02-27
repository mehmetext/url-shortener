import { Prisma, Url as PrismaUrl } from 'src/generated/prisma/client';
import { Url } from '../../domain/entities/url.entity';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { UrlVO } from '../../domain/value-objects/url.vo';

export class PrismaUrlMapper {
  static toDomain(entity: PrismaUrl): Url {
    return new Url(
      entity.id,
      new UrlVO(entity.originalUrl),
      new ShortCodeVO(entity.shortCode),
      entity.expiresAt ?? undefined,
      entity.userId ?? undefined,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt ?? undefined,
    );
  }

  static toCreatePersistence(entity: Url): Prisma.UrlUncheckedCreateInput {
    return {
      originalUrl: entity.originalUrl.value,
      shortCode: entity.shortCode.value,
      expiresAt: entity.expiresAt,
      userId: entity.userId,
    };
  }

  static toUpdatePersistence(entity: Url): Prisma.UrlUncheckedUpdateInput {
    return {
      originalUrl: entity.originalUrl.value,
      shortCode: entity.shortCode.value,
      expiresAt: entity.expiresAt,
      userId: entity.userId,
      deletedAt: entity.deletedAt,
    };
  }
}
