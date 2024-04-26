import path from 'path';
import { Font } from '@nvitaterna/rpi-led-matrix';

const FONT_BASE_DIR = path.join(__dirname, '../../assets/fonts');

export const smallFont = new Font('4x6', path.join(FONT_BASE_DIR, '4x6.bdf'));

export const scoreFont = new Font(
  'sonic-advance-2',
  path.join(FONT_BASE_DIR, 'sonic-advance-2.bdf'),
);
