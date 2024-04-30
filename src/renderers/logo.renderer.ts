import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { LOGO_SIZE } from '@/logo/logo.service';
import { Renderer } from '@/renderers/renderer';

const LOGO_OFFSET = 13;

export class LogoRenderer extends Renderer {
  constructor(
    matrix: LedMatrixInstance,
    private logo: Buffer,
    private home: boolean,
  ) {
    super(matrix);
  }

  updateLogo(logo: Buffer) {
    this.logo = logo;
  }

  render() {
    const offset = this.home ? LOGO_SIZE + LOGO_OFFSET : -LOGO_OFFSET;

    this.matrix.drawBuffer(this.logo, LOGO_SIZE, LOGO_SIZE, offset, 0);
  }
}
