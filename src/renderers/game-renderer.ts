import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { LogoRenderer } from './logo-renderer';
import { PeriodRenderer } from './period-renderer';
import { Renderer } from './renderer';
import { ScoreRenderer } from './score-renderer';
import { TimeRenderer } from './time-renderer';
import { NhlGame } from '../nhl-game/nhl-game';

export class GameRenderer extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private periodRenderer: PeriodRenderer;
  private timeRenderer: TimeRenderer;
  private scoreRenderer: ScoreRenderer;

  constructor(
    protected matrix: LedMatrixInstance,
    private game: NhlGame,
    homeLogo: Buffer,
    awayLogo: Buffer,
  ) {
    super(matrix);

    matrix.clear();

    this.homeLogoRenderer = new LogoRenderer(matrix, homeLogo, true);
    this.awayLogoRenderer = new LogoRenderer(matrix, awayLogo, false);
    this.periodRenderer = new PeriodRenderer(matrix);
    this.timeRenderer = new TimeRenderer(matrix);
    this.scoreRenderer = new ScoreRenderer(matrix);
  }

  setGame(game: NhlGame) {
    this.game = game;
  }

  public update(): void {
    this.timeRenderer.setTime(this.game.clock.getTime());
    this.periodRenderer.setPeriod(this.game.clock.getPeriod());
    this.scoreRenderer.setHome(this.game.homeTeam.score);
    this.scoreRenderer.setAway(this.game.awayTeam.score);

    this.homeLogoRenderer.update();
    this.awayLogoRenderer.update();
    this.periodRenderer.update();
    this.timeRenderer.update();
    this.scoreRenderer.update();
  }
}
