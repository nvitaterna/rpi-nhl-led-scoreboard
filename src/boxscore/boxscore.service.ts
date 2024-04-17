import { NhlApi } from '../nhl-api/nhl-api';
import { BoxscoreRepository } from './boxscore.repository';

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

    await this.boxscoreRepository.set(boxscore);
  }
}
