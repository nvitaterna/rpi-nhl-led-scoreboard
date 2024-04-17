import pino, { BaseLogger } from 'pino';
import { ConfigService } from '../config/config.service';

export class LoggerService implements BaseLogger {
  private logger: pino.Logger<never>;

  constructor(configService: ConfigService) {
    this.logger = pino({
      level: configService.appConfig.logLevel,
    });

    this.fatal = this.logger.fatal.bind(this.logger);
    this.error = this.logger.error.bind(this.logger);
    this.warn = this.logger.warn.bind(this.logger);
    this.info = this.logger.info.bind(this.logger);
    this.debug = this.logger.debug.bind(this.logger);
    this.trace = this.logger.trace.bind(this.logger);
    this.silent = this.logger.silent.bind(this.logger);
  }

  get level() {
    return this.logger.level;
  }

  fatal: pino.LogFn;
  error: pino.LogFn;
  warn: pino.LogFn;
  info: pino.LogFn;
  debug: pino.LogFn;
  trace: pino.LogFn;
  silent: pino.LogFn;
}
