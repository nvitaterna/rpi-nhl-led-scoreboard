import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { UiData } from './ui-data/ui-data.schema';
import { LogoRenderer } from './logo.renderer';
import { TextRenderer } from './text.renderer';
import { smallFont } from './font/fonts';
import { Renderer } from './renderer';

export class LiveGameScene extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private text: TextRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);
    this.homeLogoRenderer = new LogoRenderer(matrix, uiData.homeTeamLogo, true);

    this.awayLogoRenderer = new LogoRenderer(
      matrix,
      uiData.awayTeamLogo,
      false,
    );

    const text = 'TEST';

    const centeredX = TextRenderer.getCenteredX(matrix, text, smallFont);

    this.text = new TextRenderer(matrix, centeredX, 0, smallFont, text);
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.text.render();
  }
}
