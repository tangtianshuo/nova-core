/**
 * Log Streams Configuration - File rotation with pino-roll
 *
 * Provides access and error log streams with combined rotation strategy:
 * - Daily rotation (logs/YYYY-MM-DD/access.log)
 * - Size rotation (100MB per file)
 *
 * Implements: LOG-05 (write to logs/), LOG-06 (rotation by date and size)
 */

import pino from 'pino';
import { join } from 'path';
import { mkdirSync } from 'fs';

// Log directory configuration
const logDir = join(process.cwd(), 'logs');
const today = new Date().toISOString().split('T')[0];
const dailyDir = join(logDir, today);

// Ensure log directory exists
try {
  mkdirSync(dailyDir, { recursive: true });
} catch (err) {
  // Directory may already exist, ignore error
}

/**
 * Access log stream with pino-roll
 *
 * Features:
 * - Creates logs/YYYY-MM-DD/access.log
 * - Rotates daily (frequency: 'daily')
 * - Rotates at 100MB (size: '100M')
 * - Automatically creates directories (mkdir: true)
 */
export const accessLogStream = pino.transport({
  target: 'pino-roll',
  options: {
    file: join(dailyDir, 'access.log'),
    frequency: 'daily',
    size: '100M',
    mkdir: true,
    extension: '.log',
  },
});

/**
 * Error log stream with pino-roll
 *
 * Features:
 * - Creates logs/YYYY-MM-DD/error.log
 * - Rotates daily (frequency: 'daily')
 * - Rotates at 100MB (size: '100M')
 * - Automatically creates directories (mkdir: true)
 *
 * Prepared for Phase 06-02 (Error Logging)
 */
export const errorLogStream = pino.transport({
  target: 'pino-roll',
  options: {
    file: join(dailyDir, 'error.log'),
    frequency: 'daily',
    size: '100M',
    mkdir: true,
    extension: '.log',
  },
});
