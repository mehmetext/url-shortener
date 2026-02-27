import { Click } from '../entities/click.entity';

export abstract class ClickRepository {
  abstract create(click: Click): Promise<Click>;
  abstract findById(id: string): Promise<Click | null>;
  abstract findAll(): Promise<Click[]>;
  abstract findAllByUrlId(urlId: string): Promise<Click[]>;
  abstract update(click: Click): Promise<Click>;
  abstract delete(id: string): Promise<void>;
  abstract getCountByUrlId(urlId: string): Promise<number>;
}
