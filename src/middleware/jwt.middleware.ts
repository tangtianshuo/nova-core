import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../modules/auth/auth.service.js';

/**
 * JWT authentication middleware
 * Verifies Bearer token from Authorization header
 * Attaches decoded user payload to req.user
 */
export const jwtAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const user = verifyAccessToken(token);
      req.user = user;
      next();
    } catch (error) {
      // Jwt errors: JsonWebTokenError, TokenExpiredError, NotBeforeError
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Invalid or expired token';
      res.status(401).json({ error: errorMessage });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
