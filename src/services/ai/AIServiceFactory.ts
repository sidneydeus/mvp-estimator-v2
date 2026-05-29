import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { IAIService } from './IAIService';
import { MockAIService } from './MockAIService';
import { OpenAIService } from './OpenAIService';

/**
 * Factory function to instantiate the appropriate AI service implementation.
 * 
 * The selection logic is as follows:
 * 1. Returns MockAIService if NODE_ENV is 'test' or AI_PROVIDER is 'mock'.
 * 2. Returns OpenAIService if AI_PROVIDER is 'openai-compatible' or an AI_API_KEY is present.
 * 3. Defaults to MockAIService if no valid configuration is found.
 * 
 * @returns An instance of IAIService
 */
export const createAIService = (): IAIService => {
  if (env.NODE_ENV === 'test' || env.AI_PROVIDER === 'mock') {
    logger.info('AI provider ativo: mock');
    return new MockAIService();
  }

  if (env.AI_PROVIDER === 'openai-compatible' || env.AI_API_KEY) {
    logger.info('AI provider ativo: openai-compatible');
    return new OpenAIService();
  }

  logger.warn('AI_API_KEY ausente. Usando MockAIService.');
  return new MockAIService();
};
