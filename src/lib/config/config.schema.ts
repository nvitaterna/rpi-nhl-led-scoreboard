import { z } from 'zod';

export const configSchema = z.object({
  TEAM: z.string().length(3),
  TIMEZONE: z.string(),
});
