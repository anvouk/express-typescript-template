import pg from 'pg';
import { createSubLogger } from '../logger';
import settings from '../settings';

const logger = createSubLogger('database');

const pgPool = new pg.Pool({
  connectionString: settings.DB_CONN_STRING,
  application_name: 'demo-server',
});

pgPool.on('error', (err, client) => {
  logger.error(err, 'pg pool error');
});

export default pgPool;
