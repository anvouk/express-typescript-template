import pg from 'pg';
import constants from '../constants';
import { createSubLogger } from '../logger';

const logger = createSubLogger('database');

const pgPool = new pg.Pool({
  ...constants.database,
  max: 10,
});

pgPool.on('error', (err, client) => {
  logger.error(err, 'pg pool error');
});

export default pgPool;
