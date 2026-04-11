/**
 * Audit Logger - Dedicated pino instance for security events
 *
 * Features:
 * - Separate pino-roll stream writing to audit.log
 * - ECS-compatible field format (@timestamp, log.level)
 * - Phone number masking for PII protection
 * - Typed audit actions for consistency
 *
 * Implements: LOG-10, LOG-11
 */

import pino from 'pino';
import { join } from 'path';
import { mkdirSync } from 'fs';

/**
 * Audit action types for security events
 */
export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'SMS_SEND'
  | 'SMS_VERIFY_SUCCESS'
  | 'SMS_VERIFY_FAILED'
  | 'SMS_LOCKED'
  | 'TOKEN_REFRESH'
  | 'REGISTER_SUCCESS'
  | 'REGISTER_FAILED';

/**
 * Log directory setup - same pattern as log-streams.ts
 */
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
 * Audit log stream with pino-roll
 *
 * Creates logs/YYYY-MM-DD/audit.log with daily rotation and 100MB size limit
 */
const auditStream = pino.transport({
  target: 'pino-roll',
  options: {
    file: join(dailyDir, 'audit.log'),
    frequency: 'daily',
    size: '100M',
    mkdir: true,
    extension: '.log',
  },
});

/**
 * Dedicated audit logger instance
 *
 * Uses ECS format for ELK compatibility:
 * - @timestamp: ISO8601 timestamp
 * - log.level: info/warn/error
 * - service.name: nova-auth
 * - logType: audit (differentiates in ELK)
 */
export const auditLogger = pino({
  level: 'info',
  timestamp: () => `,"@timestamp":"${new Date().toISOString()}"`,
  formatters: {
    level: (label) => ({ "log.level": label }),
    bindings: (bindings) => ({
      'service.name': bindings.service,
      'host.name': bindings.hostname,
      'process.pid': bindings.pid,
    }),
  },
  base: {
    service: 'nova-auth',
    logType: 'audit',
  },
}, auditStream);

/**
 * Determine event outcome from action
 *
 * @param action - The audit action
 * @returns 'success' | 'failure' | 'unknown'
 */
function getEventOutcome(action: AuditAction): 'success' | 'failure' | 'unknown' {
  switch (action) {
    case 'LOGIN_SUCCESS':
    case 'SMS_VERIFY_SUCCESS':
    case 'TOKEN_REFRESH':
    case 'REGISTER_SUCCESS':
      return 'success';
    case 'LOGIN_FAILED':
    case 'SMS_VERIFY_FAILED':
    case 'REGISTER_FAILED':
      return 'failure';
    case 'LOGOUT':
    case 'SMS_SEND':
    case 'SMS_LOCKED':
      return 'unknown';
    default:
      return 'unknown';
  }
}

/**
 * Mask phone number, showing only last 4 digits
 *
 * @param phone - The phone number to mask
 * @returns Masked phone number (e.g., "****1234")
 */
function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) {
    return '****';
  }
  return `****${phone.slice(-4)}`;
}

/**
 * Log an audit event
 *
 * @param params - Audit event parameters
 * @param params.action - The audit action type
 * @param params.userId - User ID (optional)
 * @param params.phone - Phone number (will be masked)
 * @param params.ip - Client IP address
 * @param params.userAgent - Client user agent
 * @param params.metadata - Additional metadata
 */
export function logAuditEvent(params: {
  action: AuditAction;
  userId?: string;
  phone?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}): void {
  const { action, userId, phone, ip, userAgent, metadata } = params;

  // Build the log entry with ECS fields
  const logEntry: Record<string, unknown> = {
    message: `Audit event: ${action}`,
    event: {
      action,
      outcome: getEventOutcome(action),
    },
  };

  // Add user info if available
  if (userId) {
    logEntry.user = { id: userId };
  }

  // Add masked phone if available
  if (phone) {
    logEntry.user = logEntry.user || {};
    (logEntry.user as Record<string, unknown>).phone = maskPhone(phone);
  }

  // Add client info if available
  if (ip) {
    logEntry.client = { ip };
  }

  // Add user agent if available
  if (userAgent) {
    logEntry.user_agent = { original: userAgent };
  }

  // Add metadata if provided
  if (metadata && Object.keys(metadata).length > 0) {
    logEntry.metadata = metadata;
  }

  // Log with info level
  auditLogger.info(logEntry);
}

export default auditLogger;
