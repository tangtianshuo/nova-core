import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

/**
 * Global error handling middleware
 * Catches all errors and returns generic response
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Log error with structured fields via logger facade
  logger.error('Unhandled error', {
    requestId: req.headers['x-request-id'],
    error: { message: err.message, stack: err.stack },
    url: req.url,
    method: req.method,
  });

  // Return generic error message without exposing stack traces
  res.status(500).json({
    error: 'Internal server error',
  });
};
