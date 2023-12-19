import { getFont } from '../fonts/fonts';
import { Renderer } from './renderer';

const TIME_FONT = getFont('small');

const FONT_WIDTH = TIME_FONT.width;
const FONT_HEIGHT = TIME_FONT.height;

const Y_OFFSET = 6;

export class TimeRenderer extends Renderer {
  private minutes = 20;
  private seconds = 0;

  boundingBox = {
    x0: this.matrix.width() / 2 - (3 + FONT_WIDTH * 4) / 2 + 1,
    y0: Y_OFFSET,
    x1: this.matrix.width() / 2 - (FONT_WIDTH * 4) / 2 + FONT_WIDTH * 4,
    y1: FONT_HEIGHT - 1 + Y_OFFSET,
  };

  setTime(time: string) {
    const [minutes, seconds] = time.split(':');
    this.minutes = parseInt(minutes);
    this.seconds = parseInt(seconds);
  }

  public update() {
    // clear the time area
    this.matrix.clear(
      this.boundingBox.x0,
      this.boundingBox.y0,
      this.boundingBox.x1,
      this.boundingBox.y1,
    );

    // draw the miuntes
    this.matrix
      .font(TIME_FONT.font)
      .drawText(
        this.minutes.toString().padStart(2, '0'),
        this.boundingBox.x0,
        this.boundingBox.y0,
      );

    // draw the seconds
    this.matrix
      .font(TIME_FONT.font)
      .drawText(
        this.seconds.toString().padStart(2, '0'),
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
