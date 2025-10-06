import type { KyInstance } from 'ky';

import { KeyedCache } from '@/lib/cache/keyed-cache.js';
import type { Logger } from '@/lib/logger/logger.js';

import {
  type ScheduleResponse,
  scheduleResponseSchema,
} from './schedule.schemas.js';

const SCHEDULE_TTL = 1000 * 60 * 60; // 1 hour

export class ScheduleApi {
  private readonly cache: KeyedCache<ScheduleResponse>;

  constructor(
    private readonly logger: Logger,
    private readonly nhlWebApi: KyInstance,
  ) {
    this.cache = new KeyedCache(SCHEDULE_TTL, (teamAbbrev) =>
      this.fetchSchedule(teamAbbrev),
    );
  }

  async get(teamAbbrev: string): Promise<ScheduleResponse> {
    return this.cache.get(teamAbbrev);
  }

  private async fetchSchedule(teamAbbrev: string) {
    this.logger.debug(`Fetching schedule for team ${teamAbbrev} from NHL API.`);

    const response = await this.nhlWebApi
      .get(`v1/club-schedule-season/${teamAbbrev}/now`)
      .json()
      .then((data) => scheduleResponseSchema.parse(data));

    this.logger.debug(
      `Fetched ${response.games.length} games for team ${teamAbbrev}.`,
    );

    return response;
  }
}
