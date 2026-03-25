import { z } from 'zod';

import {
  boxscoreResponseSchema,
  periodDescriptorSchema,
} from '../boxscore/boxscore.schemas.js';
import { localizedStringSchema } from '../nhl-api.schemas.js';

export const playByPlayEventTypeSchema = z.enum([
  'blocked-shot',
  'delayed-penalty',
  'faceoff',
  'game-end',
  'giveaway',
  'goal',
  'hit',
  'missed-shot',
  'penalty',
  'period-end',
  'period-start',
  'shootout-complete',
  'shot-on-goal',
  'stoppage',
  'takeaway',
]);

export const goalDetailsSchema = z.object({
  scoringPlayerId: z.number(),
});

export const penaltyDetailsSchema = z.object({
  committedByPlayerId: z.number(),
});

const rawPlayByPlayEventSchema = z.object({
  eventId: z.number(),
  sortOrder: z.number(),
  periodDescriptor: periodDescriptorSchema,
  timeRemaining: z.string().regex(/^\d{2}:\d{2}$/),
  typeDescKey: playByPlayEventTypeSchema,
});

export const goalEventSchema = rawPlayByPlayEventSchema.extend({
  typeDescKey: z.literal('goal'),
  details: goalDetailsSchema,
});

export const penaltyEventSchema = rawPlayByPlayEventSchema.extend({
  typeDescKey: z.literal('penalty'),
  details: penaltyDetailsSchema,
});

export const playByPlayEventSchema = z.union([
  rawPlayByPlayEventSchema,
  goalEventSchema,
  penaltyEventSchema,
]);

export const playerSchema = z.object({
  teamId: z.number(),
  sweaterNumber: z.number(),
  firstName: localizedStringSchema,
  lastName: localizedStringSchema,
});

export const playByPlayTeamSchema = z.object({
  id: z.number(),
  abbrev: z.string(),
  score: z.number().optional(),
});

export const playByPlayResponseSchema = boxscoreResponseSchema.extend({
  plays: z.array(playByPlayEventSchema),
  rosterSpots: z.array(playerSchema),
});

export type PlayByPlayEventType = z.infer<typeof playByPlayEventTypeSchema>;

export type PlayByPlayEvent = z.infer<typeof playByPlayEventSchema>;

export type PlayByPlayPlayer = z.infer<typeof playerSchema>;

export type PlayByPlayTeam = z.infer<typeof playByPlayTeamSchema>;

export type PlayByPlayResponse = z.infer<typeof playByPlayResponseSchema>;
