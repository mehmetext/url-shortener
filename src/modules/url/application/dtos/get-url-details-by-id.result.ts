export class GetUrlDetailsByIdResult {
  id: string;
  originalUrl: string;
  shortCode: string;
  expiresAt: Date | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  clicks: number;
}
