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
  private amPm: TextRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);
    this.homeLogoRenderer = new LogoRenderer(matrix, uiData.homeTeamLogo, true);

    this.awayLogoRenderer = new LogoRenderer(
      matrix,
      uiData.awayTeamLogo,
      false,
    );

    const dayText = this.getDayText(
      uiData.boxscore.startTimeUtc,
      uiData.timezone,
    );

    this.day = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, dayText, smallFont),
      TEXT_OFFSET,
      smallFont,
      dayText,
    );

    const timeText = this.getTimeText(
      uiData.boxscore.startTimeUtc,
      uiData.timezone,
    );

    this.time = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, timeText, smallFont),
      smallFont.height() + TEXT_OFFSET,
      smallFont,
      timeText,
    );

    const amPmText = formatInTimeZone(
      uiData.boxscore.startTimeUtc,
      uiData.timezone,
      'a',
    );

    this.amPm = new TextRenderer(
      matrix,
      TextRenderer.getCenteredX(matrix, amPmText, smallFont),
      smallFont.height() * 2 + TEXT_OFFSET,
      smallFont,
      amPmText,
    );
  }

  private getDayText(startTimeUtc: number, timezone: string) {
    let dayText = 'TODAY';

    if (differenceInCalendarDays(startTimeUtc, new Date(), timezone) > 0) {
      dayText = formatDate(startTimeUtc, 'EEE');
    }

    return dayText;
  }

  private getTimeText(startTimeUtc: number, timezone: string) {
    return formatInTimeZone(startTimeUtc, timezone, 'h:mm');
  }

  update(uiData: UiData) {
    this.awayLogoRenderer.updateLogo(uiData.awayTeamLogo);
    this.homeLogoRenderer.updateLogo(uiData.homeTeamLogo);

    const dayText = this.getDayText(
      uiData.boxscore.startTimeUtc,
      uiData.timezone,
    );
    this.day.updateText(
      dayText,
      TextRenderer.getCenteredX(this.matrix, dayText, smallFont),
    );

    const timeText = this.getTimeText(
      uiData.boxscore.startTimeUtc,
      uiData.timezone,
    );
    this.time.updateText(
      timeText,
      TextRenderer.getCenteredX(this.matrix, timeText, smallFont),
    );

    const amPmText = formatInTimeZone(
      uiData.boxscore.startTimeUtc,
      uiData.timezone,
      'a',
    );

    this.amPm.updateText(
      amPmText,
      TextRenderer.getCenteredX(this.matrix, amPmText, smallFont),
    );
  }

  render() {
    this.matrix.clear();
    this.awayLogoRenderer.render();
    this.homeLogoRenderer.render();
    this.day.render();
    this.time.render();
    this.amPm.render();
  }
}
