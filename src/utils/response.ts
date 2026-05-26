import { Response } from 'express';

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export const sendSuccess = (res: Response, data: any, status = 200, meta?: any) => {
  return res.status(status).json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
};

export const sendError = (res: Response, error: AppError, status = 500) => {
  return res.status(status).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  });
};
