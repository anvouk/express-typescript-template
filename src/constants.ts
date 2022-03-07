import dotenv from 'dotenv';
import { LogLevelString } from 'bunyan';

dotenv.config();

process.env.NODE_ENV ??= 'production';

export default {
  server: {
    port: process.env.SERVER_PORT || 9000,
  },
  database: {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'changeme',
    host: process.env.DB_HOST || 'database',
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || 'mydbname',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT || 6379),
  },
  logging: {
    level: (process.env.LOGGING_LEVEL as LogLevelString) || 'info',
  },
};
