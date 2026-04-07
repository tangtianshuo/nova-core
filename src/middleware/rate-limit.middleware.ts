import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

/**
 * Rate limit middleware for login endpoint
 * Blocks IP addresses after too many failed attempts
 */
export const loginRateLimit = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limit middleware for refresh token endpoint
 * More lenient than login rate limit
 */
export const refreshRateLimit = rateLimit({
  windowMs: 60000, // 1 minute
  max: 20, // 20 requests per minute
  message: 'Too many refresh attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limit middleware for registration endpoint
 * Stricter limit to prevent spam accounts
 */
export const registerRateLimit = rateLimit({
  windowMs: 3600000, // 1 hour
  max: 3, // 3 attempts per hour per IP
  message: '注册尝试过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
