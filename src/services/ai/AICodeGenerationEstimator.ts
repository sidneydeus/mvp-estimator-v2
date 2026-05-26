import {
  AICodeGenerationEstimate,
  AICodeGenerationPricing,
  AITokenEstimate,
  BacklogResult,
  TokenRange,
} from './IAIService';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

type BacklogWithoutAIEstimate = Omit<BacklogResult, 'aiCodeGenerationEstimate'>;

export const estimateAICodeGeneration = (
  backlog: BacklogWithoutAIEstimate,
  pricing?: AICodeGenerationPricing,
): AICodeGenerationEstimate => {
  // Garantir que temos valores de pricing, mesmo que o objeto venha parcial ou nulo
  const effectivePricing: AICodeGenerationPricing = {
    inputCostPer1MTokens: pricing?.inputCostPer1MTokens ?? env.AI_INPUT_COST_PER_1M_TOKENS ?? 5.00,
    outputCostPer1MTokens: pricing?.outputCostPer1MTokens ?? env.AI_OUTPUT_COST_PER_1M_TOKENS ?? 15.00,
    costPerComplexityPoint: pricing?.costPerComplexityPoint ?? env.AI_COST_PER_COMPLEXITY_POINT ?? 10.0,
    hourlyRate: pricing?.hourlyRate ?? 50.0, // Valor padrão realista para desenvolvimento
  };

  const normalizedTokenEstimate = normalizeTokenEstimate(backlog.aiTokenEstimate);

  // Somar tokens de todas as histórias
  let storyInputMin = 0;
  let storyInputMax = 0;
  let storyOutputMin = 0;
  let storyOutputMax = 0;

  backlog.epics.forEach((epic) => {
    epic.stories.forEach((story) => {
      const tokens = story.estimatedTokens || {
        input: { min: 0, max: 0 },
        output: { min: 0, max: 0 },
      };
      storyInputMin += tokens.input.min || 0;
      storyInputMax += tokens.input.max || 0;
      storyOutputMin += tokens.output.min || 0;
      storyOutputMax += tokens.output.max || 0;
    });
  });

  const inputMin = sumValues(
    normalizedTokenEstimate.planningAndContextTokens.min,
    storyInputMin,
    normalizedTokenEstimate.validationAndFixInputTokens.min,
  );
  const inputMax = sumValues(
    normalizedTokenEstimate.planningAndContextTokens.max,
    storyInputMax,
    normalizedTokenEstimate.validationAndFixInputTokens.max,
  );

  const outputMin = sumValues(
    storyOutputMin,
    normalizedTokenEstimate.validationAndFixOutputTokens.min,
  );
  const outputMax = sumValues(
    storyOutputMax,
    normalizedTokenEstimate.validationAndFixOutputTokens.max,
  );

  const minCost = calculateCost(inputMin, outputMin, effectivePricing);
  const maxCost = calculateCost(inputMax, outputMax, effectivePricing);
  const averageCost = Number(((minCost + maxCost) / 2).toFixed(4));

  // Cálculo do Custo Funcional baseado nas horas estimadas e na taxa horária
  const avgHours = (backlog.estimatedHours.min + backlog.estimatedHours.max) / 2;
  const functionalCost = avgHours * (effectivePricing.hourlyRate || 50.0);

  logger.info('Cálculo de custo IA finalizado', {
    inputMin,
    inputMax,
    outputMin,
    outputMax,
    minCost,
    maxCost,
    averageCost,
    avgHours,
    functionalCost,
  });

  return {
    assumptions: {
      workflow:
        'Estimativa para geração assistida por IA com prompts iterativos, contexto de arquitetura, geração de código, testes, revisão e correções.',
      includes: [
        'backend/API',
        'modelos e validações',
        'integrações descritas no backlog',
        'testes automatizados básicos',
        'iterações de correção após execução dos testes',
      ],
      excludes: [
        'tokens usados por IDEs ou agentes fora desta API',
        'custos de infraestrutura, banco de dados, gateway de pagamento ou hospedagem',
        'retrabalho por mudança de escopo',
      ],
    },
    tokenEstimate: {
      ...normalizedTokenEstimate,
      codeGenerationInputTokens: { min: storyInputMin, max: storyInputMax },
      codeGenerationOutputTokens: { min: storyOutputMin, max: storyOutputMax },
      totalInputTokens: { min: inputMin, max: inputMax },
      totalOutputTokens: { min: outputMin, max: outputMax },
      totalTokens: { min: inputMin + outputMin, max: inputMax + outputMax },
    },
    costEstimate: {
      currency: 'USD',
      inputCostPer1MTokens: effectivePricing.inputCostPer1MTokens,
      outputCostPer1MTokens: effectivePricing.outputCostPer1MTokens,
      min: minCost,
      max: maxCost,
      display: {
        range: `${formatCurrency(minCost)} - ${formatCurrency(maxCost)}`,
        min: formatCurrency(minCost),
        max: formatCurrency(maxCost),
        inputCostPer1MTokens: `${formatCurrency(effectivePricing.inputCostPer1MTokens)} / 1M input tokens`,
        outputCostPer1MTokens: `${formatCurrency(effectivePricing.outputCostPer1MTokens)} / 1M output tokens`,
      },
      note:
        'Custo calculado com aiPricing da request ou, se ausente, com AI_INPUT_COST_PER_1M_TOKENS e AI_OUTPUT_COST_PER_1M_TOKENS do ambiente.',
    },
    display: {
      totalInputTokens: formatTokenRange(inputMin, inputMax),
      totalOutputTokens: formatTokenRange(outputMin, outputMax),
      totalTokens: formatTokenRange(inputMin + outputMin, inputMax + outputMax),
      estimatedCost: formatCurrency(averageCost),
      pricing: `${formatCurrency(effectivePricing.inputCostPer1MTokens)} / 1M input tokens, ${formatCurrency(effectivePricing.outputCostPer1MTokens)} / 1M output tokens`,
      complexityTotalCost: formatCurrency(functionalCost),
    },
  };
};

const normalizeTokenEstimate = (tokenEstimate: AITokenEstimate): AITokenEstimate => ({
  planningAndContextTokens: normalizeRange(tokenEstimate.planningAndContextTokens),
  codeGenerationInputTokens: { min: 0, max: 0 }, // Será preenchido pela soma das histórias
  codeGenerationOutputTokens: { min: 0, max: 0 }, // Será preenchido pela soma das histórias
  validationAndFixInputTokens: normalizeRange(tokenEstimate.validationAndFixInputTokens),
  validationAndFixOutputTokens: normalizeRange(tokenEstimate.validationAndFixOutputTokens),
});

const normalizeRange = (range: TokenRange): TokenRange => {
  if (!range) return { min: 0, max: 0 };
  return {
    min: Math.max(0, Math.round(Math.min(range.min, range.max))),
    max: Math.max(0, Math.round(Math.max(range.min, range.max))),
  };
};

const sumValues = (...values: number[]): number =>
  values.reduce((total, current) => total + (current || 0), 0);

const calculateCost = (
  inputTokens: number,
  outputTokens: number,
  pricing: AICodeGenerationPricing,
): number => {
  const inputCost = (inputTokens / 1_000_000) * (pricing.inputCostPer1MTokens || 0);
  const outputCost = (outputTokens / 1_000_000) * (pricing.outputCostPer1MTokens || 0);

  const total = inputCost + outputCost;
  // Se for maior que 0 mas menor que 0.0001, arredonda para cima para não sumir
  if (total > 0 && total < 0.0001) return 0.0001;
  return Number(total.toFixed(4));
};

const formatTokenRange = (min: number, max: number): string =>
  `${formatInteger(min)} - ${formatInteger(max)} tokens`;

const formatInteger = (value: number): string => new Intl.NumberFormat('en-US').format(value);

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
