import 'dotenv/config';
import { z } from 'zod';

const configEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
});

export class ConfigService {
  private readonly env: z.infer<typeof configEnvSchema>;

  constructor() {
    // validate the environment variables
    const env = process.env;

    this.env = configEnvSchema.parse(env);
  }

  get appConfig() {
    return {
      env: this.env.NODE_ENV,
      port: this.env.PORT,
      logLevel: this.env.LOG_LEVEL,
    };
  }
}
