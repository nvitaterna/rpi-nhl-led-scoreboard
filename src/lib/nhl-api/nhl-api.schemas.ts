import { z } from 'zod';

export const localizedStringSchema = z.object({
  default: z.string(),
});

export const periodTypeSchema = z.enum(['REG', 'OT', 'SO']);

export type PeriodType = z.infer<typeof periodTypeSchema>;
