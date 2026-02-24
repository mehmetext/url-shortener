import { InvalidUrlError } from '../errors';

export class UrlVO {
  constructor(public readonly value: string) {
    if (!value.startsWith('http')) {
      throw new InvalidUrlError();
    }
  }
}
