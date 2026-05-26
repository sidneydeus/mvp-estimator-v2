import { Request, Response, NextFunction } from 'express';
import { createAIService } from '../services/ai/AIServiceFactory';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';

const aiService = createAIService();

export class EstimatesController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { ideaDescription, aiPricing } = req.body;

      logger.info('Recebida nova solicitação de estimativa');

      const result = await aiService.generateBacklog(
        ideaDescription,
        aiPricing,
      );

      return sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }
}
