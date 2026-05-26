import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const numericEnv = z
  .string()
  .optional()
  .transform((value) => (value ? Number(value) : 0))
  .pipe(z.number().min(0));

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.string().transform(Number).default('3000'),
  AI_PROVIDER: z.enum(['mock', 'openai-compatible']).default('mock'),
  AI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  AI_API_KEY: z.string().min(1).optional(),
  AI_MODEL: z.string().min(1).default('gpt-4o-mini'),
  AI_INPUT_COST_PER_1M_TOKENS: numericEnv,
  AI_OUTPUT_COST_PER_1M_TOKENS: numericEnv,
  AI_COST_PER_COMPLEXITY_POINT: numericEnv,
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
