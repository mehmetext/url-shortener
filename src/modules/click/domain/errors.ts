import { StatusCode } from 'src/shared/constants/http-response-codes';
import { DomainError } from 'src/shared/errors/domain.error';

export class ClickNotFoundError extends DomainError {
  constructor(message = 'Click not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}
