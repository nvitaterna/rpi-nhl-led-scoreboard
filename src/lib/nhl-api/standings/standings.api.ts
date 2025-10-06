import type { KyInstance } from 'ky';

import { Cache } from '@/lib/cache/cache.js';
import type { Logger } from '@/lib/logger/logger.js';

import {
  type StandingsResponse,
  standingsResponeSchema,
} from './standings.schema.js';

const STANDINGS_TTL = 1000 * 60 * 60; // 1 hour

export class StandingsApi {
  private readonly cache: Cache<StandingsResponse>;

  constructor(
    private readonly logger: Logger,
    private readonly nhlWebApi: KyInstance,
  ) {
    this.cache = new Cache(STANDINGS_TTL, () => this.fetchStandings());
  }

  async get(): Promise<StandingsResponse> {
    return this.cache.get();
  }

  private async fetchStandings() {
    this.logger.debug('Fetching standings from NHL API.');

    const response = await this.nhlWebApi
      .get('v1/standings/now')
      .json()
      .then((data) => standingsResponeSchema.parse(data));

    this.logger.debug(
      `Fetched standings with ${response.standings.length} entries from NHL API.`,
    );

    return response;
  }
}
