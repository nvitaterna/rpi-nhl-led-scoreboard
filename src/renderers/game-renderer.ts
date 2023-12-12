import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { NHLGame } from '../game';
import { LogoRenderer } from './logo-renderer';
import { PeriodRenderer } from './period-renderer';
import { Renderer } from './renderer';
import { ScoreRenderer } from './score-renderer';
import { TimeRenderer } from './time-renderer';

export class GameRenderer extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private periodRenderer: PeriodRenderer;
  private timeRenderer: TimeRenderer;
  private scoreRenderer: ScoreRenderer;

  constructor(
    protected matrix: LedMatrixInstance,
    private game: NHLGame,
    private homeLogo: Buffer,
    private awayLogo: Buffer,
  ) {
    super(matrix);

    this.homeLogoRenderer = new LogoRenderer(matrix, homeLogo, true);
    this.awayLogoRenderer = new LogoRenderer(matrix, awayLogo, false);
    this.periodRenderer = new PeriodRenderer(matrix);
    this.timeRenderer = new TimeRenderer(matrix);
    this.scoreRenderer = new ScoreRenderer(matrix);
  }

  public update(): void {
    this.timeRenderer.setTime(this.game.getTime());
    this.periodRenderer.setPeriod(this.game.getPeriod());
    this.scoreRenderer.setHome(this.game.getHomeScore());
    this.scoreRenderer.setAway(this.game.getAwayScore());

    this.homeLogoRenderer.update();
    this.awayLogoRenderer.update();
    this.periodRenderer.update();
    this.timeRenderer.update();
    this.scoreRenderer.update();
  }
}
