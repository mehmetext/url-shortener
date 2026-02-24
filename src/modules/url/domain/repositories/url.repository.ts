import { Url } from '../entities/url.entity';

export abstract class UrlRepository {
  abstract create(url: Url): Promise<Url>;
  abstract findByShortCode(shortCode: string): Promise<Url>;
  abstract findById(id: string): Promise<Url | null>;
  abstract findAll(): Promise<Url[]>;
  abstract findAllByUserId(userId: string): Promise<Url[]>;
  abstract update(url: Url): Promise<Url>;
  abstract delete(id: string): Promise<void>;
}
