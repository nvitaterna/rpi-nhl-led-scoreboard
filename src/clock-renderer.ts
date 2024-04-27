import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from './renderer';
import { UiData } from './ui-data/ui-data.schema';
import { TextRenderer } from './text.renderer';
import { smallFont } from './font/fonts';

const PERIOD_SUFFIXES = ['ST', 'ND', 'RD'];

export class ClockRenderer extends Renderer {
  private periodRenderer: TextRenderer;

  private timeRenderer: TextRenderer;

  constructor(matrix: LedMatrixInstance, uiData: UiData) {
    super(matrix);

    // render period
    const period = uiData.boxscore.period || 1;
    const periodType = uiData.boxscore.periodType || 'REGULAR';

    let periodText = `${period}${PERIOD_SUFFIXES[period - 1]}`;

    if (periodType === 'OVERTIME') {
      periodText = `OT${period}`;
    } else if (periodType === 'SHOOTOUT') {
      periodText = 'SO';
    }

    const minutes = (uiData.boxscore.minutes || 20).toString();
    const seconds = (uiData.boxscore.seconds || 0).toString().padStart(2, '0');

    const timeText = `${minutes}:${seconds}`;

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
      0,
      smallFont,
      periodText,
    );

    this.timeRenderer = new TextRenderer(
      this.matrix,
      timeCenterX,
      6,
      smallFont,
      timeText,
    );
  }

  render() {
    this.periodRenderer.render();
    this.timeRenderer.render();
  }
}
