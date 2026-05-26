import { AICodeGenerationPricing, BacklogResult, IAIService } from './IAIService';
import { logger } from '../../utils/logger';
import { estimateAICodeGeneration } from './AICodeGenerationEstimator';

export class MockAIService implements IAIService {
  async generateBacklog(
    ideaDescription: string,
    pricing?: AICodeGenerationPricing,
  ): Promise<BacklogResult> {
    logger.info('Simulando geração de backlog via IA...');
    
    // Simula um delay de processamento de IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const totalComplexityPoints = 11;
    const estimatedHours = {
      min: Math.round(totalComplexityPoints * 8),
      max: Math.round(totalComplexityPoints * 12),
    };

    const backlog = {
      vision: `Visão do Produto baseada em: ${ideaDescription.substring(0, 50)}...`,
      epics: [
        {
          id: 'epic-1',
          title: 'Gestão de Usuários',
          description: 'Funcionalidades básicas de acesso e perfil.',
          stories: [
            {
              id: 'story-1',
              title: 'Login via Email',
              description: 'Como usuário, quero logar para acessar meus dados.',
              acceptanceCriteria: ['Validar email', 'Validar senha'],
              complexityPoints: 3,
            },
          ],
        },
        {
          id: 'epic-2',
          title: 'Core Business',
          description: 'Funcionalidade principal do sistema.',
          stories: [
            {
              id: 'story-2',
              title: 'Funcionalidade Principal 1',
              description: 'Descrição da funcionalidade principal.',
              acceptanceCriteria: ['Critério 1', 'Critério 2'],
              complexityPoints: 8,
            },
          ],
        },
      ],
      totalComplexityPoints,
      estimatedHours,
      aiTokenEstimate: {
        planningAndContextTokens: {
          min: 7_200,
          max: 14_000,
        },
        codeGenerationInputTokens: {
          min: 200_000,
          max: 540_000,
        },
        codeGenerationOutputTokens: {
          min: 72_000,
          max: 216_000,
        },
        validationAndFixInputTokens: {
          min: 64_000,
          max: 180_000,
        },
        validationAndFixOutputTokens: {
          min: 20_000,
          max: 84_000,
        },
      },
    };

    return {
      ...backlog,
      aiCodeGenerationEstimate: estimateAICodeGeneration(backlog, pricing),
    };
  }
}
