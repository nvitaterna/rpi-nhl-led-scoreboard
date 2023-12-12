import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { Renderer } from './renderer';
import { LOGO_SIZE } from '../logo/constants';

const LOGO_OFFSET = 12;

export class LogoRenderer extends Renderer {
  constructor(
    protected matrix: LedMatrixInstance,
    private logo: Buffer,
    private home = true,
  ) {
    super(matrix);
  }

  public update(): void {
    const offset = this.home ? LOGO_SIZE + LOGO_OFFSET : -LOGO_OFFSET;
    this.matrix.clear(
      this.home ? offset : 0,
      0,
      this.home ? this.matrix.width() : offset + LOGO_SIZE,
      this.matrix.height(),
    );
    this.matrix.drawBuffer(this.logo, LOGO_SIZE, LOGO_SIZE, offset, 0);
  }
}
