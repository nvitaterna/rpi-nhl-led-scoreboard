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
  LED_ROWS: z.coerce
    .number()
    .pipe(z.union([z.literal(16), z.literal(32), z.literal(64)])),
  LED_COLS: z.coerce
    .number()
    .pipe(z.union([z.literal(16), z.literal(32), z.literal(64)])),
  PWM: z.enum(['true', 'false']).transform((value) => value === 'true'),
  BOOTSTRAP: z.enum(['true', 'false']).transform((value) => value === 'true'),
  GPIO_SLOWDOWN: z.coerce
    .number()
    .pipe(
      z.union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
      ]),
    ),
});

export class ConfigService {
  private readonly env: z.infer<typeof configEnvSchema>;

  constructor() {
    this.env = configEnvSchema.parse(process.env);
  }

  get appConfig() {
    return {
      env: this.env.NODE_ENV,
      port: this.env.PORT,
      logLevel: this.env.LOG_LEVEL,
      bootstrap: this.env.BOOTSTRAP,
    };
  }

  get matrixConfig() {
    return {
      rows: this.env.LED_ROWS,
      cols: this.env.LED_COLS,
      pwm: this.env.PWM,
      gpioSlowdown: this.env.GPIO_SLOWDOWN,
    };
  }
}
