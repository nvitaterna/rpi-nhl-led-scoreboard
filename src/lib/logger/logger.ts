import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'debug';

export type Logger = pino.Logger;

export const getLogger = (name: string) => {
  return pino({
    name,
    level: logLevel,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });
};
