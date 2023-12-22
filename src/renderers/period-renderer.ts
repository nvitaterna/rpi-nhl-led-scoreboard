import { Renderer } from './renderer';
import { getFont } from '../fonts/fonts';
import { PeriodDescriptor } from '../nhl-api/types/score-response';

const PERIOD_FONT = getFont('small');

const FONT_WIDTH = PERIOD_FONT.width;
const FONT_HEIGHT = PERIOD_FONT.height;

export class PeriodRenderer extends Renderer {
  private period: PeriodDescriptor = {
    number: 1,
    periodType: 'REG',
  };

  boundingBox = {
    x0: this.matrix.width() / 2 - (FONT_WIDTH * 3) / 2,
    y0: 0,
    x1: this.matrix.width() / 2 - (FONT_WIDTH * 3) / 2 + FONT_WIDTH * 3 - 1,
    y1: FONT_HEIGHT - 1,
  };

  setPeriod(period: PeriodDescriptor) {
    this.period = period;
  }

  public update() {
    // clear the period area
    this.matrix.clear(
      this.boundingBox.x0,
      this.boundingBox.y0,
      this.boundingBox.x1,
      this.boundingBox.y1,
    );

    let period = `${this.period.number}ST`;
    if (this.period.number === 2) {
      period = `${this.period.number}ND`;
    } else if (this.period.number === 3) {
      period = `${this.period}RD`;
    } else if (this.period.periodType === 'SO') {
      period = 'SO';
    } else if (this.period.number >= 4) {
      period = `${this.period.periodType}${this.period.number - 3}`;
    }

    // draw the period
    // center based on string length
    this.matrix
      .fgColor(0xffffff)
      .font(PERIOD_FONT.font)
      .drawText(
        period,
        this.boundingBox.x0 + (FONT_WIDTH * 3 - FONT_WIDTH * period.length) / 2,
        this.boundingBox.y0,
      );
  }
}
