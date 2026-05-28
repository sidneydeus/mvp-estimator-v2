import { Request, Response, NextFunction } from 'express';
import { createAIService } from '../services/ai/AIServiceFactory';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';

const aiService = createAIService();

/**
 * Controller responsible for handling AI-powered project estimation requests.
 */
export class EstimatesController {
  /**
   * Orchestrates the creation of a project backlog and effort estimate.
   * 
   * 1. Extracts the idea description and optional pricing from the request body.
   * 2. Calls the AI Service to generate the structured backlog.
   * 3. Returns a success response with the generated BacklogResult.
   * 
   * @param req - Express Request object containing the idea description and optional aiPricing
   * @param res - Express Response object used to send the success payload
   * @param next - Express NextFunction for error propagation
   * @returns A promise that resolves to the API response
   */
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
