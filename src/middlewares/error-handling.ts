import { Request, Response, NextFunction } from 'express';
import { createSubLogger } from '../logger';
import z from 'zod/v4';
import { generateProblemDetails, generateValidationProblemDetail } from './problem-details';

const logger = createSubLogger('httpError');

export class HttpError {
  constructor(
    public readonly title?: string,
    public readonly detail?: string,
    public readonly extensions?: any[],
    public readonly status: number = 500,
  ) {}
}

export class HttpAuthUnauthorizedError extends HttpError {
  constructor(title?: string, detail?: string, extensions?: any[]) {
    super(title, detail, extensions, 401);
  }
}

export class HttpAuthForbiddenError extends HttpError {
  constructor(title?: string, detail?: string, extensions?: any[]) {
    super(title, detail, extensions, 403);
  }
}

export class HttpBadRequest extends HttpError {
  constructor(title?: string, detail?: string, extensions?: any[]) {
    super(title, detail, extensions, 400);
  }
}

export class HttpResourceNotFound extends HttpError {
  constructor(title?: string, detail?: string, extensions?: any[]) {
    super(title, detail, extensions, 404);
  }
}

export class HttpResourceAlreadyExists extends HttpError {
  constructor(title?: string, detail?: string, extensions?: any[]) {
    super(title, detail, extensions, 409);
  }
}

export function endpointNotFound(req: Request, res: Response) {
  throw new HttpResourceNotFound('Endpoint not found');
}

export function errorHandler(err: any, req: Request, res: any, next: NextFunction) {
  // handle partial message already sent error with default handler
  if (res.headersSent) {
    logger.error(err, 'partial error handling');
    return next(err);
  }

  if ((err as z.ZodError).issues !== undefined) {
    const problemDetail = generateValidationProblemDetail(err, undefined, undefined, req.url);
    return res.status(problemDetail.status).json(problemDetail);
  }
  if (err instanceof HttpError) {
    const problemDetail = generateProblemDetails(err.status, err.title, err.detail, req.url, err.extensions);
    return res.status(problemDetail.status).json(problemDetail);
  }

  // generic Error handling
  const statusCode = err.status || 500;
  let errorMsg = err.message || 'Internal Server Error';
  if (statusCode === 500) {
    logger.error(err, { errorMsg, statusCode });
  } else {
    logger.warn(err, { errorMsg, statusCode });
  }

  const problemDetail = generateProblemDetails(statusCode, undefined, errorMsg, req.url);
  return res.status(problemDetail.status).json(problemDetail);
}
