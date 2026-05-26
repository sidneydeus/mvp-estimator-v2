import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { IAIService } from './IAIService';
import { MockAIService } from './MockAIService';
import { OpenAIService } from './OpenAIService';

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
