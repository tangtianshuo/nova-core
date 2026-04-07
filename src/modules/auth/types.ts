/**
 * User payload embedded in JWT token
 */
export interface UserPayload {
  userId: string;
  username: string;
}

/**
 * Login request body
 */
export interface LoginDto {
  username: string;
  password: string;
}

/**
 * Registration request body
 */
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

/**
 * Registration response
 */
export interface RegisterResponse {
  user: {
    id: string;
    username: string;
    email: string | null;
  };
  message: string;
}

/**
 * Refresh token request body
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * Token response returned after successful login
 */
export interface TokenResponse {
  accessToken: string;
  expiresIn: string;
}

/**
 * Login response with access token and refresh token
 */
export interface LoginResponse extends TokenResponse {
  refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Validate response - confirms token validity
 */
export interface ValidateResponse {
  valid: true;
  user: {
    userId: string;
    username: string;
  };
}

/**
 * Logout response
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Generic error response
 */
export interface ErrorResponse {
  error: string;
}

/**
 * Express Request with user payload
 */
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
