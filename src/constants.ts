import dotenv from 'dotenv';
import { LogLevelString } from 'bunyan';
import { PoolConfig } from 'pg';
import { RedisOptions } from 'ioredis';

dotenv.config();

process.env.NODE_ENV ??= 'production';

const appName = process.env.npm_package_name || 'my_awesome_node_backed';

export default {
  server: {
    port: process.env.SERVER_PORT || 9000,
  },
  database: {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'changeme',
    host: process.env.DB_HOST || 'database',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'mydbname',
    application_name: appName,
    max: 10,
  } as PoolConfig,
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT || 6379),
    connectionName: appName,
    lazyConnect: true,
  } as RedisOptions,
  logging: {
    level: (process.env.LOGGING_LEVEL as LogLevelString) || 'info',
  },
};
