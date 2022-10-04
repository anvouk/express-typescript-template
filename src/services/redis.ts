import IORedis from 'ioredis';
import { createSubLogger } from '../logger';
import { APP_NAME, REDIS_HOST, REDIS_PORT } from '../constants';

const logger = createSubLogger('redis');

const redisClient: IORedis = new IORedis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  connectionName: APP_NAME,
  lazyConnect: true,
});

redisClient.on('error', (err) => {
  logger.error(err, 'redis connection error');
});

export default redisClient;
