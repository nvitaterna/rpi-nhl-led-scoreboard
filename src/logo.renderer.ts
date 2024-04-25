import { LedMatrixInstance } from '@nvitaterna/rpi-led-matrix';
import { LOGO_SIZE } from './logo/logo.service';

const LOGO_OFFSET = 12;

export class LogoRenderer {
  constructor(
    private matrix: LedMatrixInstance,
    private logo: Buffer,
    private home: boolean,
  ) {}

  render() {
    const offset = this.home ? LOGO_SIZE + LOGO_OFFSET : -LOGO_OFFSET;

    this.matrix.drawBuffer(this.logo, LOGO_SIZE, LOGO_SIZE, offset, 0);
  }
}
