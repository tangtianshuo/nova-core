export { AuthClient } from './client';
export { AuthError } from './errors';
export { TokenManager, createTokenStorage } from './utils';
export * from './tauri';

export type {
  // Auth types
  LoginCredentials,
  RegisterCredentials,
  TokenResponse,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  RefreshTokenRequest,
  UserInfo,
  ValidateTokenResponse,
  LogoutResponse,
  ApiErrorResponse,
  // OAuth types
  OAuthProvider,
  OAuthUrlResponse,
  OAuthAccountInfo,
  LinkedAccountsResponse,
  OAuthLinkRequest,
  OAuthUnlinkRequest,
  // Common types
  AuthClientConfig,
  TokenStorage,
  AuthState,
} from './types';
