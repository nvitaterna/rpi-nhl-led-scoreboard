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
