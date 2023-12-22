import { getScores } from '../nhl-api/nhl-api';
import { ScoreResponse } from '../nhl-api/types/score-response';
import { getCurrentDate } from '../utils/date';

// set throttle to 1s in ms
const THROTTLE = 1000;

export class ScoreFetcher {
  private lastFetched: Date = new Date(0);

  private scores: ScoreResponse | null = null;

  constructor() {}

  private async fetchScores(throttle = THROTTLE) {
    // fetch max via throttle
    const now = new Date();

    if (now.getTime() - this.lastFetched.getTime() <= throttle) {
      return;
    }

    this.lastFetched = now;

    try {
      this.scores = await getScores(getCurrentDate());
    } catch (e) {
      console.error('Error fetching scores.');
    }
  }

  public getScores() {
    return this.scores;
  }

  public loop(throttle?: number) {
    this.fetchScores(throttle);
  }
}
