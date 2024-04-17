import { z } from 'zod';

export const logoSchema = z.object({
  team: z.string(),
  logo: z.instanceof(Buffer),
});

export type LogoData = z.infer<typeof logoSchema>;
