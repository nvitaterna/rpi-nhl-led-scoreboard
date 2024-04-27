import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { UiData } from './ui-data/ui-data.schema';
import { LogoRenderer } from './logo.renderer';
import { Renderer } from './renderer';
import { ClockRenderer } from './clock-renderer';

export class LiveGameScene extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private clockRenderer: ClockRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);
    this.homeLogoRenderer = new LogoRenderer(matrix, uiData.homeTeamLogo, true);

    this.awayLogoRenderer = new LogoRenderer(
      matrix,
      uiData.awayTeamLogo,
      false,
    );

    this.clockRenderer = new ClockRenderer(matrix, uiData);
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.clockRenderer.render();
    this.text.render();
  }
}
