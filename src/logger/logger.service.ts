import pino from 'pino';
import { ConfigService } from '../config/config.service';

export class LoggerService {
  logger: pino.Logger<never>;

  constructor(configService: ConfigService) {
    this.logger = pino({
      level: configService.appConfig.logLevel,
    });
  }

  child(name: string) {
    return this.logger.child({ name });
  }
}
