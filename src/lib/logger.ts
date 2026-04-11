/**
 * Logger Facade - Unified logging interface using Pino
 *
 * All business code should import logger from this file, not pino directly.
 * This provides a stable interface that can swap logging implementations.
 */

import pino from 'pino';
import { AsyncLocalStorage } from 'async_hooks';

// Request storage for AsyncLocalStorage - propagates requestId through async chain
export const requestStorage = new AsyncLocalStorage<Map<string, string>>();

/**
 * Create and configure the logger instance
 */
const createPinoLogger = (): pino.Logger => {
  const isDev = process.env.NODE_ENV !== 'production';
  const logLevel = process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');
  const serviceName = process.env.LOG_SERVICE_NAME || 'nova-auth';

  const base = {
    service: serviceName,
  };

  // Transport only in development for pretty printing
  const transport = isDev
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined;

  return pino({
    level: logLevel,
    base,
    transport,
    // Ensure error logs include stack trace
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });
};

// Internal pino instance
const pinoLogger = createPinoLogger();

/**
 * Logger facade with typed interface
 * All methods include requestId from AsyncLocalStorage when available
 */
export const logger = {
  debug(message: string, meta?: Record<string, unknown>): void {
    const requestId = requestStorage.getStore()?.get('requestId');
    pinoLogger.debug({ requestId, ...meta }, message);
  },

  info(message: string, meta?: Record<string, unknown>): void {
    const requestId = requestStorage.getStore()?.get('requestId');
    pinoLogger.info({ requestId, ...meta }, message);
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    const requestId = requestStorage.getStore()?.get('requestId');
    pinoLogger.warn({ requestId, ...meta }, message);
  },

  error(message: string, meta?: Record<string, unknown>): void {
    const requestId = requestStorage.getStore()?.get('requestId');
    pinoLogger.error({ requestId, ...meta }, message);
  },

  /**
   * Create a child logger with additional bindings
   */
  child(bindings: Record<string, unknown>): pino.Logger {
    return pinoLogger.child(bindings);
  },

  /**
   * Set request ID in the current async context
   */
  setRequestId(requestId: string): void {
    const store = requestStorage.getStore();
    if (store) {
      store.set('requestId', requestId);
    }
  },
};

export default logger;
