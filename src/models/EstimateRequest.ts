import { z } from 'zod';

export const estimateRequestSchema = z.object({
  ideaDescription: z
    .string()
    .min(10, 'A descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'A descrição deve ter no máximo 2000 caracteres'),
  aiPricing: z
    .object({
      inputCostPer1MTokens: z.number().min(0),
      outputCostPer1MTokens: z.number().min(0),
    })
    .optional(),
});

export type EstimateRequest = z.infer<typeof estimateRequestSchema>;
