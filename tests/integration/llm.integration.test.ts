import { describe, it, expect } from 'vitest';
import { OpenAIService } from '../../src/services/ai/OpenAIService';
import { env } from '../../src/config/env';

describe('Real LLM Integration Test', () => {
  // Este teste só deve rodar se houver uma chave de API configurada
  const hasApiKey = !!env.AI_API_KEY;

  it.runIf(hasApiKey)('deve se comunicar com a LLM real e retornar um backlog válido', async () => {
    const service = new OpenAIService();
    const idea = 'Um sistema simples de agendamento de consultas para clínicas veterinárias.';

    console.log(`Iniciando teste real com o modelo: ${env.AI_MODEL}`);
    
    try {
      const result = await service.generateBacklog(idea);

      // Validações básicas de estrutura
      expect(result).toBeDefined();
      expect(result.scenarios).toBeDefined();
      expect(result.scenarios.length).toBeGreaterThan(0);
      
      const firstScenario = result.scenarios[0];
      expect(firstScenario.vision).toBeTypeOf('string');
      expect(firstScenario.epics.length).toBeGreaterThan(0);
      
      // Valida se os campos que costumam dar erro estão presentes e corretos
      const firstEpic = firstScenario.epics[0];
      const firstStory = firstEpic.stories[0];
      
      expect(firstStory.complexityPoints).toBeDefined();
      expect(typeof firstStory.complexityPoints).toBe('number');
      
      expect(firstScenario.aiTokenEstimate).toBeDefined();
      expect(firstScenario.aiCodeGenerationEstimate).toBeDefined();
      
      console.log('--- TESTE REAL SUCESSO ---');
      console.log('Custo estimado retornado:', firstScenario.aiCodeGenerationEstimate?.display.estimatedCost);
    } catch (error) {
      console.error('--- FALHA NO TESTE REAL ---');
      console.error(error);
      throw error;
    }
  }, 60000); // Timeout de 60s para chamada de rede

  it.skipIf(hasApiKey)('aviso: teste real pulado (AI_API_KEY não configurada)', () => {
    // Apenas para informar no log do vitest
  });
});
