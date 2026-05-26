import { describe, it, expect } from 'vitest';
import { estimateAICodeGeneration } from '../../src/services/ai/AICodeGenerationEstimator';
import { AITokenEstimate } from '../../src/services/ai/IAIService';

describe('AICodeGenerationEstimator', () => {
  it('deve calcular corretamente o custo médio, mínimo e máximo a partir das stories', () => {
    const mockBacklog = {
      vision: 'Test vision',
      epics: [
        {
          id: 'epic-1',
          title: 'Epic 1',
          description: 'Desc',
          stories: [
            {
              id: 'story-1',
              title: 'Story 1',
              description: 'Desc',
              acceptanceCriteria: [],
              complexityPoints: 5,
              estimatedTokens: {
                input: { min: 5000, max: 10000 },
                output: { min: 10000, max: 20000 },
              },
            },
            {
              id: 'story-2',
              title: 'Story 2',
              description: 'Desc',
              acceptanceCriteria: [],
              complexityPoints: 5,
              estimatedTokens: {
                input: { min: 0, max: 0 },
                output: { min: 20000, max: 30000 },
              },
            },
          ],
        },
      ],
      totalComplexityPoints: 10,
      estimatedHours: { min: 10, max: 20 },
      aiTokenEstimate: {
        planningAndContextTokens: { min: 10000, max: 20000 },
        validationAndFixInputTokens: { min: 0, max: 0 },
        validationAndFixOutputTokens: { min: 0, max: 0 },
      } as any,
    };

    const pricing = {
      inputCostPer1MTokens: 5.0,
      outputCostPer1MTokens: 15.0,
      costPerComplexityPoint: 10.0,
    };

    const result = estimateAICodeGeneration(mockBacklog as any, pricing);

    // Inputs: Global Planning (10k-20k) + Stories (5k-10k) = 15k-30k
    // Outputs: Stories (10k+20k = 30k, 20k+30k = 50k) = 30k-50k
    
    // Mins: input = 15k. output = 30k.
    // Min Cost: (15,000 / 1,000,000) * 5 + (30,000 / 1,000,000) * 15
    // Min Cost: 0.075 + 0.45 = 0.525
    expect(result.costEstimate.min).toBe(0.525);

    // Maxs: input = 30k. output = 50k.
    // Max Cost: (30,000 / 1,000,000) * 5 + (50,000 / 1,000,000) * 15
    // Max Cost: 0.15 + 0.75 = 0.90
    expect(result.costEstimate.max).toBe(0.90);

    // Average: (0.525 + 0.90) / 2 = 0.7125
    expect(result.display.estimatedCost).toBe('$0.7125');
    
    // Total tokens display
    expect(result.display.totalInputTokens).toBe('15,000 - 30,000 tokens');
    expect(result.display.totalOutputTokens).toBe('30,000 - 50,000 tokens');
    expect(result.display.totalTokens).toBe('45,000 - 80,000 tokens');
  });

  it('deve usar valores do ambiente se pricing for omitido', () => {
    const mockBacklog = {
        vision: 'Test vision',
        epics: [],
        totalComplexityPoints: 0,
        estimatedHours: { min: 10, max: 20 },
        aiTokenEstimate: {
          planningAndContextTokens: { min: 1000, max: 1000 },
          codeGenerationInputTokens: { min: 1000, max: 1000 },
          codeGenerationOutputTokens: { min: 1000, max: 1000 },
          validationAndFixInputTokens: { min: 0, max: 0 },
          validationAndFixOutputTokens: { min: 0, max: 0 },
        } as AITokenEstimate,
      };
      
      const result = estimateAICodeGeneration(mockBacklog);
      expect(result.costEstimate.inputCostPer1MTokens).toBeDefined();
      expect(result.costEstimate.outputCostPer1MTokens).toBeDefined();
  });
});
