import pino from 'pino';
import settings from './settings';

const root = pino(
  {
    level: settings.LOG_LEVEL,
    enabled: process.env.NODE_ENV !== 'test',
  },
  pino.destination({
    sync: false,
  }),
);

export function createSubLogger(name: string): pino.Logger {
  return root.child({
    name: name,
  });
}
