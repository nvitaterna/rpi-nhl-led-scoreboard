import { getLogger } from '@/lib/logger/logger.js';
import { TeamsModule } from '@/modules/teams/teams.module.js';

import { LogosService } from './logos.service.js';

export class LogosModule {
  public readonly logosService: LogosService;

  constructor(teamsModule: TeamsModule) {
    const logger = getLogger('LogosModule');
    this.logosService = new LogosService(logger, teamsModule.teamsService);
  }
}
