import { z } from 'zod';

export enum GameType {
  PRESEASON = 1,
  REGULAR = 2,
  POSTSEASON = 3,
}

const gameTeamSchema = z.object({
  abbrev: z.string(),
});

const scheduledGameSchema = z.object({
  id: z.number(),
  gameType: z.enum(GameType),
  gameDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTimeUTC: z.string(),
  gameState: z.enum(['FUT', 'PRE', 'LIVE', 'CRIT', 'FINAL', 'OFF']),
  awayTeam: gameTeamSchema,
  homeTeam: gameTeamSchema,
});

export const scheduleResponseSchema = z.object({
  games: z.array(scheduledGameSchema),
});

export type ScheduledGame = z.infer<typeof scheduledGameSchema>;

export type ScheduleResponse = z.infer<typeof scheduleResponseSchema>;
