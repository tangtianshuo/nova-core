import { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import { logger } from '../lib/logger.js';
import { errorLogStream } from '../lib/log-streams.js';

// 创建独立的错误日志记录器（写入error.log）
const errorLogger = pino(errorLogStream);

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
  // 记录到 error.log（文件）
  errorLogger.error({
    msg: 'Unhandled error',
    requestId: req.headers['x-request-id'],
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    request: {
      url: req.url,
      method: req.method,
      headers: req.headers,
      query: req.query,
      body: req.body, // 注意：敏感字段过滤在Phase 7处理
    },
    userId: (req as any).userId || null,
    clientIP: (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
              (req.headers['x-real-ip'] as string) ||
              req.socket.remoteAddress ||
              'unknown',
  }, 'Unhandled error');

  // 同时记录到控制台（通过现有logger facade，便于开发调试）
  logger.error('Unhandled error', {
    requestId: req.headers['x-request-id'],
    error: { message: err.message },
  });

  // Return generic error message without exposing stack traces
  res.status(500).json({
    error: 'Internal server error',
  });
};
