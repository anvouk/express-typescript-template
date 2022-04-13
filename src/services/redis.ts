import IORedis from 'ioredis';
import constants from '../constants';
import { createSubLogger } from '../logger';

const logger = createSubLogger('redis');

const redisClient: IORedis = new IORedis(constants.redis);

redisClient.on('error', (err) => {
  logger.error(err, 'redis connection error');
});

export default redisClient;
