import z from 'zod/v4';

// as per https://www.rfc-editor.org/rfc/rfc9457
export interface ProblemDetails {
  type: string;
  status?: number;
  title?: string;
  detail?: string;
  instance?: string;
}

export interface ValidationProblemDetails extends ProblemDetails {
  issues?: z.core.$ZodIssue[];
}

const problemDetailsMappings: { [statusCode: number]: { type: string; title: string } } = {
  400: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1', title: 'Bad Request' },
  401: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.2', title: 'Unauthorized' },
  403: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.4', title: 'Forbidden' },
  404: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.5', title: 'Not Found' },
  405: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.6', title: 'Method Not Allowed' },
  406: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.7', title: 'Not Acceptable' },
  408: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.9', title: 'Request Timeout' },
  409: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.10', title: 'Conflict' },
  412: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.13', title: 'Precondition Failed' },
  415: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.16', title: 'Unsupported Media Type' },
  422: { type: 'https://tools.ietf.org/html/rfc4918#section-11.2', title: 'Unprocessable Entity' },
  426: { type: 'https://tools.ietf.org/html/rfc9110#section-15.5.22', title: 'Upgrade Required' },
  500: {
    type: 'https://tools.ietf.org/html/rfc9110#section-15.6.1',
    title: 'An error occurred while processing your request.',
  },
  502: { type: 'https://tools.ietf.org/html/rfc9110#section-15.6.3', title: 'Bad Gateway' },
  503: { type: 'https://tools.ietf.org/html/rfc9110#section-15.6.4', title: 'Service Unavailable' },
  504: { type: 'https://tools.ietf.org/html/rfc9110#section-15.6.5', title: 'Gateway Timeout' },
};

export function generateProblemDetails(
  statusCode: number,
  title?: string,
  detail?: string,
  instance?: string,
  extensions?: any[],
): ProblemDetails {
  return {
    type: problemDetailsMappings[statusCode]?.type ?? 'about:blank',
    title: title ?? problemDetailsMappings[statusCode]?.title,
    detail: detail,
    instance: instance,
    status: statusCode,
    ...extensions?.reduce((prev, curr) => Object.assign(prev, curr), {}),
  };
}

export function generateValidationProblemDetail(
  error: z.ZodError,
  title?: string,
  detail?: string,
  instance?: string,
): ValidationProblemDetails {
  return {
    type: problemDetailsMappings[400].type,
    title: title ?? 'Validation error',
    detail: detail,
    instance: instance,
    status: 400,
    issues: process.env.NODE_ENV !== 'production' ? error.issues : undefined,
  };
}
