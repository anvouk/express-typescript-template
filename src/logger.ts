import pino from 'pino';
import { LOG_LEVEL } from './constants';

const root = pino({
  level: LOG_LEVEL,
  enabled: process.env.NODE_ENV !== 'test',
}, pino.destination({
  sync: false,
}));

export function createSubLogger(name: string): pino.Logger {
  return root.child({
    name: name,
  });
}
