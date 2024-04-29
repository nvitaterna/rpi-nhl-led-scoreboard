import { z } from 'zod';
import timezones from 'timezones-list';

const timezoneCodes = timezones.map((timezone) => timezone.tzCode);

export const timezoneSchema = z.string().refine(
  (value) => {
    return timezoneCodes.includes(value);
  },
  {
    message: 'Invalid timezone',
  },
);

export const teamSchema = z.string().length(3);

export const brightnessSchema = z.number().int().min(0).max(100);

export const prefsSchema = z.object({
  timezone: timezoneSchema,
  team: teamSchema,
  brightness: brightnessSchema,
});

export type PrefsData = z.infer<typeof prefsSchema>;
