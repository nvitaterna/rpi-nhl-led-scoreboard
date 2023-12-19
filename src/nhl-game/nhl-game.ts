import { Clock } from '../clock/clock';
import { Team } from '../team/team';

// live - game is in progress
// off - game is not over
// pre - pre game
// fut - future game

export type GameStatus = 'LIVE' | 'OFF' | 'PRE' | 'FUT';

export class NhlGame {
  public clock = new Clock();
  public status = 'OFF';

  constructor(
    public readonly id: number,
    public homeTeam: Team,
    public awayTeam: Team,
  ) {}

  updatePeriod(period: number) {
    this.clock.setPeriod(period);
  }

  updateClock(time: string) {
    this.clock.setTime(time);
  }

  updateHomeScore(score: number) {
    this.homeTeam.score = score;
  }

  updateAwayScore(score: number) {
    this.awayTeam.score = score;
  }

  updateClockRunning(running: boolean, time: string) {
    if (this.clock.running !== running) {
      if (running) {
        this.clock.startClock(time);
      } else {
        this.clock.stopClock(time);
      }
    }
    this.clock.running = running;
  }

  updateGameStatus(status: GameStatus) {
    this.status = status;
  }

  loop() {
    this.clock.loop();
  }
}
