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

  it('POST /api/estimates deve criar uma estimativa com sucesso', async () => {
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
    expect(response.body.data.vision).toBeDefined();
    expect(response.body.data.epics.length).toBeGreaterThan(0);
    expect(response.body.data.totalComplexityPoints).toBeGreaterThan(0);
    expect(response.body.data.epics[0].stories[0].complexityPoints).toBeGreaterThan(0);
    expect(response.body.data.aiCodeGenerationEstimate.tokenEstimate.totalTokens.min).toBeGreaterThan(0);
    expect(response.body.data.aiCodeGenerationEstimate.costEstimate.currency).toBe('USD');
    expect(response.body.data.aiCodeGenerationEstimate.costEstimate.inputCostPer1MTokens).toBe(0.3);
    expect(response.body.data.aiCodeGenerationEstimate.costEstimate.outputCostPer1MTokens).toBe(2.5);
    expect(response.body.data.aiCodeGenerationEstimate.costEstimate.min).toBeGreaterThan(0);
    expect(response.body.data.aiCodeGenerationEstimate.costEstimate.display.range).toContain('$');
    expect(response.body.data.aiCodeGenerationEstimate.display.totalTokens).toContain('tokens');
    expect(response.body.data.aiCodeGenerationEstimate.display.estimatedCost).toContain('$');

    const { aiTokenEstimate, aiCodeGenerationEstimate } = response.body.data;
    // expect(aiTokenEstimate.codeGenerationInputTokens.min).toBeGreaterThan(0); // Removido pois agora é agregado das histórias

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

    // Custo máximo esperado
    const expectedMaxCost = Number(
      ((sumMaxInput / 1_000_000) * 0.3 + (sumMaxOutput / 1_000_000) * 2.5).toFixed(4),
    );
    expect(aiCodeGenerationEstimate.costEstimate.max).toBeCloseTo(expectedMaxCost, 4);
  }, 30000); // Aumentado para 30s devido à latência da LLM

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
