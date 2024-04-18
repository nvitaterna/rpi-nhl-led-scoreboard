import { GameService } from '../game/game.service';
import { LoggerService } from '../logger/logger.service';
import { Updateable } from '../updateable/updateable';
import { BoxscoreService } from './boxscore.service';

const DEFAULT_BOXSCORE_UPDATE_INTERVAl = 5000;

export class BoxscoreUpdater extends Updateable {
  constructor(
    private boxscoreService: BoxscoreService,
    private gameService: GameService,
    private loggerService: LoggerService,
  ) {
    super(DEFAULT_BOXSCORE_UPDATE_INTERVAl);
  }

  public async update() {
    if (!(await this.shouldUpdate())) {
      this.loggerService.debug('BoxscoreUpdater: skipping update.');
      return;
    }

    const game = await this.gameService.getActiveGame();

    if (!game) {
      this.loggerService.debug(
        'BoxscoreUpdater: no active game, skipping update.',
      );
      return;
    }

    this.loggerService.info(
      `BoxscoreUpdater: updating boxscore for game ${game.id}.`,
    );

    await this.boxscoreService.fetchBoxscore(game.id);

    const boxscore = await this.boxscoreService.get();

    if (boxscore) {
      // 3 status codes:
      // LIVE, FINAL, UPCOMING
      switch (boxscore.status) {
        case 'LIVE': {
          // update every 5 seconds
          this.loggerService.debug(
            'BoxscoreUpdater: game is live, updating every 5 seconds.',
          );
          this.updateInterval = 5000;
          break;
        }
        case 'FINAL': {
          // update every 30 mins
          this.loggerService.debug(
            'BoxscoreUpdater: game is final, updating every 30 minutes.',
          );
          this.updateInterval = 30 * 60 * 1000;
          break;
        }
        case 'UPCOMING': {
          // if "upcoming" but game start time already passed
          if (boxscore.startTimeUtc < Date.now()) {
            // update every 5 seconds
            this.loggerService.debug(
              'BoxscoreUpdater: game is upcoming but start time has passed, updating every 5 seconds.',
            );
            this.updateInterval = 5000;
          } else {
            // update every minute
            this.loggerService.debug(
              'BoxscoreUpdater: game is upcoming, updating every minute.',
            );
            this.updateInterval = 60 * 1000;
          }
          break;
        }
      }
    } else {
      this.loggerService.info('BoxscoreUpdater: no boxscore found.');
    }

    this.afterUpdate();
  }
}
