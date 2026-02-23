import { Url } from '../entities/url.entity';

export abstract class IUrlRepository {
  abstract create(url: Url): Promise<Url>;
  abstract findByShortCode(shortCode: string): Promise<Url | null>;
  abstract findById(id: string): Promise<Url | null>;
  abstract findAll(): Promise<Url[]>;
  abstract update(url: Url): Promise<Url | null>;
  abstract delete(id: string): Promise<void>;
}
