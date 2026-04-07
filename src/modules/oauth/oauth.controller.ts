import { Request, Response } from 'express';
import {
  getAuthorizationUrl,
  handleCallback,
  linkOAuthAccount,
  unlinkOAuthAccount,
  getLinkedAccounts,
} from './oauth.service.js';
import type { OAuthLinkDto, OAuthUnlinkDto } from './types.js';

/**
 * Redirect to OAuth provider authorization page
 * GET /auth/oauth/:provider/login
 */
export const redirectToProvider = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { provider } = req.params;
    const { redirect_uri } = req.query;

    const providerStr = typeof provider === 'string' ? provider : Array.isArray(provider) ? provider[0] : provider;

    const result = getAuthorizationUrl(
      providerStr,
      typeof redirect_uri === 'string' ? redirect_uri : undefined
    );

    if (!result) {
      res.status(400).json({ error: `Unsupported provider: ${providerStr}` });
      return;
    }

    // Redirect to provider's authorization page
    res.redirect(result.url);
  } catch (error) {
    console.error('OAuth redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handle OAuth provider callback
 * GET /auth/oauth/:provider/callback
 */
export const handleCallbackController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { provider } = req.params;
    const { code, state, error } = req.query;

    const providerStr = String(typeof provider === 'string' ? provider : Array.isArray(provider) ? provider[0] : 'unknown');

    // Handle user denying authorization
    if (error) {
      const errorStr = typeof error === 'string' ? error : String(error);
      res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/login?error=${encodeURIComponent(errorStr)}`);
      return;
    }

    const codeStr = String(typeof code === 'string' ? code : Array.isArray(code) ? code[0] : '');
    const stateStr = String(typeof state === 'string' ? state : Array.isArray(state) ? state[0] : '');

    if (!codeStr || !stateStr) {
      res.status(400).json({ error: 'Missing code or state parameter' });
      return;
    }

    // Handle OAuth callback and generate JWT tokens
    const result = await handleCallback(
      providerStr,
      codeStr,
      stateStr
    );

    // Redirect to frontend with tokens (or set cookies)
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    const redirectUrl = new URL('/login/oauth/callback', frontendUrl);
    redirectUrl.searchParams.set('access_token', result.accessToken);
    redirectUrl.searchParams.set('refresh_token', result.refreshToken);
    redirectUrl.searchParams.set('user_id', result.user.id);
    redirectUrl.searchParams.set('username', result.user.username);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('OAuth callback error:', error);
    const message = error instanceof Error ? error.message : 'OAuth authentication failed';
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(message)}`);
  }
};

/**
 * Link OAuth account to current user
 * POST /auth/oauth/link
 */
export const linkAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { provider, code, state } = req.body as OAuthLinkDto;

    if (!provider || !code || !state) {
      res.status(400).json({ error: 'Provider, code, and state are required' });
      return;
    }

    await linkOAuthAccount(user.userId, provider, code, state);

    res.status(200).json({
      message: 'Account linked successfully',
      provider,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to link account';
    res.status(400).json({ error: message });
  }
};

/**
 * Unlink OAuth account from current user
 * POST /auth/oauth/unlink
 */
export const unlinkAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { provider } = req.body as OAuthUnlinkDto;

    if (!provider) {
      res.status(400).json({ error: 'Provider is required' });
      return;
    }

    await unlinkOAuthAccount(user.userId, provider);

    res.status(200).json({
      message: 'Account unlinked successfully',
      provider,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to unlink account';
    res.status(400).json({ error: message });
  }
};

/**
 * Get linked OAuth accounts for current user
 * GET /auth/oauth/accounts
 */
export const getAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const accounts = await getLinkedAccounts(user.userId);

    res.status(200).json({ accounts });
  } catch (error) {
    console.error('Get OAuth accounts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
