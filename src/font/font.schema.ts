import { Font } from '@nvitaterna/rpi-led-matrix';
import { z } from 'zod';

export const fontSchema = z.object({
  width: z.number(),
  height: z.number(),
  name: z.enum(['small', 'small-2', 'score']),
  font: z.instanceof(Font),
});

export type FontData = z.infer<typeof fontSchema>;

export type FontName = FontData['name'];
