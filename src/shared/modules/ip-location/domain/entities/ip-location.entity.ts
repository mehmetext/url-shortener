export interface IpLocationPrimitives {
  country: string | null;
}

export class IpLocation {
  constructor(public readonly country: string | null) {}

  toPrimitives(): IpLocationPrimitives {
    return {
      country: this.country,
    };
  }

  static fromPrimitives(primitives: IpLocationPrimitives): IpLocation {
    return new IpLocation(primitives.country);
  }
}
