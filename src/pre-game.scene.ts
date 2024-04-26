import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { UiData } from './ui-data/ui-data.schema';
import { LogoRenderer } from './logo.renderer';
import { TextRenderer } from './text.renderer';
import { getFont } from './font/fonts';
import { formatDate } from 'date-fns';

export class PreGameScene {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private day: TextRenderer;
  private time: TextRenderer;

  constructor(
    private matrix: LedMatrixInstance,
    uiData: UiData,
  ) {
    this.homeLogoRenderer = new LogoRenderer(matrix, uiData.homeTeamLogo, true);

    this.awayLogoRenderer = new LogoRenderer(
      matrix,
      uiData.awayTeamLogo,
      false,
    );

    const font = getFont('small');

    const dayOfWeek = formatDate(uiData.boxscore.startTimeUtc, 'EEE');

    this.day = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, dayOfWeek, font),
      font.height(),
      font,
      dayOfWeek,
    );

    const time = formatDate(uiData.boxscore.startTimeUtc, 'h:mma');

    this.time = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, time, font),
      font.height() * 2 + 1,
      font,
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
