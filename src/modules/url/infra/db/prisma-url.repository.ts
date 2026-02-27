import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { Url } from '../../domain/entities/url.entity';
import { UrlNotFoundError } from '../../domain/errors';
import { UrlRepository } from '../../domain/repositories/url.repository';
import { UrlPrismaMapper } from './url-prisma.mapper';

@Injectable()
export class PrismaUrlRepository implements UrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(url: Url): Promise<Url> {
    const result = await this.prisma.url.create({
      data: UrlPrismaMapper.toCreatePersistence(url),
    });

    return UrlPrismaMapper.toDomain(result);
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    const result = await this.prisma.url.findUnique({
      where: { shortCode, deletedAt: null },
    });

    if (!result) {
      return null;
    }

    return UrlPrismaMapper.toDomain(result);
  }

  async findById(id: string): Promise<Url | null> {
    const result = await this.prisma.url.findUnique({
      where: { id, deletedAt: null },
    });

    if (!result) {
      return null;
    }

    return UrlPrismaMapper.toDomain(result);
  }

  async findAll(): Promise<Url[]> {
    const result = await this.prisma.url.findMany({
      where: { deletedAt: null },
    });

    return result.map((result) => UrlPrismaMapper.toDomain(result));
  }

  async findAllByUserId(userId: string): Promise<Url[]> {
    const result = await this.prisma.url.findMany({
      where: { userId, deletedAt: null },
    });

    return result.map((result) => UrlPrismaMapper.toDomain(result));
  }
  async update(url: Url): Promise<Url> {
    const result = await this.prisma.url.update({
      where: { id: url.id, deletedAt: null },
      data: UrlPrismaMapper.toUpdatePersistence(url),
    });

    if (!result) {
      throw new UrlNotFoundError();
    }

    return UrlPrismaMapper.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
