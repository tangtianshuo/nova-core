/**
 * OAuth provider user profile
 */
export interface OAuthUserProfile {
  id: string;
  username: string;
  email?: string | null;
  avatarUrl?: string;
  // Provider-specific data
  raw?: any;
}

/**
 * OAuth token response
 */
export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
}

/**
 * OAuth provider interface
 */
export interface OAuthProvider {
  name: string;
  displayName: string;

  // OAuth endpoints
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;

  // Scopes to request
  scope: string[];

  // Build authorization URL with state parameter
  buildAuthorizationUrl(state: string, redirectUri: string): string;

  // Exchange authorization code for access token
  exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthTokenResponse>;

  // Get user profile using access token
  getUserInfo(accessToken: string): Promise<OAuthUserProfile>;
}

/**
 * OAuth state stored for CSRF protection
 */
export interface OAuthState {
  state: string;
  provider: string;
  redirectUri?: string;
  expiresAt: Date;
}

/**
 * OAuth login request (for callback)
 */
export interface OAuthCallbackDto {
  code: string;
  state: string;
}

/**
 * OAuth link account request
 */
export interface OAuthLinkDto {
  provider: string;
  code: string;
  state: string;
}

/**
 * OAuth unlink account request
 */
export interface OAuthUnlinkDto {
  provider: string;
}

/**
 * OAuth account response
 */
export interface OAuthAccountResponse {
  provider: string;
  providerId: string;
  connectedAt: Date;
}

/**
 * Linked accounts response
 */
export interface LinkedAccountsResponse {
  accounts: OAuthAccountResponse[];
}
