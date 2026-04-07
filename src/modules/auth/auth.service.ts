import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../../config/index.js';
import type { UserPayload } from './types.js';
import type { StringValue } from 'ms';
import prisma from '../../lib/prisma.js';

const BCRYPT_SALT_ROUNDS = 12;
const REFRESH_TOKEN_BYTES = 32;
const REFRESH_TOKEN_HASH_ALGORITHM = 'sha256';

/**
 * Hash a plaintext password using bcrypt
 */
export const hashPassword = async (plaintext: string): Promise<string> => {
  return bcrypt.hash(plaintext, BCRYPT_SALT_ROUNDS);
};

/**
 * Verify a plaintext password against a bcrypt hash
 */
export const verifyPassword = async (
  plaintext: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(plaintext, hash);
};

/**
 * Generate a JWT access token for a user
 */
export const generateAccessToken = (
  userId: string,
  username: string
): string => {
  const payload: UserPayload = { userId, username };
  return jwt.sign(payload, config.jwt.secret, {
    algorithm: 'HS256',
    expiresIn: config.jwt.accessToken.expiresIn as StringValue,
  });
};

/**
 * Verify and decode a JWT access token
 * Throws JsonWebTokenError or TokenExpiredError on failure
 */
export const verifyAccessToken = (token: string): UserPayload => {
  return jwt.verify(token, config.jwt.secret, {
    algorithms: ['HS256'],
  }) as UserPayload;
};

/**
 * Generate a cryptographically secure refresh token
 * Returns the plaintext token (to be sent to client)
 */
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
};

/**
 * Hash a refresh token for storage in database
 */
export const hashRefreshToken = (token: string): string => {
  return crypto
    .createHash(REFRESH_TOKEN_HASH_ALGORITHM)
    .update(token)
    .digest('hex');
};

/**
 * Calculate refresh token expiry date
 */
export const calculateRefreshTokenExpiry = (): Date => {
  const expiresIn = config.jwt.refreshToken.expiresIn;
  const now = new Date();
  const expiry = new Date(now);

  // Parse the expiresIn string (e.g., "7d", "7 days")
  const match = expiresIn.match(/^(\d+)([dhms])?$/);
  if (!match) {
    throw new Error(`Invalid refresh token expiry format: ${expiresIn}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2] || 'd';

  switch (unit) {
    case 'd':
      expiry.setDate(expiry.getDate() + value);
      break;
    case 'h':
      expiry.setHours(expiry.getHours() + value);
      break;
    case 'm':
      expiry.setMinutes(expiry.getMinutes() + value);
      break;
    case 's':
      expiry.setSeconds(expiry.getSeconds() + value);
      break;
  }

  return expiry;
};

/**
 * Create a refresh token for a user
 * Returns the plaintext token (to be sent to client)
 */
export const createRefreshToken = async (
  userId: string
): Promise<string> => {
  const token = generateRefreshToken();
  const tokenHash = hashRefreshToken(token);
  const expiresAt = calculateRefreshTokenExpiry();

  await prisma.refreshToken.create({
    data: {
      token: tokenHash,
      userId,
      expiresAt,
    },
  });

  return token;
};

/**
 * Verify a refresh token and return user info
 * Throws error if token is invalid, expired, or revoked
 */
export const verifyRefreshToken = async (
  token: string
): Promise<{ userId: string; tokenId: string }> => {
  const tokenHash = hashRefreshToken(token);

  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token: tokenHash },
  });

  if (!refreshToken) {
    throw new Error('Invalid refresh token');
  }

  if (refreshToken.revokedAt) {
    throw new Error('Refresh token has been revoked');
  }

  if (refreshToken.expiresAt < new Date()) {
    throw new Error('Refresh token has expired');
  }

  return {
    userId: refreshToken.userId,
    tokenId: refreshToken.id,
  };
};

/**
 * Refresh access token using refresh token
 * Returns new access token and new refresh token (token rotation)
 */
export const refreshAccessToken = async (
  oldRefreshToken: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: string }> => {
  // Verify old refresh token
  const { userId, tokenId } = await verifyRefreshToken(oldRefreshToken);

  // Get user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Revoke old refresh token
  await prisma.refreshToken.update({
    where: { id: tokenId },
    data: { revokedAt: new Date() },
  });

  // Generate new tokens
  const accessToken = generateAccessToken(user.id, user.username);
  const refreshToken = await createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.accessToken.expiresIn,
  };
};

/**
 * Revoke a refresh token
 */
export const revokeRefreshToken = async (token: string): Promise<void> => {
  const tokenHash = hashRefreshToken(token);

  try {
    await prisma.refreshToken.update({
      where: { token: tokenHash },
      data: { revokedAt: new Date() },
    });
  } catch {
    // Token doesn't exist, ignore
  }
};

/**
 * Revoke all refresh tokens for a user
 */
export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revokedAt: new Date() },
  });
};

/**
 * Clean up expired refresh tokens
 * Returns the number of tokens deleted
 */
export const cleanupExpiredTokens = async (): Promise<number> => {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  return result.count;
};

// ==================== Registration ====================

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username format
 * - 3-20 characters
 * - Alphanumeric, underscore, or hyphen only
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate password strength
 * - Minimum 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter or number or special char
 */
export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('密码至少需要 8 个字符');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母');
  }

  if (!/[A-Z0-9!@#$%^&*]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母、数字或特殊字符');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Check if username or email already exists
 */
export const checkUserExists = async (
  username: string,
  email: string
): Promise<{ usernameExists: boolean; emailExists: boolean }> => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
    select: {
      username: true,
      email: true,
    },
  });

  return {
    usernameExists: existingUser?.username === username,
    emailExists: existingUser?.email === email,
  };
};

/**
 * Register a new user
 * Returns the created user without password hash
 */
export const registerUser = async (username: string, email: string, password: string) => {
  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error('邮箱格式无效');
  }

  // Validate username format
  if (!isValidUsername(username)) {
    throw new Error('用户名格式无效（3-20个字符，仅限字母、数字、下划线、连字符）');
  }

  // Validate password strength
  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.valid) {
    throw new Error(passwordValidation.errors.join('; '));
  }

  // Check if user already exists
  const { usernameExists, emailExists } = await checkUserExists(username, email);

  if (usernameExists) {
    throw new Error('用户名已被使用');
  }

  if (emailExists) {
    throw new Error('邮箱已被注册');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};
