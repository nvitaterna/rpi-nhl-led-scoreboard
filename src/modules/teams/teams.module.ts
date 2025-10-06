import { getLogger } from '@/lib/logger/logger.js';
import type { NhlApi } from '@/lib/nhl-api/nhl-api.js';

import { GamesModule } from '../games/games.module.js';

import { TeamsService } from './teams.service.js';

export class TeamsModule {
  public readonly teamsService: TeamsService;

  constructor(nhlApi: NhlApi, gamesModule: GamesModule) {
    const logger = getLogger('TeamsModule');
    this.teamsService = new TeamsService(
      logger,
      nhlApi,
      gamesModule.gamesService,
    );
  }
}
