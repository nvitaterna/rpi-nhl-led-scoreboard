import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from './renderer';
import { getFont } from '../fonts/fonts';
const TIME_FONT = getFont('small');

const FONT_WIDTH = TIME_FONT.width;
const FONT_HEIGHT = TIME_FONT.height;

const Y_OFFSET = 7 + 4;

export class ScheduledTimeRenderer extends Renderer {
  boundingBox = {
    x0: this.matrix.width() / 2 - (3 + FONT_WIDTH * 4) / 2 + 1,
    y0: Y_OFFSET,
    x1: this.matrix.width() / 2 - (FONT_WIDTH * 4) / 2 + FONT_WIDTH * 4,
    y1: FONT_HEIGHT - 1 + Y_OFFSET,
  };

  constructor(
    protected matrix: LedMatrixInstance,
    private gameDate: Date,
  ) {
    super(matrix);
  }

  public update() {
    // clear the time area
    this.matrix.clear(
      this.boundingBox.x0,
      this.boundingBox.y0,
      this.boundingBox.x1,
      this.boundingBox.y1,
    );

    // draw the hour
    this.matrix
      .font(TIME_FONT.font)
      .drawText(
        this.gameDate.getHours().toString().padStart(2, '0'),
        this.boundingBox.x0,
        this.boundingBox.y0,
      );

    // draw the minutes
    this.matrix
      .font(TIME_FONT.font)
      .drawText(
        this.gameDate.getMinutes().toString().padStart(2, '0'),
        this.boundingBox.x0 + FONT_WIDTH * 2 + 2,
        this.boundingBox.y0,
      );

    // draw the colon
    this.matrix
      .fgColor(0xffffff)
      .setPixel(this.boundingBox.x0 + FONT_WIDTH * 2, this.boundingBox.y0 + 1)
      .setPixel(this.boundingBox.x0 + FONT_WIDTH * 2, this.boundingBox.y0 + 3);
  }
}
