import bunyan from 'bunyan';
import { LOG_LEVEL } from './constants';

export function createSubLogger(name: string): bunyan {
  return bunyan.createLogger({
    name: name,
    level: process.env.NODE_ENV !== 'test' ? LOG_LEVEL : 'fatal',
    src: process.env.NODE_ENV !== 'development',
  });
}
