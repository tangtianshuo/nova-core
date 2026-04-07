import { Router } from 'express';
import {
  redirectToProvider,
  handleCallbackController,
  linkAccount,
  unlinkAccount,
  getAccounts,
} from './oauth.controller.js';
import { jwtAuth } from '../../middleware/jwt.middleware.js';

const router = Router();

/**
 * GET /auth/oauth/:provider/login
 * Redirect to OAuth provider authorization page
 *
 * @param provider - OAuth provider name (e.g., 'github', 'wechat')
 * @param redirect_uri - Optional custom redirect URI
 */
router.get('/auth/oauth/:provider/login', redirectToProvider);

/**
 * GET /auth/oauth/:provider/callback
 * Handle OAuth provider callback
 *
 * @param provider - OAuth provider name
 * @param code - Authorization code from provider
 * @param state - State parameter for CSRF protection
 */
router.get('/auth/oauth/:provider/callback', handleCallbackController);

/**
 * POST /auth/oauth/link
 * Link OAuth account to current user (requires authentication)
 *
 * Body: { provider: string, code: string, state: string }
 */
router.post('/auth/oauth/link', jwtAuth, linkAccount);

/**
 * POST /auth/oauth/unlink
 * Unlink OAuth account from current user (requires authentication)
 *
 * Body: { provider: string }
 */
router.post('/auth/oauth/unlink', jwtAuth, unlinkAccount);

/**
 * GET /auth/oauth/accounts
 * Get linked OAuth accounts for current user (requires authentication)
 */
router.get('/auth/oauth/accounts', jwtAuth, getAccounts);

export default router;
