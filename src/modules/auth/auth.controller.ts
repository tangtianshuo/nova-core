import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import {
  verifyPassword,
  generateAccessToken,
  createRefreshToken,
  refreshAccessToken,
  revokeRefreshToken,
  registerUser,
} from './auth.service.js';
import { config } from '../../config/index.js';
import { logAuditEvent } from '../../lib/audit-logger.js';
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  RefreshTokenDto,
  RefreshTokenResponse,
  ValidateResponse,
  LogoutResponse,
} from './types.js';

/**
 * Register handler - create a new user account
 */
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body as RegisterDto;

    // Validate request body
    if (!username || !email || !password) {
      res.status(400).json({ error: '用户名、邮箱和密码都是必填项' });
      return;
    }

    // Create user
    const user = await registerUser(username, email, password);

    logAuditEvent({
      action: 'REGISTER_SUCCESS',
      userId: user.id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Generate tokens (auto-login after registration)
    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = await createRefreshToken(user.id);

    const response: RegisterResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      message: '注册成功',
    };

    // Set cookies for tokens (optional, for convenience)
    // Note: In production, you might want to return tokens in body only
    res.status(201).json({
      ...response,
      accessToken,
      refreshToken,
      expiresIn: config.jwt.accessToken.expiresIn,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '注册失败';
    logAuditEvent({
      action: 'REGISTER_FAILED',
      ip: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { reason: message },
    });
    res.status(400).json({ error: message });
  }
};

/**
 * Login handler - authenticate user and return JWT token with refresh token
 */
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body as LoginDto;

    // Validate request body
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Find user by email OR username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: username }, { username: username }],
      },
    });

    // Generic error message for both not-found and wrong-password cases
    if (!user) {
      logAuditEvent({
        action: 'LOGIN_FAILED',
        ip: req.ip,
        userAgent: req.get('user-agent'),
        metadata: { username, reason: 'user_not_found' },
      });
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // OAuth-only users don't have passwords
    if (!user.passwordHash) {
      res.status(401).json({ error: 'This account uses OAuth login only. Please use the OAuth provider to login.' });
      return;
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      logAuditEvent({
        action: 'LOGIN_FAILED',
        userId: user.id,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        metadata: { username, reason: 'invalid_password' },
      });
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate access token and refresh token
    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = await createRefreshToken(user.id);

    logAuditEvent({
      action: 'LOGIN_SUCCESS',
      userId: user.id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    const response: LoginResponse = {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.accessToken.expiresIn,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Refresh token handler - exchange refresh token for new access token
 * Implements token rotation: returns new refresh token, revokes old one
 */
export const refresh = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body as RefreshTokenDto;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }

    // Exchange old refresh token for new tokens
    const tokens = await refreshAccessToken(refreshToken);

    logAuditEvent({
      action: 'TOKEN_REFRESH',
      userId: tokens.userId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      metadata: { refreshTokenUsed: true },
    });

    const response: RefreshTokenResponse = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };

    res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid refresh token';
    res.status(401).json({ error: message });
  }
};

/**
 * Validate token handler - verify JWT and return user info
 */
export const validateToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // If we reach here, JWT middleware has already verified the token
    // and attached user payload to req.user
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const response: ValidateResponse = {
      valid: true,
      user: {
        userId: user.userId,
        username: user.username,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Validate token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Logout handler - revoke refresh token
 * Client should also discard tokens locally
 */
export const logout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Try to revoke refresh token if provided in body
    const { refreshToken } = req.body as { refreshToken?: string };

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    logAuditEvent({
      action: 'LOGOUT',
      userId: req.user?.userId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    const response: LogoutResponse = {
      message: 'Logged out successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
