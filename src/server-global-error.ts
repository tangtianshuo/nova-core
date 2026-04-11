/**
 * Global Error Handlers - Unhandled rejections and uncaught exceptions
 *
 * Catches and logs:
 * - Unhandled Promise rejections (unhandledRejection)
 * - Uncaught exceptions (uncaughtException)
 *
 * All errors are logged to error.log for centralized tracking.
 *
 * Implements: LOG-09 (error logging for all system errors)
 */

import pino from 'pino';
import { errorLogStream } from './lib/log-streams.js';

// 创建错误日志记录器（写入error.log）
const errorLogger = pino(errorLogStream);

// 未处理的 Promise rejection
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  errorLogger.error({
    msg: 'Unhandled Rejection',
    error: {
      reason: String(reason),
      reasonType: reason instanceof Error ? reason.name : typeof reason,
      stack: reason instanceof Error ? reason.stack : undefined,
    },
    promise: {
      // Promise对象本身无法序列化，只记录类型
      type: 'Promise',
    },
  }, 'Unhandled Rejection');
});

// 未捕获的异常
process.on('uncaughtException', (err: Error) => {
  errorLogger.error({
    msg: 'Uncaught Exception',
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
  }, 'Uncaught Exception');

  // uncaughtException 后应用状态可能不一致，应该重启进程（RESEARCH.md建议）
  // 依赖进程管理器（pm2、Docker）自动重启
  process.exit(1);
});

/**
 * Setup global error handlers
 * Call this when application starts (in app.ts or server.ts)
 *
 * Note: Event listeners are registered at module load time.
 * This function exists for explicit initialization and documentation purposes.
 */
export function setupGlobalErrorHandlers(): void {
  // Listeners are already registered above
  // This function exists for explicit initialization and documentation
}
