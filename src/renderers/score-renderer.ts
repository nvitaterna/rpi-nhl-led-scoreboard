import { Renderer } from './renderer';
import { getFont } from '../fonts/fonts';

const SCORE_FONT = getFont('score')!;

const FONT_WIDTH = SCORE_FONT.width;
const FONT_HEIGHT = SCORE_FONT.height;
const FONT_KERNING = 6;
const Y_OFFSET = 4;

export class ScoreRenderer extends Renderer {
  private homeScore: number = 0;

  private awayScore: number = 0;

  boundingBox = {
    x0: this.matrix.width() / 2 - (FONT_WIDTH * 2 + FONT_KERNING) / 2,
    y0: Math.floor(this.matrix.height() / 2 - FONT_HEIGHT / 2) + Y_OFFSET,
    x1:
      this.matrix.width() / 2 -
      (FONT_WIDTH * 2 + FONT_KERNING) / 2 +
      FONT_WIDTH * 2 +
      FONT_KERNING -
      1,
    y1:
      Math.floor(this.matrix.height() / 2 - FONT_HEIGHT / 2) +
      Y_OFFSET +
      FONT_HEIGHT -
      1,
  };

  setHome(score: number) {
    this.homeScore = score;
  }

  setAway(score: number) {
    this.awayScore = score;
  }

  update() {
    // clear the score area
    this.matrix.clear(
      this.boundingBox.x0,
      this.boundingBox.y0,
      this.boundingBox.x1,
      this.boundingBox.y1,
    );

    const score = `${this.awayScore}${this.homeScore}`;

    // draw the score
    this.matrix
      .fgColor(0xffffff)
      .font(SCORE_FONT.font)
      .drawText(score, this.boundingBox.x0, this.boundingBox.y0, FONT_KERNING);

    // draw the middle line
    this.matrix
      .fgColor(0xffffff)
      .drawLine(
        this.boundingBox.x0 + FONT_WIDTH + 1,
        Math.floor(this.boundingBox.y0 + FONT_HEIGHT / 2),
        this.boundingBox.x0 + FONT_WIDTH + 3,
        Math.floor(this.boundingBox.y0 + FONT_HEIGHT / 2),
      );
  }
}
