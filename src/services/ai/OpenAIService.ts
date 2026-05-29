import { z } from 'zod';
import { AICodeGenerationPricing, BacklogResult, IAIService, ScenarioType, ScenarioResult } from './IAIService';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { estimateAICodeGeneration } from './AICodeGenerationEstimator';

/**
 * Zod schema for validating and normalizing token ranges received from the LLM.
 * Ensures that min <= max.
 */
function tokenRangeSchema() {
  return z
    .object({
      min: z.coerce.number().int().min(0),
      max: z.coerce.number().int().min(0),
    })
    .transform((range) => {
      // Se a IA inverter min/max, nós corrigimos automaticamente
      return {
        min: Math.min(range.min, range.max),
        max: Math.max(range.min, range.max),
      };
    });
}

/**
 * Zod schema for validating a single architectural scenario.
 */
const scenarioResultSchema = z.object({
  type: z.nativeEnum(ScenarioType),
  vision: z.string(),
  epics: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      stories: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          acceptanceCriteria: z.array(z.string()),
          complexityPoints: z.coerce.number().int().min(1).max(21),
          estimatedTokens: z.object({
            input: tokenRangeSchema(),
            output: tokenRangeSchema(),
          }),
        }),
      ),
    }),
  ),
  totalComplexityPoints: z.coerce.number(),
  estimatedHours: z.object({
    min: z.coerce.number(),
    max: z.coerce.number(),
  }),
  aiTokenEstimate: z.object({
    planningAndContextTokens: tokenRangeSchema(),
    codeGenerationInputTokens: tokenRangeSchema().default({ min: 0, max: 0 }),
    codeGenerationOutputTokens: tokenRangeSchema().default({ min: 0, max: 0 }),
    validationAndFixInputTokens: tokenRangeSchema(),
    validationAndFixOutputTokens: tokenRangeSchema(),
  }),
});

/**
 * Zod schema for validating the full backlog response containing multiple scenarios.
 */
const backlogResultSchema = z.object({
  scenarios: z.array(scenarioResultSchema),
});

/**
 * Schema for standard OpenAI-compatible chat completion responses.
 */
const openAIChatResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string().nullable(),
      }),
    }),
  ),
});

/**
 * Schema for error responses from the OpenAI API.
 */
const openAIErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
  }),
});

/**
 * Schema for generic AI provider errors.
 */
const genericProviderErrorSchema = z.object({
  error: z.string(),
  code: z.string().nullable().optional(),
});

/**
 * Cleans the string content returned by the LLM to ensure it is valid JSON.
 * Removes markdown code blocks and trims whitespace.
 * 
 * @param content - The raw string content from the LLM
 * @returns Cleaned JSON string
 */
function cleanJsonContent(content: string): string {
  let cleaned = content.trim();
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '');
  return cleaned.trim();
}

/**
 * Implementation of IAIService that uses OpenAI-compatible LLMs (e.g., GPT-4, Groq, etc.).
 */
export class OpenAIService implements IAIService {
  /**
   * Generates a project backlog by prompting an LLM and parsing its JSON response.
   * 
   * @param ideaDescription - The natural language description of the project idea
   * @param pricing - Optional pricing configuration for cost calculation
   * @returns A promise resolving to the validated BacklogResult
   * @throws 500 if AI_API_KEY is missing
   * @throws 502 if the provider returns an error or invalid response
   */
  async generateBacklog(
    ideaDescription: string,
    pricing?: AICodeGenerationPricing,
  ): Promise<BacklogResult> {
    if (!env.AI_API_KEY) {
      throw Object.assign(new Error('AI_API_KEY não configurada'), {
        status: 500,
        code: 'AI_CONFIGURATION_ERROR',
      });
    }

    const url = this.chatCompletionsUrl();
    logger.info(`Gerando backlog multi-cenário via LLM (${env.AI_MODEL})...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.AI_MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Você é um especialista sênior em planejamento de MVPs e arquiteto de software. Sua tarefa é analisar a ideia do usuário e retornar um planejamento técnico rigoroso contendo DOIS cenários: LEAN e ENTERPRISE. Siga estritamente o esquema solicitado, sem explicações adicionais.',
          },
          {
            role: 'user',
            content: this.buildPrompt(ideaDescription),
          },
        ],
      }),
    });

    if (!response.ok) {
      const providerError = await this.parseProviderError(response);
      logger.error(`Erro do provedor LLM (${response.status}): ${providerError.logMessage}`);

      throw Object.assign(new Error(providerError.clientMessage), {
        status: 502,
        code: 'AI_PROVIDER_ERROR',
      });
    }

    const payload = openAIChatResponseSchema.parse(await response.json());
    const content = payload.choices[0]?.message.content;

    if (!content) {
      throw Object.assign(new Error('A LLM retornou uma resposta vazia'), {
        status: 502,
        code: 'AI_EMPTY_RESPONSE',
      });
    }

    try {
      const cleanedContent = cleanJsonContent(content);
      const parsedContent = JSON.parse(cleanedContent);
      const validatedBacklog = backlogResultSchema.parse(parsedContent);

      // Aplicar estimativas de custo para cada cenário
      const scenariosWithEstimates: ScenarioResult[] = validatedBacklog.scenarios.map((scenario) => {
        return {
          ...scenario,
          aiCodeGenerationEstimate: estimateAICodeGeneration(scenario, pricing),
        };
      });

      return {
        scenarios: scenariosWithEstimates,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error('Erro de validação na resposta da LLM:', {
          issues: error.issues,
          content: content.substring(0, 500),
        });
      } else {
        logger.error('Erro inesperado ao processar resposta da LLM:', error);
      }
      throw Object.assign(new Error('Resposta inválida recebida da LLM'), {
        status: 502,
        code: 'AI_INVALID_RESPONSE',
      });
    }
  }

  /**
   * Constructs the structured prompt for the LLM.
   * 
   * @param ideaDescription - The user's input idea
   * @returns The formatted prompt string
   */
  private buildPrompt(ideaDescription: string): string {
    return `
Gere um backlog comparativo com DOIS caminhos arquiteturais para o MVP da ideia abaixo.

Ideia:
${ideaDescription}

Cenários solicitados:
1. LEAN: Foco em validação rápida (MVP real), arquitetura simples, serviços de prateleira.
2. ENTERPRISE: Foco em escalabilidade, alta disponibilidade, segurança avançada, microsserviços e observabilidade.

Responda exclusivamente com um JSON neste formato:
{
  "scenarios": [
    {
      "type": "LEAN",
      "vision": "string",
      "epics": [
        {
          "id": "epic-1",
          "title": "string",
          "description": "string",
          "stories": [
            {
              "id": "story-1",
              "title": "string",
              "description": "string",
              "acceptanceCriteria": ["string"],
              "complexityPoints": 5,
              "estimatedTokens": {
                "input": { "min": 150000, "max": 400000 },
                "output": { "min": 80000, "max": 200000 }
              }
            }
          ]
        }
      ],
      "totalComplexityPoints": 15,
      "estimatedHours": { "min": 60, "max": 120 },
      "aiTokenEstimate": {
        "planningAndContextTokens": { "min": 200000, "max": 500000 },
        "validationAndFixInputTokens": { "min": 400000, "max": 1200000 },
        "validationAndFixOutputTokens": { "min": 100000, "max": 300000 }
      }
    },
    {
      "type": "ENTERPRISE",
      "vision": "string",
      "epics": [...],
      "totalComplexityPoints": 45,
      "estimatedHours": { "min": 180, "max": 360 },
      "aiTokenEstimate": { ... }
    }
  ]
}

Regras cruciais:
- "complexityPoints" deve ser Fibonacci (1, 2, 3, 5, 8, 13).
- O cenário ENTERPRISE deve refletir a complexidade adicional (testes, infra, segurança), geralmente 3x a 5x maior que o LEAN.
- "estimatedTokens" em cada história DEVE refletir o custo real de produzir uma feature completa (200k a 600k tokens por story).
- Use PT-BR.
- Retorne apenas o objeto JSON.
`.trim();
  }

  /**
   * Formats the base URL for the chat completions endpoint.
   * 
   * @returns Fully qualified chat completions URL
   */
  private chatCompletionsUrl(): string {
    return `${env.AI_BASE_URL.replace(/\/$/, '')}/chat/completions`;
  }

  /**
   * Attempts to parse detailed error information from the AI provider response.
   * 
   * @param response - The raw fetch Response object
   * @returns A parsed error object with client-safe and log-friendly messages
   */
  private async parseProviderError(response: Response): Promise<{
    clientMessage: string;
    logMessage: string;
  }> {
    const rawBody = await response.text();
    let errorPayload: unknown = {};

    try {
      errorPayload = JSON.parse(rawBody || '{}');
    } catch {
      errorPayload = {};
    }

    const parsedError = openAIErrorSchema.safeParse(errorPayload);

    if (!parsedError.success) {
      const genericProviderError = genericProviderErrorSchema.safeParse(errorPayload);

      if (genericProviderError.success) {
        return this.providerErrorMessage({
          status: response.status,
          code: genericProviderError.data.code,
          message: genericProviderError.data.error,
        });
      }

      return {
        clientMessage: 'Falha ao consultar a LLM',
        logMessage: rawBody,
      };
    }

    const { code, message, type } = parsedError.data.error;

    return this.providerErrorMessage({ status: response.status, code, message, type });
  }

  /**
   * Maps provider-specific status codes and error codes to human-readable messages.
   * 
   * @param params - Status code and error details from the provider
   * @returns Normalized error messages
   */
  private providerErrorMessage({
    status,
    code,
    message,
    type,
  }: {
    status: number;
    code?: string | null;
    message: string;
    type?: string | null;
  }): {
    clientMessage: string;
    logMessage: string;
  } {
    const providerCode = code ?? type;

    if (status === 401) {
      return {
        clientMessage: 'Chave da LLM inválida ou sem permissão',
        logMessage: message,
      };
    }

    if (
      (status === 402 || status === 403 || status === 429) &&
      (providerCode === 'insufficient_quota' ||
        message.toLowerCase().includes('credits') ||
        message.toLowerCase().includes('licenses') ||
        message.toLowerCase().includes('billing'))
    ) {
      return {
        clientMessage: 'Quota da LLM excedida ou billing indisponível para esta chave',
        logMessage: message,
      };
    }

    if (status === 429) {
      return {
        clientMessage: 'Limite de uso da LLM atingido. Tente novamente em instantes',
        logMessage: message,
      };
    }

    return {
      clientMessage: 'Falha ao consultar a LLM',
      logMessage: message,
    };
  }
}
