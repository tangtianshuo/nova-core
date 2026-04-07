import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 * Catches all errors and returns generic response
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Log error in development (could be enhanced with proper logging service)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Return generic error message without exposing stack traces
  res.status(500).json({
    error: 'Internal server error',
  });
};
