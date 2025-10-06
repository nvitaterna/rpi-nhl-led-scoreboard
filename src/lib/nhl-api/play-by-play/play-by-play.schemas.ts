import { z } from 'zod';

import {
  boxscoreResponseSchema,
  periodDescriptorSchema,
} from '../boxscore/boxscore.schemas.js';
import { localizedStringSchema } from '../nhl-api.schemas.js';

export const playByPlayEventTypeSchema = z.enum([
  'period-start',
  'period-end',
  'faceoff', // this means the clock starts running
  'stoppage',
  'game-end',
]);

export const goalDetailsSchema = z.object({
  scoringPlayerId: z.number(),
});

export const penaltyDetailsSchema = z.object({
  committedByPlayerId: z.number(),
});

const rawPlayByPlayEventSchema = z.object({
  eventId: z.number(), // don't think we actually need this
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

export type PlayByPlayEvent = z.infer<typeof playByPlayEventSchema>;

export const playByPlayResponseSchema = boxscoreResponseSchema.extend({
  plays: z.array(playByPlayEventSchema),
  rosterSpots: z.array(playerSchema),
});

export type PlayByPlayResponse = z.infer<typeof playByPlayResponseSchema>;
