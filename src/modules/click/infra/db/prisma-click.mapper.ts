import { Prisma, Click as PrismaClick } from 'src/generated/prisma/client';
import { Click } from '../../domain/entities/click.entity';

export class PrismaClickMapper {
  static toDomain(click: PrismaClick): Click {
    return new Click(
      click.id,
      click.urlId,
      click.ipAddress ?? undefined,
      click.country ?? undefined,
      click.userAgent ?? undefined,
      click.createdAt,
      click.updatedAt,
      click.deletedAt ?? undefined,
    );
  }

  static toCreatePersistence(click: Click): Prisma.ClickUncheckedCreateInput {
    return {
      urlId: click.urlId,
      ipAddress: click.ipAddress,
      country: click.country,
      userAgent: click.userAgent,
    };
  }

  static toUpdatePersistence(click: Click): Prisma.ClickUncheckedUpdateInput {
    return {
      urlId: click.urlId,
      ipAddress: click.ipAddress,
      country: click.country,
      userAgent: click.userAgent,
    };
  }
}
