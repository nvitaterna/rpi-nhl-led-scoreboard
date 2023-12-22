import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from './renderer';
import { getFont } from '../fonts/fonts';
import { PeriodDescriptor } from '../nhl-api/types/score-response';

const GAME_STATE_FONT = getFont('small');

const FONT_WIDTH = GAME_STATE_FONT.width;
const FONT_HEIGHT = GAME_STATE_FONT.height;

export class GameStateRenderer extends Renderer {
  // top of screen, 2 rows of text with 1px padding
  // centered in screen, with a 5 character width
  boundingBox = {
    x0: this.matrix.width() / 2 - (FONT_WIDTH * 5) / 2,
    y0: 0,
    x1: this.matrix.width() / 2 - (FONT_WIDTH * 5) / 2 + FONT_WIDTH * 5 - 1,
    y1: FONT_HEIGHT * 2 + 1,
  };

  constructor(
    protected matrix: LedMatrixInstance,
    private period: PeriodDescriptor,
  ) {
    super(matrix);
  }

  public update() {
    this.matrix.clear(
      this.boundingBox.x0,
      this.boundingBox.y0,
      this.boundingBox.x1,
      this.boundingBox.y1,
    );

    let period: string = this.period.periodType;

    if (this.period.periodType === 'OT') {
      period = `${this.period.periodType}${this.period.number}`;
    }

    // draw "FINAL" text
    this.matrix
      .fgColor(0xffffff)
      .font(GAME_STATE_FONT.font)
      .drawText('FINAL', this.boundingBox.x0, this.boundingBox.y0);

    // draw the period text below
    // centered based on period string length
    this.matrix
      .fgColor(0xffffff)
      .font(GAME_STATE_FONT.font)
      .drawText(
        period,
        this.boundingBox.x0 + (FONT_WIDTH * 5 - FONT_WIDTH * period.length) / 2,
        this.boundingBox.y1 - FONT_HEIGHT - 1,
      );
  }
}
