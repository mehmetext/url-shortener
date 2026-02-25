import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CreateClickCommand } from '../../application/dtos/create-click.command';
import { Click } from '../../domain/entities/click.entity';
import { ClickNotFoundError } from '../../domain/errors';
import { ClickRepository } from '../../domain/repositories/click.repository';

@Injectable()
export class PrismaClickRepository implements ClickRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(command: CreateClickCommand): Promise<Click> {
    const result = await this.prisma.click.create({
      data: {
        urlId: command.urlId,
        ipAddress: command.ipAddress,
        country: command.country,
        userAgent: command.userAgent,
      },
    });

    return new Click(
      result.id,
      result.urlId,
      result.ipAddress ?? undefined,
      result.country ?? undefined,
      result.userAgent ?? undefined,
      result.createdAt,
      result.updatedAt,
      result.deletedAt ?? undefined,
    );
  }

  async findById(id: string): Promise<Click | null> {
    const result = await this.prisma.click.findUnique({
      where: { id, deletedAt: null },
    });

    if (!result) {
      return null;
    }

    return new Click(
      result.id,
      result.urlId,
      result.ipAddress ?? undefined,
      result.country ?? undefined,
      result.userAgent ?? undefined,
      result.createdAt,
      result.updatedAt,
      result.deletedAt ?? undefined,
    );
  }

  async findAll(): Promise<Click[]> {
    const result = await this.prisma.click.findMany({
      where: { deletedAt: null },
    });

    return result.map(
      (row) =>
        new Click(
          row.id,
          row.urlId,
          row.ipAddress ?? undefined,
          row.country ?? undefined,
          row.userAgent ?? undefined,
          row.createdAt,
          row.updatedAt,
          row.deletedAt ?? undefined,
        ),
    );
  }

  async findAllByUrlId(urlId: string): Promise<Click[]> {
    const result = await this.prisma.click.findMany({
      where: { urlId, deletedAt: null },
    });

    return result.map(
      (row) =>
        new Click(
          row.id,
          row.urlId,
          row.ipAddress ?? undefined,
          row.country ?? undefined,
          row.userAgent ?? undefined,
          row.createdAt,
          row.updatedAt,
          row.deletedAt ?? undefined,
        ),
    );
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
      data: {
        urlId: click.urlId,
        ipAddress: click.ipAddress,
        country: click.country,
        userAgent: click.userAgent,
      },
    });

    return new Click(
      result.id,
      result.urlId,
      result.ipAddress ?? undefined,
      result.country ?? undefined,
      result.userAgent ?? undefined,
      result.createdAt,
      result.updatedAt,
      result.deletedAt ?? undefined,
    );
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
