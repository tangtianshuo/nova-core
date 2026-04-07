import type { OAuthProvider, OAuthTokenResponse, OAuthUserProfile } from '../types.js';
import { config } from '../../../config/index.js';

/**
 * GitHub OAuth Provider
 *
 * Implements OAuth 2.0 authorization code flow for GitHub.
 * Documentation: https://docs.github.com/en/developers/apps/building-oauth-apps
 */
export const githubProvider: OAuthProvider = {
  name: 'github',
  displayName: 'GitHub',

  // GitHub OAuth endpoints
  authorizationUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userInfoUrl: 'https://api.github.com/user',

  // Scopes requested from GitHub
  scope: ['read:user', 'user:email'],

  /**
   * Build GitHub authorization URL
   */
  buildAuthorizationUrl(state: string, redirectUri: string): string {
    const params = new URLSearchParams({
      client_id: config.oauth.github.clientId,
      redirect_uri: redirectUri,
      scope: this.scope.join(' '),
      state: state,
      response_type: 'code',
    });
    return `${this.authorizationUrl}?${params.toString()}`;
  },

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthTokenResponse> {
    const response = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: config.oauth.github.clientId,
        client_secret: config.oauth.github.clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    const data = await response.json() as OAuthTokenResponse;

    if (!data.access_token) {
      throw new Error('No access token in response');
    }

    return data;
  },

  /**
   * Get user profile using access token
   */
  async getUserInfo(accessToken: string): Promise<OAuthUserProfile> {
    // Get user profile
    const userResponse = await fetch(this.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const githubUser = await userResponse.json() as any;

    // Get user email (primary and verified)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    let email: string | null = null;
    if (emailResponse.ok) {
      const emails = await emailResponse.json() as any[];
      const primaryEmail = emails.find((e: any) => e.primary && e.verified);
      email = primaryEmail?.email ?? githubUser.email ?? null;
    }

    return {
      id: String(githubUser.id),
      username: githubUser.login,
      email: email,
      avatarUrl: githubUser.avatar_url,
      raw: githubUser,
    };
  },
};
