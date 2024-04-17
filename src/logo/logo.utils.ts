import sharp from 'sharp';

export const svgToBuffer = async (svg: string, size: number) => {
  const buffer = await sharp(Buffer.from(svg), { density: 300 })
    .trim()
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.cubic,
    })
    .removeAlpha()
    .raw()
    .toBuffer();

  return buffer;
};
