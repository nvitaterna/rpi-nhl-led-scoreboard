import type { KyInstance } from 'ky';

import { KeyedCache } from '@/lib/cache/keyed-cache.js';
import type { Logger } from '@/lib/logger/logger.js';

import { boxscoreResponseSchema } from './boxscore.schemas.js';
import type { BoxscoreResponse } from './boxscore.schemas.js';

const BOXSCORE_TTL = 1000 * 10; // 10 seconds

export class BoxscoreApi {
  private readonly cache: KeyedCache<BoxscoreResponse, number>;

  constructor(
    private readonly logger: Logger,
    private readonly nhlWebApi: KyInstance,
  ) {
    this.cache = new KeyedCache(BOXSCORE_TTL, (gameId) =>
      this.fetchBoxscore(gameId),
    );
  }

  async get(gameId: number) {
    this.logger.debug(`Getting boxscore for game ${gameId}.`);

    const boxscore = await this.cache.get(gameId);

    this.logger.debug(`Got boxscore for game ${gameId}.`);

    return boxscore;
  }

  private async fetchBoxscore(gameId: number) {
    this.logger.debug(`Fetching boxscore for game ${gameId} from NHL API.`);

    const response = await this.nhlWebApi
      .get(`v1/gamecenter/${gameId}/boxscore`)
      .json()
      .then((data) => {
        return boxscoreResponseSchema.parse(data);
      });

    this.logger.debug(`Fetched boxscore for game ${gameId}.`);

    return response;
  }
}
