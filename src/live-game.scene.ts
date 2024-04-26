import {
  HorizontalAlignment,
  LayoutUtils,
  LedMatrixInstance,
} from '@nvitaterna/rpi-led-matrix';
import { UiData } from './ui-data/ui-data.schema';
import { LogoRenderer } from './logo.renderer';
import { TextRenderer } from './text.renderer';
import { getFont } from './font/fonts';

export class LiveGameScene {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private text: TextRenderer;

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

    const font = getFont('small');
    const text = 'TEST';

    const centeredX = TextRenderer.getCenteredX(matrix, text, font);

    this.text = new TextRenderer(matrix, centeredX, 0, font, text);
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.text.render();
  }
}
