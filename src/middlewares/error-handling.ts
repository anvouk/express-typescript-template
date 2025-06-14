import { Request, Response, NextFunction } from 'express';
import { createSubLogger } from '../logger';
import z from 'zod';

const logger = createSubLogger('httpError');

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
  ) {
    super(message);
  }
}

export class HttpAuthUnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class HttpAuthForbiddenError extends HttpError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class HttpBadRequest extends HttpError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class HttpResourceNotFound extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class HttpResourceAlreadyExists extends HttpError {
  constructor(message: string) {
    super(message, 409);
  }
}

export function endpointNotFound(req: Request, res: Response) {
  res.format({
    'text/html': () => res.status(404).send(`<html lang="en"><h1>Error 404: Endpoint not found</h1></html>`),
    'application/json': () => {
      throw new HttpResourceNotFound('Endpoint not found');
    },
  });
}

export function errorHandler(err: any, req: Request, res: any, next: NextFunction) {
  // handle partial message already sent error with default handler
  if (res.headersSent) {
    logger.error(err, 'partial error handling');
    return next(err);
  }

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: {
        message: 'validation error',
        status: 400,
        issues: process.env.NODE_ENV !== 'production' ? err.issues : undefined,
      },
    });
  }

  const statusCode = err.status || 500;
  let errorMsg = err.message || 'Internal Server Error';
  if (statusCode === 500) {
    logger.error(err, { errorMsg, statusCode });
  } else {
    logger.warn(err, { errorMsg, statusCode });
  }

  // obscure error messages in prod.
  if (process.env.NODE_ENV === 'production') {
    errorMsg = undefined;
  }

  return res.status(statusCode).json({
    error: {
      message: errorMsg,
      status: statusCode,
    },
  });
}
