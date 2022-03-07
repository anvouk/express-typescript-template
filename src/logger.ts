import bunyan from 'bunyan';
import constants from './constants';

export function createSubLogger(name: string): bunyan {
  return bunyan.createLogger({
    name: name,
    level: process.env.NODE_ENV !== 'test' ? constants.logging.level : 'fatal',
    src: process.env.NODE_ENV !== 'development',
  });
}
