import { StatusCode } from 'src/shared/constants/http-response-codes';
import { DomainError } from 'src/shared/errors/domain.error';

export class InvalidTokenError extends DomainError {
  constructor(message = 'Invalid token') {
    super(message, StatusCode.UNAUTHORIZED);
  }
}
