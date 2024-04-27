import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { UiData } from '@/ui-data/ui-data.schema';
import { LogoRenderer } from '@/renderers/logo.renderer';
import { TextRenderer } from '@/renderers/text.renderer';
import { smallFont } from '@/font/fonts';
import { formatDate } from 'date-fns';
import { Renderer } from '@/renderers/renderer';

export class PreGameScene extends Renderer {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private day: TextRenderer;
  private time: TextRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);
    this.homeLogoRenderer = new LogoRenderer(matrix, uiData.homeTeamLogo, true);

    this.awayLogoRenderer = new LogoRenderer(
      matrix,
      uiData.awayTeamLogo,
      false,
    );

    const dayOfWeek = formatDate(uiData.boxscore.startTimeUtc, 'EEE');

    this.day = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, dayOfWeek, smallFont),
      3,
      smallFont,
      dayOfWeek,
    );

    const time = formatDate(uiData.boxscore.startTimeUtc, 'h:mma');

    this.time = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, time, smallFont),
      smallFont.height() + 4,
      smallFont,
      time,
    );
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.day.render();
    this.time.render();
  }
}
