import dotenv from 'dotenv';
import pino from 'pino';
import z from 'zod';
import * as process from 'node:process';

dotenv.config();

process.env.NODE_ENV ??= 'production';

const PinoLevel = z.custom<pino.Level>((val) => {
  if (typeof val !== 'string') {
    return false;
  }
  return ['fatal', 'error', 'warn', 'info', 'debug', 'trace'].indexOf(val) !== -1;
});

const Settings = z
  .object({
    LOG_LEVEL: PinoLevel.optional().default('info'),
    SERVER_PORT: z.number().optional().default(9000),
    DB_CONN_STRING: z.string().optional().default('postgresql://user:password@localhost:5432/dbname'),
    REDIS_HOST: z.string().optional().default('redis'),
    REDIS_PORT: z.number().optional().default(6379),
  })
  .readonly();

const settings = Settings.safeParse({
  LOG_LEVEL: process.env.LOG_LEVEL,
  SERVER_PORT: process.env.SERVER_PORT,
  DB_CONN_STRING: process.env.DB_CONN_STRING,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
});

if (!settings.success) {
  console.error('invalid app settings', settings.error);
  process.exit(1);
}

export default settings.data;
