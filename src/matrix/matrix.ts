import { GpioMapping, LedMatrix } from '@nvitaterna/rpi-led-matrix';
import { ConfigService } from '@/config/config.service';

export const Matrix = (matrixConfig: ConfigService['matrixConfig']) => {
  const hardwareMapping = matrixConfig.pwm
    ? GpioMapping.AdafruitHatPwm
    : GpioMapping.AdafruitHat;

  const matrix = new LedMatrix(
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

  return matrix;
};
