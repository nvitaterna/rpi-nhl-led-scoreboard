import { z } from 'zod';
import 'dotenv/config';

const configSchema = z.object({
  BRIGHTNESS: z.number().int().min(0).max(100),
  FAVORITE_TEAM: z.string().length(3),
  TZ: z.string(),
});

const validatedConfig = configSchema.parse(process.env);

export const config = {
  matrix: {
    brightness: validatedConfig.BRIGHTNESS,
  },
  favoriteTeam: validatedConfig.FAVORITE_TEAM,
};
