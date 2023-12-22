import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { NhlGame } from '../nhl-game/nhl-game';
import { LogoRenderer } from './logo-renderer';
import { Renderer } from './renderer';
import { ScoreRenderer } from './score-renderer';
import { GameStateRenderer } from './game-state-renderer';

export class FinalGameRenderer extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private scoreRenderer: ScoreRenderer;
  private gameStateRenderer: GameStateRenderer;

  constructor(
    protected matrix: LedMatrixInstance,
    private game: NhlGame,
    homeLogo: Buffer,
    awayLogo: Buffer,
  ) {
    super(matrix);

    this.homeLogoRenderer = new LogoRenderer(matrix, homeLogo, true);
    this.awayLogoRenderer = new LogoRenderer(matrix, awayLogo, false);
    this.scoreRenderer = new ScoreRenderer(matrix);
    this.gameStateRenderer = new GameStateRenderer(
      matrix,
      this.game.clock.getPeriod(),
    );
  }

  public update() {
    this.scoreRenderer.setHome(this.game.homeTeam.score);
    this.scoreRenderer.setAway(this.game.awayTeam.score);

    this.homeLogoRenderer.update();
    this.awayLogoRenderer.update();
    this.scoreRenderer.update();
    this.gameStateRenderer.update();
  }
}
