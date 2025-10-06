import { z } from 'zod';

import { localizedStringSchema } from '../nhl-api.schemas.js';

export const standingsEntrySchema = z.object({
  conferenceName: z.enum(['Western', 'Eastern']),
  divisionName: z.enum(['Central', 'Pacific', 'Atlantic', 'Metropolitan']),
  placeName: localizedStringSchema,
  teamName: localizedStringSchema,
  teamCommonName: localizedStringSchema,
  teamAbbrev: localizedStringSchema,
  teamLogo: z.url(),
  wins: z.number(),
  losses: z.number(),
  otLosses: z.number(),
  points: z.number(),
});

export const standingsResponeSchema = z.object({
  standings: z.array(standingsEntrySchema),
});

export type StandingsEntry = z.infer<typeof standingsEntrySchema>;

export type StandingsResponse = z.infer<typeof standingsResponeSchema>;
