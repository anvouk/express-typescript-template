import { Request } from 'express';
import { validationResult, ValidationError, Result } from 'express-validator';
import { HttpValidationError } from './error-handling';

export const doValidation = (req: Request) => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpValidationError(errors.array());
  }
};
