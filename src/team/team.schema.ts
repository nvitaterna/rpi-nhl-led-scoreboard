import { z } from 'zod';

export const teamSchema = z.object({
  abbrev: z.string(),
  name: z.string(),
  logoUrl: z.string(),
});

export type TeamData = z.infer<typeof teamSchema>;
