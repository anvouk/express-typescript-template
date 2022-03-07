import express, { NextFunction, Request, Response } from 'express';
import demoController from '../controllers/demo-controller';
import { doValidation } from '../middlewares/validation';
import { body, ValidationChain } from 'express-validator';

const router = express.Router();

const demoRouteValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('Must not be empty or null').isString().withMessage('Must be a string'),
];

router.post('/', demoRouteValidation, async (req: Request, res: Response, next: NextFunction) => {
  try {
    doValidation(req);
    const name: string = req.body.name;
    return res.status(200).json({
      greetings: await demoController.greetings(name),
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
