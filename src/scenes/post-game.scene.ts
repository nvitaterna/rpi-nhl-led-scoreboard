import { GameStateRenderer } from '@/renderers/game-state.renderer';
import { LogoRenderer } from '@/renderers/logo.renderer';
import { Renderer } from '@/renderers/renderer';
import { ScoreRenderer } from '@/renderers/score.renderer';
import { UiData } from '@/ui-data/ui-data.schema';
import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';

export class PostGameScene extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private scoreRenderer: ScoreRenderer;
  private gameStateRenderer: GameStateRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);

    this.homeLogoRenderer = new LogoRenderer(matrix, uiData.homeTeamLogo, true);
    this.awayLogoRenderer = new LogoRenderer(
      matrix,
      uiData.awayTeamLogo,
      false,
    );

    this.scoreRenderer = new ScoreRenderer(matrix, uiData);

    this.gameStateRenderer = new GameStateRenderer(matrix, uiData);
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.scoreRenderer.render();
    this.gameStateRenderer.render();
  }
}
