import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { Click } from '../../domain/entities/click.entity';
import { ClickNotFoundError } from '../../domain/errors';
import { ClickRepository } from '../../domain/repositories/click.repository';
import { PrismaClickMapper } from './prisma-click.mapper';

@Injectable()
export class PrismaClickRepository implements ClickRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(click: Click): Promise<Click> {
    const result = await this.prisma.click.create({
      data: PrismaClickMapper.toCreatePersistence(click),
    });

    return PrismaClickMapper.toDomain(result);
  }

  async findById(id: string): Promise<Click | null> {
    const result = await this.prisma.click.findUnique({
      where: { id, deletedAt: null },
    });

    if (!result) {
      return null;
    }

    return PrismaClickMapper.toDomain(result);
  }

  async findAll(): Promise<Click[]> {
    const result = await this.prisma.click.findMany({
      where: { deletedAt: null },
    });

    return result.map((row) => PrismaClickMapper.toDomain(row));
  }

  async findAllByUrlId(urlId: string): Promise<Click[]> {
    const result = await this.prisma.click.findMany({
      where: { urlId, deletedAt: null },
    });

    return result.map((row) => PrismaClickMapper.toDomain(row));
  }

  async update(click: Click): Promise<Click> {
    if (!click.id) {
      throw new ClickNotFoundError();
    }

    const existing = await this.prisma.click.findUnique({
      where: { id: click.id },
    });

    if (!existing || existing.deletedAt) {
      throw new ClickNotFoundError();
    }

    const result = await this.prisma.click.update({
      where: { id: click.id },
      data: PrismaClickMapper.toUpdatePersistence(click),
    });

    return PrismaClickMapper.toDomain(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.click.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getCountByUrlId(urlId: string): Promise<number> {
    const result = await this.prisma.click.count({
      where: { urlId, deletedAt: null },
    });

    return result;
  }
}
