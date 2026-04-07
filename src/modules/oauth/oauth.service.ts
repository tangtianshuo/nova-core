import crypto from 'crypto';
import prisma from '../../lib/prisma.js';
import { generateAccessToken, createRefreshToken } from '../auth/auth.service.js';
import type { OAuthProvider, OAuthUserProfile, OAuthState } from './types.js';
import { githubProvider } from './providers/github.provider.js';

// Map of provider name to provider implementation
const providers: Record<string, OAuthProvider> = {
  github: githubProvider,
};

// In-memory state storage (for production, use Redis with TTL)
const stateStore = new Map<string, OAuthState>();
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Clean up expired states
 */
function cleanupExpiredStates(): void {
  const now = new Date();
  for (const [key, state] of stateStore.entries()) {
    if (state.expiresAt < now) {
      stateStore.delete(key);
    }
  }
}

// Run cleanup every minute
setInterval(cleanupExpiredStates, 60 * 1000);

/**
 * Generate a cryptographically secure state parameter
 */
export function generateState(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Store OAuth state for CSRF protection
 */
export function storeState(state: string, provider: string, redirectUri?: string): void {
  stateStore.set(state, {
    state,
    provider,
    redirectUri,
    expiresAt: new Date(Date.now() + STATE_TTL_MS),
  });
}

/**
 * Validate and consume OAuth state
 */
export function validateState(state: string, provider: string): boolean {
  const storedState = stateStore.get(state);

  if (!storedState) {
    return false;
  }

  if (storedState.provider !== provider) {
    stateStore.delete(state);
    return false;
  }

  if (storedState.expiresAt < new Date()) {
    stateStore.delete(state);
    return false;
  }

  // Consume the state (one-time use)
  stateStore.delete(state);
  return true;
}

/**
 * Get OAuth provider by name
 */
export function getProvider(providerName: string): OAuthProvider | null {
  return providers[providerName] ?? null;
}

/**
 * Get authorization URL for a provider
 */
export function getAuthorizationUrl(
  providerName: string,
  redirectUri?: string
): { url: string; state: string } | null {
  const provider = getProvider(providerName);

  if (!provider) {
    return null;
  }

  const state = generateState();
  storeState(state, providerName, redirectUri);

  const url = provider.buildAuthorizationUrl(
    state,
    redirectUri ?? config.oauth.github.callbackUrl
  );

  return { url, state };
}

/**
 * Handle OAuth callback
 * Returns JWT tokens and user info
 */
export async function handleCallback(
  providerName: string,
  code: string,
  state: string
): Promise<{ accessToken: string; refreshToken: string; user: any }> {
  // Validate state
  if (!validateState(state, providerName)) {
    throw new Error('Invalid or expired state parameter');
  }

  const provider = getProvider(providerName);
  if (!provider) {
    throw new Error(`Unsupported provider: ${providerName}`);
  }

  // Exchange code for access token
  const tokenResponse = await provider.exchangeCodeForToken(
    code,
    config.oauth.github.callbackUrl
  );

  // Get user profile
  const userProfile = await provider.getUserInfo(tokenResponse.access_token);

  // Find or create user
  const user = await findOrCreateOAuthUser(providerName, userProfile);

  // Generate JWT tokens
  const jwtAccessToken = generateAccessToken(user.id, user.username);
  const jwtRefreshToken = await createRefreshToken(user.id);

  // Store OAuth access token (optional, for future API calls)
  await upsertOAuthAccount(
    user.id,
    providerName,
    userProfile,
    tokenResponse.access_token,
    tokenResponse.refresh_token
  );

  return {
    accessToken: jwtAccessToken,
    refreshToken: jwtRefreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

/**
 * Find or create user based on OAuth profile
 *
 * Strategy:
 * 1. If OAuth returns an email that exists, link to that account
 * 2. Otherwise, create a new account
 * 3. Handle username conflicts by adding numeric suffix
 */
async function findOrCreateOAuthUser(
  provider: string,
  profile: OAuthUserProfile
): Promise<{ id: string; username: string; email: string | null }> {
  // Check if OAuth account already exists
  const existingOAuthAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerId: {
        provider,
        providerId: profile.id,
      },
    },
    include: {
      user: true,
    },
  });

  if (existingOAuthAccount) {
    // User already exists, return it
    return {
      id: existingOAuthAccount.user.id,
      username: existingOAuthAccount.user.username,
      email: existingOAuthAccount.user.email,
    };
  }

  // Check if email already exists (auto-link strategy)
  let userToLink = null;
  if (profile.email) {
    userToLink = await prisma.user.findUnique({
      where: { email: profile.email },
    });
  }

  if (userToLink) {
    // Email exists, link OAuth account to it
    return {
      id: userToLink.id,
      username: userToLink.username,
      email: userToLink.email,
    };
  }

  // Create new user
  const username = await generateUniqueUsername(profile.username);

  const newUser = await prisma.user.create({
    data: {
      username,
      email: profile.email ?? null,
      passwordHash: null, // OAuth users don't have password
    },
  });

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };
}

/**
 * Generate a unique username
 * Adds numeric suffix if username already exists
 */
async function generateUniqueUsername(baseUsername: string): Promise<string> {
  let username = baseUsername;
  let suffix = 1;

  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${baseUsername}${suffix}`;
    suffix++;
  }

  return username;
}

/**
 * Create or update OAuth account record
 */
async function upsertOAuthAccount(
  userId: string,
  provider: string,
  profile: OAuthUserProfile,
  accessToken: string,
  refreshToken?: string
): Promise<void> {
  await prisma.oAuthAccount.upsert({
    where: {
      provider_providerId: {
        provider,
        providerId: profile.id,
      },
    },
    create: {
      userId,
      provider,
      providerId: profile.id,
      accessToken,
      refreshToken: refreshToken ?? null,
      scope: providers[provider].scope.join(' '),
    },
    update: {
      accessToken,
      refreshToken: refreshToken ?? null,
      updatedAt: new Date(),
    },
  });
}

/**
 * Link OAuth account to existing user
 */
export async function linkOAuthAccount(
  userId: string,
  providerName: string,
  code: string,
  state: string
): Promise<void> {
  // Validate state
  if (!validateState(state, providerName)) {
    throw new Error('Invalid or expired state parameter');
  }

  const provider = getProvider(providerName);
  if (!provider) {
    throw new Error(`Unsupported provider: ${providerName}`);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  // Exchange code for access token
  const tokenResponse = await provider.exchangeCodeForToken(
    code,
    config.oauth.github.callbackUrl
  );

  // Get user profile
  const profile = await provider.getUserInfo(tokenResponse.access_token);

  // Check if OAuth account is already linked to another user
  const existingAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerId: {
        provider: providerName,
        providerId: profile.id,
      },
    },
  });

  if (existingAccount && existingAccount.userId !== userId) {
    throw new Error('This OAuth account is already linked to another user');
  }

  // Create or update OAuth account
  await upsertOAuthAccount(
    userId,
    providerName,
    profile,
    tokenResponse.access_token,
    tokenResponse.refresh_token
  );
}

/**
 * Unlink OAuth account from user
 */
export async function unlinkOAuthAccount(
  userId: string,
  providerName: string
): Promise<void> {
  // Check if user has password or other OAuth accounts
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      oauthAccounts: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Find the OAuth account to unlink
  const accountToUnlink = user.oauthAccounts.find(
    (account) => account.provider === providerName
  );

  if (!accountToUnlink) {
    throw new Error('OAuth account not found');
  }

  // Check if this is the only authentication method
  const hasPassword = !!user.passwordHash;
  const hasOtherOAuth = user.oauthAccounts.length > 1;

  if (!hasPassword && !hasOtherOAuth) {
    throw new Error('Cannot unlink the only authentication method');
  }

  // Delete the OAuth account
  await prisma.oAuthAccount.delete({
    where: { id: accountToUnlink.id },
  });
}

/**
 * Get linked OAuth accounts for a user
 */
export async function getLinkedAccounts(
  userId: string
): Promise<{ provider: string; providerId: string; connectedAt: Date }[]> {
  const accounts = await prisma.oAuthAccount.findMany({
    where: { userId },
    select: {
      provider: true,
      providerId: true,
      createdAt: true,
    },
  });

  return accounts.map((account) => ({
    provider: account.provider,
    providerId: account.providerId,
    connectedAt: account.createdAt,
  }));
}

// Import config for callback URL
import { config } from '../../config/index.js';
