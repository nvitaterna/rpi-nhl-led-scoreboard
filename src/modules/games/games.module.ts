import { getLogger } from '@/lib/logger/logger.js';
import type { NhlApi } from '@/lib/nhl-api/nhl-api.js';

import { GamesService } from './games.service.js';

export class GamesModule {
  public readonly gamesService: GamesService;

  constructor(nhlApi: NhlApi) {
    const logger = getLogger('GamesModule');
    this.gamesService = new GamesService(logger, nhlApi);
  }
}
