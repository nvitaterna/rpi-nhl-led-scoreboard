import { z } from 'zod';

export const gameSchema = z.object({
  id: z.number(),
  startTimeUtc: z.number(),
  awayTeam: z.string(),
  homeTeam: z.string(),
  type: z.enum(['PRESEASON', 'REGULAR', 'PLAYOFF']),
});

export type GameData = z.infer<typeof gameSchema>;

export type GameType = GameData['type'];
