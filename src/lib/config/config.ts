import { z } from 'zod';

const configSchema = z.object({
  TEAM: z.string().length(3),
  TIMEZONE: z.string(),
  PORT: z.coerce.number().default(3000),
});

const parsedConfig = configSchema.safeParse({
  TEAM: process.env.TEAM,
  TIMEZONE: process.env.TIMEZONE || 'America/New_York',
  PORT: process.env.PORT,
});

if (!parsedConfig.success) {
  console.error('Invalid configuration:', z.flattenError(parsedConfig.error));
  process.exit(1);
}

export const config = {
  team: parsedConfig.data.TEAM,
  timezone: parsedConfig.data.TIMEZONE,
  port: parsedConfig.data.PORT,
};

export type Config = typeof config;
