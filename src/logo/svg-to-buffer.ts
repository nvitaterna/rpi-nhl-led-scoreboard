import sharp from 'sharp';
import { LOGO_SIZE } from './constants';

export const svgToBuffer = async (svg: string) => {
  const buffer = await sharp(Buffer.from(svg), { density: 300 })
    .trim()
    .resize(LOGO_SIZE, LOGO_SIZE, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.cubic,
    })
    .removeAlpha()
    .raw()
    .toBuffer();

  return buffer;
};
