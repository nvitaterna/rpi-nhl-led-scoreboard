import { LayoutUtils, LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from './renderer';
import { FontInstance } from '@nvitaterna/rpi-led-matrix/dist/types';

export class TextRenderer extends Renderer {
  constructor(
    matrix: LedMatrixInstance,
    x: number,
    y: number,
    private font: FontInstance,
    private text: string,
  ) {
    super(matrix, x, y);
  }

  render() {
    this.matrix
      .fgColor(0xffffff)
      .font(this.font)
      .drawText(this.text, this.x, this.y);
  }

  // function to center text horizontally
  static getCenteredX(
    matrix: LedMatrixInstance,
    text: string,
    font: FontInstance,
  ) {
    const lines = LayoutUtils.textToLines(font, matrix.width(), text);

    const glyphs = LayoutUtils.linesToMappedGlyphs(
      lines,
      font.height(),
      matrix.width(),
      matrix.height(),
    );

    return glyphs[0].x;
  }
}
