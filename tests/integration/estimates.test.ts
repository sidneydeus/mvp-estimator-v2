import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { viteNodeApp } from '../../src/app';

describe('Estimates API Integration Tests', () => {
  it('GET /health deve retornar 200 OK', async () => {
    const response = await request(viteNodeApp).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
  });

  it('POST /api/estimates deve criar uma estimativa multi-cenário com sucesso', async () => {
    const payload = {
      ideaDescription: 'Quero criar um app de entrega de comida para pets.',
      aiPricing: {
        inputCostPer1MTokens: 0.3,
        outputCostPer1MTokens: 2.5,
      },
    };
    const response = await request(viteNodeApp)
      .post('/api/estimates')
      .send(payload);

    if (response.status !== 201) {
      console.error('API Response Error Body:', JSON.stringify(response.body, null, 2));
    }

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.scenarios).toBeDefined();
    expect(Array.isArray(response.body.data.scenarios)).toBe(true);
    expect(response.body.data.scenarios.length).toBeGreaterThan(0);

    const scenario = response.body.data.scenarios[0];
    expect(scenario.type).toBeDefined();
    expect(scenario.vision).toBeDefined();
    expect(scenario.epics.length).toBeGreaterThan(0);
    expect(scenario.totalComplexityPoints).toBeGreaterThan(0);
    expect(scenario.epics[0].stories[0].complexityPoints).toBeGreaterThan(0);
    expect(scenario.aiCodeGenerationEstimate.tokenEstimate.totalTokens.min).toBeGreaterThan(0);
    expect(scenario.aiCodeGenerationEstimate.costEstimate.currency).toBe('USD');
    expect(scenario.aiCodeGenerationEstimate.costEstimate.inputCostPer1MTokens).toBe(0.3);
    expect(scenario.aiCodeGenerationEstimate.costEstimate.outputCostPer1MTokens).toBe(2.5);
    expect(scenario.aiCodeGenerationEstimate.costEstimate.min).toBeGreaterThan(0);
    expect(scenario.aiCodeGenerationEstimate.costEstimate.display.range).toContain('$');
    expect(scenario.aiCodeGenerationEstimate.display.totalTokens).toContain('tokens');
    expect(scenario.aiCodeGenerationEstimate.display.estimatedCost).toContain('$');

    const { aiTokenEstimate, aiCodeGenerationEstimate } = scenario;

    const sumMinInput =
      aiTokenEstimate.planningAndContextTokens.min +
      aiCodeGenerationEstimate.tokenEstimate.codeGenerationInputTokens.min +
      aiTokenEstimate.validationAndFixInputTokens.min;

    const sumMaxInput =
      aiTokenEstimate.planningAndContextTokens.max +
      aiCodeGenerationEstimate.tokenEstimate.codeGenerationInputTokens.max +
      aiTokenEstimate.validationAndFixInputTokens.max;

    const sumMinOutput =
      aiCodeGenerationEstimate.tokenEstimate.codeGenerationOutputTokens.min +
      aiTokenEstimate.validationAndFixOutputTokens.min;

    const sumMaxOutput =
      aiCodeGenerationEstimate.tokenEstimate.codeGenerationOutputTokens.max +
      aiTokenEstimate.validationAndFixOutputTokens.max;

    expect(aiCodeGenerationEstimate.tokenEstimate.totalInputTokens.min).toBe(sumMinInput);
    expect(aiCodeGenerationEstimate.tokenEstimate.totalInputTokens.max).toBe(sumMaxInput);
    expect(aiCodeGenerationEstimate.tokenEstimate.totalOutputTokens.min).toBe(sumMinOutput);
    expect(aiCodeGenerationEstimate.tokenEstimate.totalOutputTokens.max).toBe(sumMaxOutput);

    // Custo mínimo esperado
    const expectedMinCost = Number(
      ((sumMinInput / 1_000_000) * 0.3 + (sumMinOutput / 1_000_000) * 2.5).toFixed(4),
    );
    expect(aiCodeGenerationEstimate.costEstimate.min).toBeCloseTo(expectedMinCost, 4);
  }, 30000);

  it('POST /api/estimates deve retornar 400 para payload inválido', async () => {
    const payload = { ideaDescription: 'Curto' };
    const response = await request(viteNodeApp)
      .post('/api/estimates')
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
