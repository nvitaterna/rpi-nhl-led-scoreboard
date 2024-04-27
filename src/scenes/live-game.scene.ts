import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { UiData } from '@/ui-data/ui-data.schema';
import { LogoRenderer } from '@/renderers/logo.renderer';
import { Renderer } from '@/renderers/renderer';
import { ClockRenderer } from '@/renderers/clock.renderer';
import { ScoreRenderer } from '@/renderers/score.renderer';

export class LiveGameScene extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private clockRenderer: ClockRenderer;
  private scoreRenderer: ScoreRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);
    this.homeLogoRenderer = new LogoRenderer(matrix, uiData.homeTeamLogo, true);

    this.awayLogoRenderer = new LogoRenderer(
      matrix,
      uiData.awayTeamLogo,
      false,
    );

    this.clockRenderer = new ClockRenderer(matrix, uiData);

    this.scoreRenderer = new ScoreRenderer(matrix, uiData);
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.clockRenderer.render();
    this.scoreRenderer.render();
  }
}
