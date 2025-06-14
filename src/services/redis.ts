import IORedis from 'ioredis';
import { createSubLogger } from '../logger';
import settings from '../settings';

const logger = createSubLogger('redis');

const redisClient: IORedis = new IORedis({
  host: settings.REDIS_HOST,
  port: settings.REDIS_PORT,
  connectionName: 'demo-server',
  lazyConnect: true,
});

redisClient.on('error', (err) => {
  logger.error(err, 'redis connection error');
});

export default redisClient;
