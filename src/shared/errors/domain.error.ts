import { StatusCode } from '../constants/http-response-codes';

export class DomainError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = StatusCode.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
