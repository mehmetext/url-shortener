export class ShortenUrlResult {
  id: string;
  originalUrl: string;
  shortCode: string;
  expiresAt?: Date;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}
