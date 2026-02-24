import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { Url } from '../../domain/entities/url.entity';
import { UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { ShortCodeVO } from '../../domain/value-objects/short-code.vo';
import { UrlVO } from '../../domain/value-objects/url.vo';

@Injectable()
export class PrismaUrlRepository implements UrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(url: Url): Promise<Url> {
    const result = await this.prisma.url.create({
      data: {
        originalUrl: url.originalUrl.value,
        shortCode: url.shortCode.value,
        userId: url.userId,
        expiresAt: url.expiresAt,
      },
    });

    return new Url(
      result.id,
      new UrlVO(result.originalUrl),
      new ShortCodeVO(result.shortCode),
      result.expiresAt ?? undefined,
      result.userId ?? undefined,
      result.createdAt,
      result.updatedAt,
      result.deletedAt ?? undefined,
    );
  }

  async findByShortCode(shortCode: string): Promise<Url> {
    const result = await this.prisma.url.findUnique({
      where: { shortCode, deletedAt: null },
    });

    if (!result) {
      throw new UrlNotFoundError();
    }

    return new Url(
      result.id,
      new UrlVO(result.originalUrl),
      new ShortCodeVO(result.shortCode),
      result.expiresAt ?? undefined,
      result.userId ?? undefined,
      result.createdAt,
      result.updatedAt,
      result.deletedAt ?? undefined,
    );
  }

  async findById(id: string): Promise<Url> {
    const result = await this.prisma.url.findUnique({
      where: { id, deletedAt: null },
    });

    if (!result) {
      throw new UrlNotFoundError();
    }

    return new Url(
      result.id,
      new UrlVO(result.originalUrl),
      new ShortCodeVO(result.shortCode),
      result.expiresAt ?? undefined,
      result.userId ?? undefined,
      result.createdAt,
      result.updatedAt,
      result.deletedAt ?? undefined,
    );
  }

  async findAll(): Promise<Url[]> {
    const result = await this.prisma.url.findMany({
      where: { deletedAt: null },
    });

    return result.map(
      (result) =>
        new Url(
          result.id,
          new UrlVO(result.originalUrl),
          new ShortCodeVO(result.shortCode),
          result.expiresAt ?? undefined,
          result.userId ?? undefined,
          result.createdAt,
          result.updatedAt,
          result.deletedAt ?? undefined,
        ),
    );
  }

  async update(url: Url): Promise<Url> {
    const result = await this.prisma.url.update({
      where: { id: url.id, deletedAt: null },
      data: {
        originalUrl: url.originalUrl.value,
        shortCode: url.shortCode.value,
        expiresAt: url.expiresAt,
        userId: url.userId,
      },
    });

    if (!result) {
      throw new UrlNotFoundError();
    }

    return new Url(
      result.id,
      new UrlVO(result.originalUrl),
      new ShortCodeVO(result.shortCode),
      result.expiresAt ?? undefined,
      result.userId ?? undefined,
      result.createdAt,
      result.updatedAt,
      result.deletedAt ?? undefined,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
