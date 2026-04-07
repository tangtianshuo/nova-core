import { useState, useEffect } from 'react';
import { useAuth } from './hooks';
import { LoginForm, RegisterForm, UserInfo, ErrorMessage, LinkedAccounts } from './components';

import './index.css';

type AuthMode = 'login' | 'register';

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [oauthCallbackHandled, setOAuthCallbackHandled] = useState(false);
  const {
    isAuthenticated,
    token,
    user,
    loading,
    error,
    linkedAccounts,
    login,
    register,
    logout,
    validateToken,
    clearError,
    unlinkOAuthAccount,
  } = useAuth();

  // Handle OAuth callback
  useEffect(() => {
    if (oauthCallbackHandled) return;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const callbackError = params.get('error');

    (async () => {
      if (callbackError) {
        console.error('OAuth error:', callbackError);
        setOAuthCallbackHandled(true);
        return;
      }

      if (accessToken && refreshToken) {
        try {
          const { authClient } = await import('./services/api');
          await authClient.setToken(accessToken);
          await authClient.setRefreshToken(refreshToken);

          // Refresh auth state
          await authClient.validateToken();
          // Trigger a page reload to refresh the auth state
          window.location.reload();
        } catch (err) {
          console.error('Failed to store OAuth tokens:', err);
        }
        return;
      }

      setOAuthCallbackHandled(true);
    })();
  }, [oauthCallbackHandled]);

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    await register(username, email, password);
  };

  const handleValidate = async () => {
    await validateToken();
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleUnlinkAccount = async (provider: string) => {
    await unlinkOAuthAccount(provider);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Nova 认证演示</h1>
        <p className="subtitle">TypeScript SDK + React 演示</p>
      </header>

      {error && (
        <ErrorMessage
          message={error}
          onDismiss={clearError}
        />
      )}

      <main className="app-main">
        {!isAuthenticated ? (
          <>
            {authMode === 'login' ? (
              <LoginForm
                onSubmit={handleLogin}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <RegisterForm
                onSubmit={handleRegister}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
          </>
        ) : (
          <UserInfo
            user={user}
            token={token}
            linkedAccounts={linkedAccounts}
            onValidate={handleValidate}
            onLogout={handleLogout}
            onUnlinkAccount={handleUnlinkAccount}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>基于 Nova Auth SDK 构建 • React • TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
