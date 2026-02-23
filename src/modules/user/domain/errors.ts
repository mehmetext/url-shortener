import { StatusCode } from 'src/shared/constants/http-response-codes';
import { DomainError } from 'src/shared/errors/domain.error';

export class UserAlreadyExistsError extends DomainError {
  constructor(message = 'User already exists') {
    super(message, StatusCode.CONFLICT);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(message = 'User not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class UserInvalidCredentialsError extends DomainError {
  constructor(message = 'Invalid credentials') {
    super(message, StatusCode.UNAUTHORIZED);
  }
}

export class InvalidEmailError extends DomainError {
  constructor(message = 'Invalid email') {
    super(message, StatusCode.BAD_REQUEST);
  }
}
