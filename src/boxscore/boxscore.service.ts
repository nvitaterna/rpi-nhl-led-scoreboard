import { NhlApi } from '@/nhl-api/nhl-api';
import { BoxscoreRepository } from './boxscore.repository';
import { isAfter } from 'date-fns';

export class BoxscoreService {
  constructor(
    private boxscoreRepository: BoxscoreRepository,
    private nhlApi: NhlApi,
  ) {}

  async get() {
    return this.boxscoreRepository.get();
  }

  async fetchBoxscore(gameId: number) {
    const boxscore = await this.nhlApi.fetchBoxscore(gameId);

    // If the game is upcoming and the current time is after the start time,
    // then the game is live.
    if (
      boxscore.status === 'UPCOMING' &&
      isAfter(new Date(), boxscore.startTimeUtc)
    ) {
      boxscore.status = 'LIVE';
    }

    await this.boxscoreRepository.set(boxscore);
  }

  async clear() {
    await this.boxscoreRepository.clear();
  }
}
