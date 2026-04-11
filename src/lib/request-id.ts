/**
 * Request ID Middleware
 *
 * Generates unique request ID per HTTP request and propagates via AsyncLocalStorage.
 * Each request gets an ID that flows through all async operations in the request chain.
 */

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { requestStorage } from './logger.js';

/**
 * Middleware that adds request ID to every request
 * - Uses X-Request-ID header if provided, otherwise generates UUID
 * - Sets X-Request-ID response header
 * - Stores request ID in AsyncLocalStorage for propagation
 */
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();

  // Set response header so client can trace requests
  res.setHeader('X-Request-Id', requestId);

  // Run the rest of the request chain within AsyncLocalStorage context
  requestStorage.run(new Map([['requestId', requestId]]), () => {
    next();
  });
};

export { requestStorage };
