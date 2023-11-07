import express, { NextFunction, Request, Response } from 'express';
import demoController from '../controllers/demo-controller';
import { validatedBody } from '../middlewares/validation';
import { body } from 'express-validator';

const router = express.Router();

interface ReqDemoRouteBody {
  name: string;
}

router.post(
  '/',
  body('name').notEmpty().withMessage('value is null').isString().withMessage('value is not a string'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = validatedBody<ReqDemoRouteBody>(req);

      return res.status(200).json({
        greetings: await demoController.greetings(body.name),
      });
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
