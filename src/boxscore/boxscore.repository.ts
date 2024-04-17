import { BoxscoreData } from './boxscore.schema';

export class BoxscoreRepository {
  private boxscore: BoxscoreData | null = null;

  async get() {
    return this.boxscore;
  }

  async set(boxscore: BoxscoreData) {
    this.boxscore = boxscore;
  }
}
