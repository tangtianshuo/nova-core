import { Router } from 'express';
import { register, login, validateToken, logout, refresh } from './auth.controller.js';
import { loginRateLimit, refreshRateLimit, registerRateLimit } from '../../middleware/rate-limit.middleware.js';
import { jwtAuth } from '../../middleware/jwt.middleware.js';

const router = Router();

/**
 * POST /auth/register
 * Rate limited: 3 attempts per hour per IP
 * Body: { username, email, password }
 * Returns: { user, accessToken, refreshToken, expiresIn, message }
 */
router.post('/register', registerRateLimit, register);

/**
 * POST /auth/login
 * Rate limited: 5 attempts per 15 minutes
 * Body: { username, password }
 * Returns: { accessToken, refreshToken, expiresIn }
 */
router.post('/login', loginRateLimit, login);

/**
 * POST /auth/refresh
 * Rate limited: 20 attempts per minute
 * Body: { refreshToken }
 * Returns: { accessToken, refreshToken, expiresIn }
 */
router.post('/refresh', refreshRateLimit, refresh);

/**
 * POST /auth/validate
 * Requires valid JWT token in Authorization header
 * Returns: { valid: true, user: { userId, username } }
 */
router.post('/validate', jwtAuth, validateToken);

/**
 * POST /auth/logout
 * Requires valid JWT token (for consistency)
 * Body: { refreshToken } (optional)
 * Returns: { message: "Logged out successfully" }
 */
router.post('/logout', jwtAuth, logout);

export default router;
