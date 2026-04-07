import { useState } from 'react';

interface OAuthLoginButtonProps {
  provider: 'github' | 'wechat';
  onLoginStart: () => void;
  onLoginSuccess: () => void;
  onLoginError: (error: string) => void;
  disabled?: boolean;
}

const PROVIDER_CONFIG = {
  github: {
    displayName: 'GitHub',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  wechat: {
    displayName: '微信',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
      </svg>
    ),
  },
};

export function OAuthLoginButton({
  provider,
  onLoginStart,
  onLoginSuccess,
  onLoginError,
  disabled = false,
}: OAuthLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const config = PROVIDER_CONFIG[provider];

  const handleOAuthLogin = async () => {
    setLoading(true);
    onLoginStart();

    try {
      // Get OAuth URL from SDK
      // Note: In a real implementation, you would call authClient.getOAuthUrl(provider)
      // For now, we'll redirect to the backend endpoint directly
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const redirectUrl = window.location.origin + '/login/oauth/callback';
      const authUrl = `${backendUrl}/auth/oauth/${provider}/login?redirect_uri=${encodeURIComponent(redirectUrl)}`;

      // Store state to verify callback
      const state = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_provider', provider);

      // Redirect to OAuth provider
      window.location.href = authUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OAuth login failed';
      onLoginError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleOAuthLogin}
      disabled={disabled || loading}
      className={`oauth-button oauth-button-${provider}`}
      type="button"
    >
      <span className="oauth-icon">{config.icon}</span>
      <span className="oauth-text">
        {loading ? '登录中...' : `使用 ${config.displayName} 登录`}
      </span>
    </button>
  );
}
