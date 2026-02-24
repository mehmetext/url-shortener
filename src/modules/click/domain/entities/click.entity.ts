export class Click {
  constructor(
    public readonly id: string | undefined,
    public readonly urlId: string,
    public readonly ipAddress: string | undefined,
    public readonly country: string | undefined,
    public readonly userAgent: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
  ) {}
}
