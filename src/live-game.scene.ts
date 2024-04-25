import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { UiData } from './ui-data/ui-data.schema';
import { LogoRenderer } from './logo.renderer';

export class LiveGameScene {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;

  constructor(
    private matrix: LedMatrixInstance,
    private uiData: UiData,
  ) {
    this.homeLogoRenderer = new LogoRenderer(matrix, uiData.homeTeamLogo, true);

    this.awayLogoRenderer = new LogoRenderer(
      matrix,
      uiData.awayTeamLogo,
      false,
    );
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
  }
}
