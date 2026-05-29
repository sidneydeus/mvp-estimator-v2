import { AICodeGenerationPricing, BacklogResult, IAIService, ScenarioType, ScenarioResult } from './IAIService';
import { logger } from '../../utils/logger';
import { estimateAICodeGeneration } from './AICodeGenerationEstimator';

/**
 * Mock implementation of IAIService for development and testing.
 * Returns static Lean and Enterprise scenarios without calling any external LLM APIs.
 */
export class MockAIService implements IAIService {
  /**
   * Generates a simulated project backlog with two architectural scenarios.
   * 
   * @param ideaDescription - The user's input idea
   * @param pricing - Optional pricing configuration for cost calculation
   * @returns A promise resolving to a BacklogResult containing LEAN and ENTERPRISE scenarios
   */
  async generateBacklog(
    ideaDescription: string,
    pricing?: AICodeGenerationPricing,
  ): Promise<BacklogResult> {
    logger.info('Simulando geração de backlog multi-cenário via IA...');
    
    // Simula um delay de processamento de IA
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const leanScenario: ScenarioResult = {
      type: ScenarioType.LEAN,
      vision: `[LEAN] MVP focado em validação rápida para: ${ideaDescription.substring(0, 40)}...`,
      epics: [
        {
          id: 'epic-lean-1',
          title: 'Core MVP',
          description: 'Funcionalidades mínimas para validar o valor.',
          stories: [
            {
              id: 'story-lean-1',
              title: 'Acesso Simples',
              description: 'Como usuário, quero acessar o sistema via link mágico.',
              acceptanceCriteria: ['Receber link por email', 'Acessar sem senha'],
              complexityPoints: 3,
              estimatedTokens: { input: { min: 100000, max: 200000 }, output: { min: 50000, max: 100000 } }
            },
          ],
        },
      ],
      totalComplexityPoints: 3,
      estimatedHours: { min: 12, max: 24 },
      aiTokenEstimate: {
        planningAndContextTokens: { min: 100000, max: 200000 },
        codeGenerationInputTokens: { min: 0, max: 0 },
        codeGenerationOutputTokens: { min: 0, max: 0 },
        validationAndFixInputTokens: { min: 100000, max: 300000 },
        validationAndFixOutputTokens: { min: 50000, max: 100000 },
      },
      aiCodeGenerationEstimate: {} as any, // Will be calculated below
    };

    const enterpriseScenario: ScenarioResult = {
      type: ScenarioType.ENTERPRISE,
      vision: `[ENTERPRISE] Plataforma escalável e segura para: ${ideaDescription.substring(0, 40)}...`,
      epics: [
        {
          id: 'epic-ent-1',
          title: 'Identity & Access Management',
          description: 'Gestão robusta de identidades e permissões.',
          stories: [
            {
              id: 'story-ent-1',
              title: 'SSO & MFA',
              description: 'Como administrador, exijo autenticação multi-fator e integração SSO.',
              acceptanceCriteria: ['Suporte a SAML/OIDC', 'MFA via TOTP'],
              complexityPoints: 13,
              estimatedTokens: { input: { min: 400000, max: 800000 }, output: { min: 200000, max: 400000 } }
            },
          ],
        },
      ],
      totalComplexityPoints: 13,
      estimatedHours: { min: 65, max: 130 },
      aiTokenEstimate: {
        planningAndContextTokens: { min: 500000, max: 1000000 },
        codeGenerationInputTokens: { min: 0, max: 0 },
        codeGenerationOutputTokens: { min: 0, max: 0 },
        validationAndFixInputTokens: { min: 1000000, max: 2500000 },
        validationAndFixOutputTokens: { min: 400000, max: 800000 },
      },
      aiCodeGenerationEstimate: {} as any, // Will be calculated below
    };

    // Calculate AI estimates for both scenarios
    leanScenario.aiCodeGenerationEstimate = estimateAICodeGeneration(leanScenario, pricing);
    enterpriseScenario.aiCodeGenerationEstimate = estimateAICodeGeneration(enterpriseScenario, pricing);

    return {
      scenarios: [leanScenario, enterpriseScenario],
    };
  }
}
