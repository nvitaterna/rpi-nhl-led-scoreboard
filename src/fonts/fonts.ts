import path from 'path';
import { Font, FontInstance } from '@nvitaterna/rpi-led-matrix';
import { ASSETS_DIR } from '../constants';

type FontName = 'small' | 'small-2' | 'score';

interface RawFont {
  width: number;
  height: number;
  file: string;
  name: FontName;
}

export interface MappedFont {
  width: number;
  height: number;
  file: string;
  name: FontName;
  font: FontInstance;
}

const rawFonts: RawFont[] = [
  {
    width: 4,
    height: 6,
    file: '4x6',
    name: 'small',
  },
  {
    width: 5,
    height: 7,
    file: '5x7',
    name: 'small-2',
  },
  {
    width: 6,
    height: 12,
    file: 'sonic-advance-2',
    name: 'score',
  },
];

export const fonts: MappedFont[] = rawFonts.map((rawFont) => {
  const font = new Font(
    rawFont.file,
    path.join(ASSETS_DIR, `fonts/${rawFont.file}.bdf`),
  );

  return {
    ...rawFont,
    font,
  };
});

export const getFont = (name: FontName) => {
  const font = fonts.find((font) => font.name === name);

  if (!font) {
    throw new Error(`Font ${name} not found`);
  }

  return font;
};
