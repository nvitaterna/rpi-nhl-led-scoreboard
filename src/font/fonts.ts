import path from 'path';
import { FontData, FontName } from './font.schema';
import { Font } from '@nvitaterna/rpi-led-matrix';

const FONT_BASE_DIR = path.join(__dirname, '../../assets/fonts');

const fonts: FontData[] = [
  {
    name: 'small',
    width: 4,
    height: 6,
    font: new Font('4x6', path.join(FONT_BASE_DIR, '4x6.bdf')),
  },
  {
    name: 'small-2',
    width: 5,
    height: 7,
    font: new Font('5x7', path.join(FONT_BASE_DIR, '5x7.bdf')),
  },
  {
    name: 'score',
    width: 4,
    height: 6,
    font: new Font(
      'sonic-advance-2',
      path.join(FONT_BASE_DIR, 'sonic-advance-2.bdf'),
    ),
  },
];

export const getFont = (name: FontName) => {
  return fonts.find((font) => font.name === name)!.font;
};
