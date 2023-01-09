import dotenv from 'dotenv';
import pino from "pino";

dotenv.config();

process.env.NODE_ENV ??= 'production';

export const LOG_LEVEL: pino.Level = (process.env.LOG_LEVEL as pino.Level) || 'info';

export const APP_NAME: string = process.env.npm_package_name || 'my_awesome_node_backed';

export const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 9000;

export const DB_CONN_STRING: string = process.env.DB_CONN_STRING || 'postgresql://user:password@localhost:5432/dbname';

export const REDIS_HOST: string = process.env.REDIS_HOST || 'redis';
export const REDIS_PORT: number = Number(process.env.REDIS_PORT || 6379);
