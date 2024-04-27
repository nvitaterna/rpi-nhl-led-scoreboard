import { z } from 'zod';
import { gameSchema } from '@/game/game.schema';

export const boxscoreSchema = gameSchema.extend({
  status: z.enum(['LIVE', 'FINAL', 'UPCOMING']).nullable().default(null),
  awayScore: z.number().nullable().default(null),
  homeScore: z.number().nullable().default(null),
  period: z.number().nullable().default(null),
  periodType: z
    .enum(['REGULAR', 'OVERTIME', 'SHOOTOUT'])
    .nullable()
    .default(null),
  minutes: z.number().nullable().default(null),
  seconds: z.number().nullable().default(null),
});

export type BoxscoreData = z.infer<typeof boxscoreSchema>;
export type PeriodType = BoxscoreData['periodType'];
