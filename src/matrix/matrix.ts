import { GpioMapping, LedMatrix } from '@nvitaterna/rpi-led-matrix';

const LED_COLS = 64;
const LED_ROWS = 32;

export const matrix = new LedMatrix(
  {
    ...LedMatrix.defaultMatrixOptions(),
    cols: LED_COLS,
    rows: LED_ROWS,
    hardwareMapping: GpioMapping.AdafruitHatPwm,
    rowAddressType: 0,
  },
  {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 4,
    dropPrivileges: 0,
  },
);
