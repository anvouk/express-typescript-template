import { NextFunction, Request, Response } from 'express';

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  return next();
}
