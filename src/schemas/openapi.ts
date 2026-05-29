import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { estimateRequestSchema } from '../models/EstimateRequest';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Reusable schemas
const TokenRangeSchema = registry.register(
  'TokenRange',
  z.object({
    min: z.number().int().openapi({ example: 100000 }),
    max: z.number().int().openapi({ example: 300000 }),
  })
);

const UserStorySchema = registry.register(
  'UserStory',
  z.object({
    id: z.string().openapi({ example: 'story-1' }),
    title: z.string().openapi({ example: 'Autenticação de Usuário' }),
    description: z.string().openapi({ example: 'Como usuário, quero me autenticar...' }),
    acceptanceCriteria: z.array(z.string()).openapi({ example: ['Validar email', 'Validar senha'] }),
    complexityPoints: z.number().int().openapi({ example: 5 }),
    estimatedTokens: z.object({
      input: TokenRangeSchema,
      output: TokenRangeSchema,
    }),
  })
);

const EpicSchema = registry.register(
  'Epic',
  z.object({
    id: z.string().openapi({ example: 'epic-1' }),
    title: z.string().openapi({ example: 'Gestão de Acesso' }),
    description: z.string().openapi({ example: 'Módulo responsável por segurança e perfis.' }),
    stories: z.array(UserStorySchema),
  })
);

const BacklogResultSchema = registry.register(
  'BacklogResult',
  z.object({
    vision: z.string().openapi({ example: 'Plataforma para estimativas rápidas...' }),
    epics: z.array(EpicSchema),
    totalComplexityPoints: z.number().int().openapi({ example: 21 }),
    estimatedHours: z.object({
      min: z.number().openapi({ example: 40 }),
      max: z.number().openapi({ example: 80 }),
    }),
    aiTokenEstimate: z.object({
      planningAndContextTokens: TokenRangeSchema,
      validationAndFixInputTokens: TokenRangeSchema,
      validationAndFixOutputTokens: TokenRangeSchema,
    }),
    aiCodeGenerationEstimate: z.object({
        assumptions: z.object({
            workflow: z.string(),
            includes: z.array(z.string()),
            excludes: z.array(z.string())
        }),
        tokenEstimate: z.any(),
        costEstimate: z.any(),
        display: z.any()
    })
  })
);

// Register Request
registry.registerPath({
  method: 'post',
  path: '/api/estimates',
  summary: 'Gera uma nova estimativa de MVP',
  request: {
    body: {
      content: {
        'application/json': {
          schema: estimateRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Estimativa gerada com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            data: BacklogResultSchema,
          }),
        },
      },
    },
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'MVP Estimator V2 API',
      description: 'API para geração de backlogs e estimativas de custos assistidas por IA.',
    },
    servers: [{ url: '/api' }],
  });
}
