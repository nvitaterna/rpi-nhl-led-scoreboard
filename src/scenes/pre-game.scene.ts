import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { UiData } from '@/ui-data/ui-data.schema';
import { LogoRenderer } from '@/renderers/logo.renderer';
import { TextRenderer } from '@/renderers/text.renderer';
import { smallFont } from '@/font/fonts';
import { formatDate } from 'date-fns';
import { Renderer } from '@/renderers/renderer';
import { differenceInCalendarDays } from '@/utils/date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const TEXT_OFFSET = 6;

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

    let dayText = 'TODAY';

    if (
      differenceInCalendarDays(
        uiData.boxscore.startTimeUtc,
        new Date(),
        uiData.timezone,
      ) > 0
    ) {
      dayText = formatDate(uiData.boxscore.startTimeUtc, 'EEE');
    }

    this.day = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, dayText, smallFont),
      TEXT_OFFSET,
      smallFont,
      dayText,
    );

    const time = formatInTimeZone(
      uiData.boxscore.startTimeUtc,
      uiData.timezone,
      'h:mma',
    );

    this.time = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, time, smallFont),
      smallFont.height() + TEXT_OFFSET,
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
