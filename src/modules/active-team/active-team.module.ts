import type { Config } from '@/lib/config/config.js';
import { getLogger } from '@/lib/logger/logger.js';

import { ActiveTeamService } from './active-team.service.js';

export class ActiveTeamModule {
  public readonly activeTeamService: ActiveTeamService;

  constructor(config: Config) {
    const logger = getLogger('ActiveTeamModule');
    this.activeTeamService = new ActiveTeamService(logger, config);
  }
}
