import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from '@/renderers/renderer';
import { UiData } from '@/ui-data/ui-data.schema';
import { TextRenderer } from '@/renderers/text.renderer';
import { smallFont } from '@/font/fonts';
import { PeriodType } from '@/boxscore/boxscore.schema';

const PERIOD_SUFFIXES = ['ST', 'ND', 'RD'];
const CLOCK_OFFSET = 2;

export class ClockRenderer extends Renderer {
  private periodRenderer: TextRenderer;

  private timeRenderer: TextRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);

    const periodText = this.getPeriodText(
      uiData.boxscore.period ?? 1,
      uiData.boxscore.periodType ?? 'REGULAR',
    );

    const timeText = this.getTimeText(
      uiData.boxscore.minutes ?? 20,
      uiData.boxscore.seconds ?? 0,
    );

    const periodCenterX = TextRenderer.getCenteredX(
      this.matrix,
      periodText,
      smallFont,
    );

    const timeCenterX = TextRenderer.getCenteredX(
      this.matrix,
      timeText,
      smallFont,
    );

    this.periodRenderer = new TextRenderer(
      this.matrix,
      periodCenterX,
      0 + CLOCK_OFFSET,
      smallFont,
      periodText,
    );

    this.timeRenderer = new TextRenderer(
      this.matrix,
      timeCenterX,
      6 + CLOCK_OFFSET,
      smallFont,
      timeText,
    );
  }

  private getPeriodText(period: number, periodType: PeriodType) {
    let periodText = `${period}${PERIOD_SUFFIXES[period - 1]}`;

    if (periodType === 'OVERTIME') {
      periodText = `OT${period}`;
    } else if (periodType === 'SHOOTOUT') {
      periodText = 'SO';
    }

    return periodText;
  }

  private getTimeText(minutes: number, seconds: number) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  update(uiData: UiData) {
    const periodText = this.getPeriodText(
      uiData.boxscore.period ?? 1,
      uiData.boxscore.periodType ?? 'REGULAR',
    );
    this.periodRenderer.updateText(
      periodText,
      TextRenderer.getCenteredX(this.matrix, periodText, smallFont),
    );

    const timeText = this.getTimeText(
      uiData.boxscore.minutes ?? 20,
      uiData.boxscore.seconds ?? 0,
    );

    this.timeRenderer.updateText(
      timeText,
      TextRenderer.getCenteredX(this.matrix, timeText, smallFont),
    );
  }

  render() {
    this.periodRenderer.render();
    this.timeRenderer.render();
  }
}
