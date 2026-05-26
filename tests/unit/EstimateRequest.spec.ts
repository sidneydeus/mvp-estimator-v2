import { describe, it, expect } from 'vitest';
import { estimateRequestSchema } from '../../src/models/EstimateRequest';

describe('EstimateRequestSchema', () => {
  it('deve validar uma descrição válida', () => {
    const validData = { ideaDescription: 'Uma ideia de software muito inovadora e legal.' };
    const result = estimateRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('deve falhar se a descrição for muito curta', () => {
    const invalidData = { ideaDescription: 'Curta' };
    const result = estimateRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('A descrição deve ter pelo menos 10 caracteres');
    }
  });

  it('deve falhar se a descrição estiver ausente', () => {
    const invalidData = {};
    const result = estimateRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
