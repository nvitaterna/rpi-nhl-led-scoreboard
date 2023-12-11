import { Renderer } from './renderer';
import { getFont } from '../fonts/fonts';

const PERIOD_FONT = getFont('small');

const FONT_WIDTH = PERIOD_FONT.width;
const FONT_HEIGHT = PERIOD_FONT.height;

export class PeriodRenderer extends Renderer {
  private period = 1;

  boundingBox = {
    x0: this.matrix.width() / 2 - (FONT_WIDTH * 3) / 2,
    y0: 0,
    x1: this.matrix.width() / 2 - (FONT_WIDTH * 3) / 2 + FONT_WIDTH * 3 - 1,
    y1: FONT_HEIGHT - 1,
  };

  setPeriod(period: number) {
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

    let period = `${this.period}ST`;
    if (this.period === 2) {
      period = `${this.period}ND`;
    } else if (this.period === 3) {
      period = `${this.period}RD`;
    }

    // draw the period
    this.matrix
      .fgColor({
        r: 235,
        g: 235,
        b: 235,
      })
      .font(PERIOD_FONT.font)
      .drawText(period, this.boundingBox.x0, this.boundingBox.y0);
  }
}
