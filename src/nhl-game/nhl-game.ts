import { Clock } from '../clock/clock';
import { GameState } from '../nhl-api/types/game-state';
import { PeriodDescriptor } from '../nhl-api/types/score-response';
import { Team } from '../team/team';

// live - game is in progress
// off - game is not over
// pre - pre game
// fut - future game

export class NhlGame {
  public clock = new Clock();
  public status: GameState = 'OFF';

  constructor(
    public readonly id: number,
    public homeTeam: Team,
    public awayTeam: Team,
  ) {}

  updatePeriod(period: PeriodDescriptor) {
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

  updateGameStatus(status: GameState) {
    this.status = status;
  }

  loop() {
    this.clock.loop();
  }
}
