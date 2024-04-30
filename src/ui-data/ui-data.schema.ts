import { boxscoreSchema } from '@/boxscore/boxscore.schema';
import { brightnessSchema } from '@/prefs/prefs.schema';
import { z } from 'zod';

export const uiSchema = z.object({
  boxscore: boxscoreSchema,
  homeTeamLogo: z.instanceof(Buffer),
  awayTeamLogo: z.instanceof(Buffer),
  timezone: z.string(),
  brightness: brightnessSchema,
});

export type UiData = z.infer<typeof uiSchema>;
