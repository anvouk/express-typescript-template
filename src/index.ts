import settings from './settings';
import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { createSubLogger } from './logger';
import { endpointNotFound, errorHandler } from './middlewares/error-handling';
import redisClient from './services/redis';
import demoRoute from './routes/demo-route';
import { authGuard } from './middlewares/auth';

const app: Express = express();
const logger = createSubLogger('app');

app.use(cors());
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  if (process.env.NODE_ENV === 'production') {
    morgan.format(
      'combined-with-timings',
      ':remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms',
    );
    app.use(morgan('combined-with-timings'));
  } else {
    app.use(morgan('dev'));
  }
}

app.use('/api/v1/demo', authGuard, demoRoute);

app.use(endpointNotFound);
app.use(errorHandler);

const server = createServer(app);
server.listen(settings.SERVER_PORT, async () => {
  if (process.env.NODE_ENV === 'production') {
    logger.info(`server listening on port: ${settings.SERVER_PORT}`);
  } else {
    logger.info(`development server listening at http://localhost:${settings.SERVER_PORT}`);
  }
});

async function shutdownHook() {
  try {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  } catch (err) {
    logger.warn(err, 'server closed with errors');
  } finally {
    redisClient.disconnect();
  }
}

process.on('SIGINT', shutdownHook);
process.on('SIGTERM', shutdownHook);
