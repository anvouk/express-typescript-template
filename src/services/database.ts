import pg from 'pg';
import { APP_NAME, DB_CONN_STRING } from '../constants';
import { createSubLogger } from '../logger';

const logger = createSubLogger('database');

const pgPool = new pg.Pool({
  connectionString: DB_CONN_STRING,
  application_name: APP_NAME,
});

pgPool.on('error', (err, client) => {
  logger.error(err, 'pg pool error');
});

export default pgPool;
