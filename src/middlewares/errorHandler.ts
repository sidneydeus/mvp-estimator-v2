import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    logger.error('Erro de Validação detectado');
    return sendError(
      res,
      {
        code: 'VALIDATION_ERROR',
        message: 'Dados de entrada inválidos',
        details: err.issues.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      400,
    );
  }

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Ocorreu um erro inesperado no servidor';

  logger.error(`[Error] ${code}: ${message}`, err);

  return sendError(res, { code, message }, status);
};
