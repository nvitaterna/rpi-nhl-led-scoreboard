import { getLogger } from '@/lib/logger/logger.js';
import type { NhlApi } from '@/lib/nhl-api/nhl-api.js';

import type { ActiveTeamModule } from '../active-team/active-team.module.js';
import type { LogosModule } from '../logos/logos.module.js';
import type { TeamsModule } from '../teams/teams.module.js';

import { DataLoopService } from './data-loop.service.js';

export class DataLoopModule {
  public readonly dataLoopService: DataLoopService;

  constructor(
    nhlApi: NhlApi,
    teamsModule: TeamsModule,
    logosModule: LogosModule,
    activeTeamModule: ActiveTeamModule,
  ) {
    const logger = getLogger('DataLoopModule');

    this.dataLoopService = new DataLoopService(
      logger,
      nhlApi,
      teamsModule.teamsService,
      logosModule.logosService,
      activeTeamModule.activeTeamService,
    );
  }
}
