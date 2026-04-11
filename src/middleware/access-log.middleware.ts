/**
 * Access Log Middleware - HTTP request logging with pino-http
 *
 * Logs all HTTP requests to access.log with:
 * - method, url, status, responseTime (auto-added by pino-http)
 * - userId (from JWT middleware, if authenticated)
 * - clientIP (extracted from X-Forwarded-For or X-Real-IP headers)
 * - requestId (reused from Phase 5 request-id middleware)
 *
 * Implements: LOG-08 (access logging with HTTP request details)
 */

import pinoHttp from 'pino-http';
import pino from 'pino';
import { accessLogStream } from '../lib/log-streams.js';

/**
 * Access log middleware using pino-http
 *
 * Configuration:
 * - Reuses existing requestId from X-Request-ID header (Phase 5)
 * - Logs 2xx/3xx to access.log, silences 4xx/5xx (will go to error.log in Plan 02)
 * - Adds userId from JWT middleware (req.user)
 * - Extracts clientIP from proxy headers or remoteAddress
 * - Filters /health and /api-docs paths
 */
const accessLogger = pinoHttp({
  // Use dedicated access log stream
  logger: pino(accessLogStream),

  // Reuse existing requestId from Phase 5 (avoid duplicate generation)
  genReqId: (req) => {
    return (req.headers['x-request-id'] as string) || '';
  },

  // Classify log level by status code (D-02)
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 400) {
      return 'silent'; // Don't log errors to access.log (will log to error.log in Plan 02)
    }
    return 'info'; // Log 2xx, 3xx to access.log
  },

  // Add business fields (D-03)
  customProps: (req) => {
    return {
      // Get userId from JWT middleware (if authenticated)
      userId: (req as any).user?.userId || null,

      // Extract client real IP (handle proxy scenarios)
      clientIP:
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        (req.headers['x-real-ip'] as string) ||
        req.socket.remoteAddress ||
        'unknown',
    };
  },

  // Filter static paths (D-04)
  autoLogging: {
    ignore: (req) => {
      // Don't log health check requests
      if (req.url === '/health') return true;
      // Don't log API documentation requests
      if (req.url.startsWith('/api-docs')) return true;
      return false;
    },
  },
});

export default accessLogger;
export { accessLogger };
