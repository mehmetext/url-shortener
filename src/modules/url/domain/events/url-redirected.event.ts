export class UrlRedirectedEvent {
  constructor(
    public readonly urlId: string,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
  ) {}
}
