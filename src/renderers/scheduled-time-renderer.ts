import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from './renderer';
import { getFont } from '../fonts/fonts';
const TIME_FONT = getFont('small');

const FONT_WIDTH = TIME_FONT.width;
const FONT_HEIGHT = TIME_FONT.height;

const Y_OFFSET = 7 + 5;

export class ScheduledTimeRenderer extends Renderer {
  boundingBox = {
    x0: this.matrix.width() / 2 - (3 + FONT_WIDTH * 4) / 2 + 1,
    y0: Y_OFFSET,
    x1: this.matrix.width() / 2 - (FONT_WIDTH * 4) / 2 + FONT_WIDTH * 4,
    y1: (FONT_HEIGHT - 1) * 2 + Y_OFFSET,
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

    // draw the hour in 12 hour format without leading zero
    const hours = this.gameDate.getHours() % 12 || 12;
    const minutes = this.gameDate.getMinutes().toString().padStart(2, '0');
    const amPm = this.gameDate.getHours() < 12 ? 'AM' : 'PM';

    const time = `${hours}:${minutes}`;

    // update bounding box based on string width and center
    const timeWidth = time.length * FONT_WIDTH;
    this.boundingBox.x0 = this.matrix.width() / 2 - timeWidth / 2;
    this.boundingBox.x1 = this.boundingBox.x0 + timeWidth;

    // draw the time
    this.matrix
      .font(TIME_FONT.font)
      .drawText(time, this.boundingBox.x0, this.boundingBox.y0);

    // draw the am/pm below the time, centered
    const amPmWidth = amPm.length * FONT_WIDTH;
    this.matrix
      .font(TIME_FONT.font)
      .drawText(
        amPm,
        this.matrix.width() / 2 - amPmWidth / 2,
        this.boundingBox.y0 + FONT_HEIGHT + 1,
      );
  }
}
