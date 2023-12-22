import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { getFont } from '../fonts/fonts';
import { Renderer } from './renderer';

const DATE_FONT = getFont('small');

const FONT_WIDTH = DATE_FONT.width;
const FONT_HEIGHT = DATE_FONT.height;

const TOP_OFFSET = 4;

export class DateRenderer extends Renderer {
  boundingBox = {
    x0: 0,
    y0: 0 + TOP_OFFSET,
    x1: this.matrix.width() - 1,
    y1: FONT_HEIGHT - 1 + TOP_OFFSET,
  };

  constructor(
    protected matrix: LedMatrixInstance,
    private gameTime: Date,
  ) {
    super(matrix);
  }

  private getDateString() {
    // if gameTime is today, show "Today"
    // if gameTime is in the next 6 days, show "Mon", "Tue", etc.
    // otherwise, show "Dec 18"
    const today = new Date();

    if (this.gameTime.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (this.gameTime.getDay() - today.getDay() < 7) {
      return this.gameTime.toLocaleDateString('en-US', {
        weekday: 'short',
      });
    } else {
      return this.gameTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  }

  public update() {
    // set bounding box based on string width
    this.boundingBox.x0 =
      this.matrix.width() / 2 - (this.getDateString().length * FONT_WIDTH) / 2;
    this.boundingBox.x1 =
      this.boundingBox.x0 + this.getDateString().length * FONT_WIDTH;
    this.matrix.clear(
      this.boundingBox.x0,
      this.boundingBox.y0,
      this.boundingBox.x1,
      this.boundingBox.y1,
    );

    // draw the date in the center of the top of the screen
    // center the text, based on string width
    this.matrix
      .fgColor(0xffffff)
      .font(DATE_FONT.font)
      .drawText(
        this.getDateString(),
        this.matrix.width() / 2 -
          (this.getDateString().length * FONT_WIDTH) / 2,
        0 + TOP_OFFSET,
      );
  }
}
