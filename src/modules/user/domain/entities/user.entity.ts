import { Url } from 'src/modules/url/domain/entities/Url.entity';
import { EmailVO } from '../value-objects/email.vo';

export class User {
  constructor(
    public readonly id: string | undefined,
    public readonly email: EmailVO,
    public readonly password: string,
    public readonly urls: Url[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
  ) {}
}
