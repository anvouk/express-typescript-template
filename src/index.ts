import { SERVER_PORT } from './constants';
import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { createSubLogger } from './logger';
import { endpointNotFound, errorHandler } from './middlewares/error-handling';
import redisClient from './services/redis';
import demoRoute from './routes/demo-route';
import { authGuard } from './middlewares/auth';

const app: Express = express();
const logger = createSubLogger('app');

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

app.get('/', (req, res) => {
  res.json({
    app: process.env.npm_package_name,
    apiVersion: process.env.npm_package_version,
    env: process.env.NODE_ENV,
  });
});

app.use('/api/v1/demo', authGuard, demoRoute);

app.use(endpointNotFound);
app.use(errorHandler);

const server = createServer(app);
server.listen(SERVER_PORT, async () => {
  if (process.env.NODE_ENV === 'production') {
    logger.info(`server listening on port: ${SERVER_PORT}`);
  } else {
    logger.info(`development server listening at http://localhost:${SERVER_PORT}`);
  }
});

process.on('SIGTERM', async () => {
  server.close(async (err) => {
    if (err) {
      logger.warn({ error: err }, 'server closed with errors');
    }
    redisClient.disconnect();
    process.exit(0);
  });
});
