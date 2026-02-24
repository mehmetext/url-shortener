import { StatusCode } from 'src/shared/constants/http-response-codes';
import { DomainError } from 'src/shared/errors/domain.error';

export class UrlNotFoundError extends DomainError {
  constructor(message = 'URL not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class UrlExpiredError extends DomainError {
  constructor(message = 'URL expired') {
    super(message, StatusCode.GONE);
  }
}

export class InvalidUrlError extends DomainError {
  constructor(message = 'Invalid URL') {
    super(message, StatusCode.BAD_REQUEST);
  }
}
