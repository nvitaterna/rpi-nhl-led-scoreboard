import sharp from 'sharp';

const LOGO_HEIGHT = 32;

export const processSvg = async (svg: string, out: string) => {
  await sharp(Buffer.from(svg), { density: 300 })
    .trim()
    .resize(LOGO_HEIGHT - 2, LOGO_HEIGHT - 2, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.cubic,
    })
    .extend({
      top: 1,
      bottom: 1,
      left: 1,
      right: 1,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(out);
};
