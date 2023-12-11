import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from './renderer';

const LOGO_WIDTH = 32;

export class LogoRenderer extends Renderer {
  constructor(
    protected matrix: LedMatrixInstance,
    private logo: Buffer,
    private home = true,
  ) {
    super(matrix);
  }

  public update(): void {
    const offset = this.home ? -10 : LOGO_WIDTH + 10;
    this.matrix.clear(
      this.home ? 0 : offset,
      0,
      this.home ? this.matrix.width() : offset + LOGO_WIDTH,
      this.matrix.height(),
    );
    this.matrix.drawBuffer(this.logo, LOGO_WIDTH, LOGO_WIDTH, offset, 0);
  }
}
