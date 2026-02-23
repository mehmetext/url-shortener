import { InvalidEmailError } from '../errors';

export class EmailVO {
  constructor(public readonly value: string) {
    if (!value.includes('@')) {
      throw new InvalidEmailError();
    }
  }
}
