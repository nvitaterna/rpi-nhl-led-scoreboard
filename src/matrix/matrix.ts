import {
  GpioMapping,
  LedMatrix,
  LedMatrixInstance,
} from '@nvitaterna/rpi-led-matrix';
import { ConfigService } from '../config/config.service';

export class Matrix {
  private matrix: LedMatrixInstance;

  constructor(configService: ConfigService) {
    const matrixConfig = configService.matrixConfig;

    const hardwareMapping = matrixConfig.pwm
      ? GpioMapping.AdafruitHatPwm
      : GpioMapping.AdafruitHat;

    this.matrix = new LedMatrix(
      {
        ...LedMatrix.defaultMatrixOptions(),
        rows: matrixConfig.rows,
        cols: matrixConfig.cols,
        hardwareMapping,
        rowAddressType: 0,
      },
      {
        ...LedMatrix.defaultRuntimeOptions(),
        gpioSlowdown: 4,
        dropPrivileges: 0,
      },
    );
  }

  sync() {
    this.matrix.sync();
  }

  drawBuffer(buffer: Buffer) {
    this.matrix.drawBuffer(buffer);
  }

  clear(x0: number, y0: number, x1: number, y1: number) {
    this.matrix.clear(x0, y0, x1, y1);
  }
}
