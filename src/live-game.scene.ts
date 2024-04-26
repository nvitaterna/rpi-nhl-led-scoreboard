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

    // const lines = LayoutUtils.textToLines(font, 64, text);
    // const glyphs = LayoutUtils.linesToMappedGlyphs(
    //   lines,
    //   font.height(),
    //   matrix.width(),
    //   matrix.height(),
    //   HorizontalAlignment.Center,
    // );

    // glyphs.map((glyph) => {
    //   this.matrix.drawText(glyph.char, glyph.x, glyph.y);
    // });

    this.text = new TextRenderer(matrix, 0, 0, font, text);
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.text.render();
  }
}
