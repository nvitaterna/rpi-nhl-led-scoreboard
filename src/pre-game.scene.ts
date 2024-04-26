import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { UiData } from './ui-data/ui-data.schema';
import { LogoRenderer } from './logo.renderer';
import { TextRenderer } from './text.renderer';
import { getFont } from './font/fonts';

export class PreGameScene {
  private homeLogoRenderer: LogoRenderer;
  private awayLogoRenderer: LogoRenderer;
  private day: TextRenderer;

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

    const date = new Date(uiData.boxscore.startTimeUtc);

    const dayNumber = date.getDay();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[dayNumber];

    this.day = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, dayName, font),
      0,
      font,
      dayName,
    );
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.day.render();
  }
}
