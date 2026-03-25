import type { KyInstance } from 'ky';

import { KeyedCache } from '@/lib/cache/keyed-cache.js';
import type { Logger } from '@/lib/logger/logger.js';

import { playByPlayResponseSchema } from './play-by-play.schemas.js';
import type { PlayByPlayResponse } from './play-by-play.schemas.js';

const PLAY_BY_PLAY_TTL = 1000 * 5; // 5 seconds

export class PlayByPlayApi {
  private readonly cache: KeyedCache<PlayByPlayResponse, number>;

  constructor(
    private readonly logger: Logger,
    private readonly nhlWebApi: KyInstance,
  ) {
    this.cache = new KeyedCache(PLAY_BY_PLAY_TTL, (gameId) =>
      this.fetchPlayByPlay(gameId),
    );
  }

  async get(gameId: number) {
    this.logger.debug(`Getting play-by-play for game ${gameId}.`);

    const playByPlay = await this.cache.get(gameId);

    this.logger.debug(`Got play-by-play for game ${gameId}.`);

    return playByPlay;
  }

  private async fetchPlayByPlay(gameId: number) {
    this.logger.debug(`Fetching play-by-play for game ${gameId} from NHL API.`);

    const response = await this.nhlWebApi
      .get(`v1/gamecenter/${gameId}/play-by-play`)
      .json()
      .then((data) => {
        return playByPlayResponseSchema.parse(data);
      });

    this.logger.debug(`Fetched play-by-play for game ${gameId}.`);

    return response;
  }
}
