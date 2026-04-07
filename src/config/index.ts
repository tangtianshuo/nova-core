import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const JWT_SECRET_MIN_LENGTH = 32;

// Types for config
interface AccessTokenConfig {
  expiresIn: string;
}

interface RefreshTokenConfig {
  expiresIn: string;
}

interface JwtConfig {
  accessToken?: AccessTokenConfig;
  refreshToken?: RefreshTokenConfig;
  // Legacy support
  expiresIn?: string;
}

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

interface OAuthProviderConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope: string[];
}

interface OAuthConfig {
  github: OAuthProviderConfig;
  // Future providers can be added here
  // wechat?: OAuthProviderConfig;
  // google?: OAuthProviderConfig;
}

interface SmsConfig {
  aliyun: {
    accessKeyId: string;
    accessKeySecret: string;
    signName: string;
    templateCode: string;
  };
  code: {
    length: number;
    ttlSeconds: number;
  };
}

interface AppConfig {
  jwt: JwtConfig;
  rateLimit: RateLimitConfig;
  oauth?: OAuthConfig;
  sms?: SmsConfig;
}

// Load config file (config.yaml)
function loadConfigFile(): AppConfig {
  const configPath = path.resolve(process.cwd(), 'config.yaml');

  if (!fs.existsSync(configPath)) {
    return getDefaultConfig();
  }

  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents) as AppConfig;

    // Support both new and legacy config format
    const accessTokenExpiresIn = config.jwt?.accessToken?.expiresIn ?? config.jwt?.expiresIn ?? '1h';
    const refreshTokenExpiresIn = config.jwt?.refreshToken?.expiresIn ?? '7d';

    return {
      jwt: {
        accessToken: { expiresIn: accessTokenExpiresIn },
        refreshToken: { expiresIn: refreshTokenExpiresIn },
      },
      rateLimit: {
        windowMs: config.rateLimit?.windowMs ?? 900000,
        max: config.rateLimit?.max ?? 5,
      },
      oauth: config.oauth ? {
        github: {
          enabled: config.oauth.github?.enabled ?? true,
          clientId: config.oauth.github?.clientId ?? process.env.GITHUB_CLIENT_ID ?? '',
          clientSecret: config.oauth.github?.clientSecret ?? process.env.GITHUB_CLIENT_SECRET ?? '',
          callbackUrl: config.oauth.github?.callbackUrl ?? `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/auth/oauth/github/callback`,
          scope: config.oauth.github?.scope ?? ['read:user', 'user:email'],
        },
      } : undefined,
      sms: config.sms ? {
        aliyun: {
          accessKeyId: process.env.ALIYUN_SMS_ACCESS_KEY_ID ?? '',
          accessKeySecret: process.env.ALIYUN_SMS_ACCESS_KEY_SECRET ?? '',
          signName: process.env.ALIYUN_SMS_SIGN_NAME ?? '',
          templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE ?? '',
        },
        code: {
          length: 6,
          ttlSeconds: 300,
        },
      } : undefined,
    };
  } catch {
    return getDefaultConfig();
  }
}

function getDefaultConfig(): AppConfig {
  return {
    jwt: {
      accessToken: { expiresIn: '1h' },
      refreshToken: { expiresIn: '7d' },
    },
    rateLimit: {
      windowMs: 900000,
      max: 5,
    },
    oauth: {
      github: {
        enabled: true,
        clientId: process.env.GITHUB_CLIENT_ID ?? '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
        callbackUrl: `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/auth/oauth/github/callback`,
        scope: ['read:user', 'user:email'],
      },
    },
  };
}

// Validate required environment variables
function validateEnv(): void {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  if (jwtSecret.length < JWT_SECRET_MIN_LENGTH) {
    throw new Error(
      `JWT_SECRET must be at least ${JWT_SECRET_MIN_LENGTH} characters long`
    );
  }
}

// Load configuration
validateEnv();
const configFile = loadConfigFile();

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessToken: {
      expiresIn: configFile.jwt.accessToken?.expiresIn ?? '1h',
    },
    refreshToken: {
      expiresIn: configFile.jwt.refreshToken?.expiresIn ?? '7d',
    },
  },
  database: {
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/nova_core',
  },
  rateLimit: {
    windowMs: configFile.rateLimit.windowMs,
    max: configFile.rateLimit.max,
  },
  oauth: {
    github: {
      enabled: configFile.oauth?.github?.enabled ?? true,
      clientId: configFile.oauth?.github?.clientId ?? process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: configFile.oauth?.github?.clientSecret ?? process.env.GITHUB_CLIENT_SECRET ?? '',
      callbackUrl: configFile.oauth?.github?.callbackUrl ?? `${process.env.API_BASE_URL ?? 'http://localhost:3000'}/auth/oauth/github/callback`,
      scope: configFile.oauth?.github?.scope ?? ['read:user', 'user:email'],
    },
  },
  sms: configFile.sms ? {
    aliyun: {
      accessKeyId: process.env.ALIYUN_SMS_ACCESS_KEY_ID ?? '',
      accessKeySecret: process.env.ALIYUN_SMS_ACCESS_KEY_SECRET ?? '',
      signName: process.env.ALIYUN_SMS_SIGN_NAME ?? '',
      templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE ?? '',
    },
    code: {
      length: 6,
      ttlSeconds: 300,
    },
  } : undefined,
  env: process.env.NODE_ENV ?? 'development',
} as const;

export type Config = typeof config;
