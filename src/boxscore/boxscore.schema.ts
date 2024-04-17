import { z } from 'zod';
import { gameSchema } from '../game/game.schema';

export const boxscoreSchema = gameSchema.extend({
  status: z.enum(['LIVE', 'FINAL', 'UPCOMING']).nullable(),
  awayScore: z.number().nullable(),
  homeScore: z.number().nullable(),
  period: z.number().nullable(),
  periodType: z.enum(['REGULAR', 'OVERTIME', 'SHOOTOUT']).nullable(),
  minutes: z.number().nullable(),
  seconds: z.number().nullable(),
});

export type BoxscoreData = z.infer<typeof boxscoreSchema>;
