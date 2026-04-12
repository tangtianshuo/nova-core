import { useEffect, useState } from 'react';
import { ErrorMessage, LoginForm, RegisterForm, SmsForm, UserInfo } from '../components';
import { useAuth } from '../hooks';

type AuthMode = 'login' | 'register' | 'sms';

export default function AuthDemo() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [oauthCallbackHandled, setOAuthCallbackHandled] = useState(false);
  const {
    isAuthenticated,
    token,
    user,
    loading,
    error,
    linkedAccounts,
    smsStats,
    smsCodeSent,
    login,
    register,
    logout,
    validateToken,
    sendSmsCode,
    smsLogin,
    smsRegister,
    getSmsStats,
    clearError,
    unlinkOAuthAccount,
  } = useAuth();

  useEffect(() => {
    if (oauthCallbackHandled) return;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const callbackError = params.get('error');

    (async () => {
      if (callbackError) {
        setOAuthCallbackHandled(true);
        return;
      }

      if (accessToken && refreshToken) {
        try {
          const { authClient } = await import('../services/api');
          await authClient.setToken(accessToken);
          await authClient.setRefreshToken(refreshToken);
          await authClient.validateToken();
          window.location.reload();
        } catch {
        }
        return;
      }

      setOAuthCallbackHandled(true);
    })();
  }, [oauthCallbackHandled]);

  if (loading) {
    return (
      <div className="auth-demo">
        <div className="app-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-demo">
      <div className="app-container">
        <header className="app-header">
          <h1>Nova 认证演示</h1>
          <p className="subtitle">TypeScript SDK + React 演示</p>
        </header>

        {error && <ErrorMessage message={error} onDismiss={clearError} />}

        <main className="app-main">
          {!isAuthenticated ? (
            <>
              {authMode === 'login' ? (
                <LoginForm
                  onSubmit={async (username, password) => {
                    await login(username, password);
                  }}
                  onSwitchToRegister={() => setAuthMode('register')}
                  onSwitchToSms={() => setAuthMode('sms')}
                />
              ) : authMode === 'register' ? (
                <RegisterForm
                  onSubmit={async (username, email, password) => {
                    await register(username, email, password);
                  }}
                  onSwitchToLogin={() => setAuthMode('login')}
                />
              ) : (
                <SmsForm
                  onSubmit={async (phone, code, username) => {
                    if (username) {
                      await smsRegister(phone, code, username);
                    } else {
                      await smsLogin(phone, code);
                    }
                  }}
                  onSendCode={async (phone, type) => {
                    await sendSmsCode(phone, type);
                    await getSmsStats(phone);
                  }}
                  onSwitchToLogin={() => setAuthMode('login')}
                />
              )}

              {smsCodeSent && smsStats && (
                <div className="sms-stats-info">
                  <p>验证码已发送</p>
                  <p className="sms-stats-detail">今日已发送: {smsStats.todaySendCount} 次</p>
                </div>
              )}
            </>
          ) : (
            <UserInfo
              user={user}
              token={token}
              linkedAccounts={linkedAccounts}
              onValidate={async () => {
                await validateToken();
              }}
              onLogout={logout}
              onUnlinkAccount={async (provider) => {
                await unlinkOAuthAccount(provider);
              }}
            />
          )}
        </main>

        <footer className="app-footer">
          <p>基于 Nova Auth SDK 构建 • React • TypeScript</p>
        </footer>
      </div>
    </div>
  );
}

