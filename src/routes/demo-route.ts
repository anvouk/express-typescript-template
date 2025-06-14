import express, { NextFunction, Request } from 'express';
import demoController from '../controllers/demo-controller';
import z from 'zod';

const router = express.Router();

const ReqDemoRouteBodySchema = z.strictObject({
  name: z.string().nonempty(),
});
type ReqDemoRouteBody = z.infer<typeof ReqDemoRouteBodySchema>;

router.post('/', async (req: Request, res: any, next: NextFunction) => {
  const body: ReqDemoRouteBody = ReqDemoRouteBodySchema.parse(req.body);

  return res.status(200).json({
    greetings: await demoController.greetings(body.name),
  });
});

export default router;
