import { z } from 'zod';

import { periodTypeSchema } from '../nhl-api.schemas.js';

export const boxscoreTeamSchema = z.object({
  score: z.number().optional(),
});

export const periodDescriptorSchema = z.object({
  number: z.number(),
  periodType: periodTypeSchema,
});

export const clockSchema = z.object({
  timeRemaining: z.string(),
  secondsRemaining: z.number(),
  running: z.boolean(),
  inIntermission: z.boolean(),
});

export const gameOutcomeSchema = z.object({
  lastPeriodType: periodTypeSchema,
});

export const boxscoreResponseSchema = z.object({
  id: z.number(),
  periodDescriptor: periodDescriptorSchema.optional(),
  awayTeam: boxscoreTeamSchema,
  homeTeam: boxscoreTeamSchema,
  clock: clockSchema,
  gameOutcome: gameOutcomeSchema.optional(),
});

export type BoxscoreResponse = z.infer<typeof boxscoreResponseSchema>;
