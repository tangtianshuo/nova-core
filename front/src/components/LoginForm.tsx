import { useState, FormEvent } from 'react';
import { OAuthLoginButton } from './OAuthLoginButton';

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  loading?: boolean;
  onSwitchToRegister?: () => void;
  onSwitchToSms?: () => void;
}

export function LoginForm({ onSubmit, loading = false, onSwitchToRegister, onSwitchToSms }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(username, password);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuthLoginStart = () => {
    // OAuth login is redirecting to provider
  };

  const handleOAuthLoginError = (error: string) => {
    console.error('OAuth login error:', error);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>登录 Nova</h2>

        <div className="form-group">
          <label htmlFor="username">用户名或邮箱</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名或邮箱"
            disabled={loading || submitting}
            autoComplete="username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            disabled={loading || submitting}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || submitting || !username.trim() || !password.trim()}
          className="submit-button"
        >
          {submitting ? '登录中...' : '登录'}
        </button>

        {/* OAuth Divider */}
        <div className="oauth-divider">
          <div className="oauth-divider-line"></div>
          <span className="oauth-divider-text">或</span>
          <div className="oauth-divider-line"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="oauth-buttons">
          <OAuthLoginButton
            provider="github"
            onLoginStart={handleOAuthLoginStart}
            onLoginError={handleOAuthLoginError}
            disabled={loading || submitting}
          />
        </div>

        {onSwitchToRegister && (
          <div className="form-switch">
            <span className="form-switch-text">还没有账号？</span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              disabled={loading || submitting}
              className="switch-button"
            >
              去注册
            </button>
          </div>
        )}

        {onSwitchToSms && (
          <div className="form-switch">
            <button
              type="button"
              onClick={onSwitchToSms}
              disabled={loading || submitting}
              className="switch-button link-button"
            >
              使用短信验证码登录
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
