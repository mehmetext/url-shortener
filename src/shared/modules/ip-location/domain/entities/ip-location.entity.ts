export class IpLocation {
  constructor(
    public readonly ipAddress: string | null,
    public readonly country: string | null,
  ) {}
}
