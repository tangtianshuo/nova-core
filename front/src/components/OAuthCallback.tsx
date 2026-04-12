import { useEffect, useState } from 'react';

export function OAuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('处理登录中...');

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`登录失败: ${error}`);
        setTimeout(() => window.location.replace('/auth'), 3000);
        return;
      }

      if (!accessToken || !refreshToken) {
        setStatus('error');
        setMessage('未收到登录令牌');
        setTimeout(() => window.location.replace('/auth'), 3000);
        return;
      }

      try {
        // Store tokens using the SDK's token manager
        const { authClient } = await import('../services/api');
        await authClient.setToken(accessToken);
        await authClient.setRefreshToken(refreshToken);

        setStatus('success');
        setMessage('登录成功！正在跳转...');

        setTimeout(() => window.location.replace('/auth'), 1500);
      } catch (err) {
        setStatus('error');
        setMessage('保存登录信息失败');
        setTimeout(() => window.location.replace('/auth'), 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="oauth-callback-container">
      <div className="oauth-callback-card">
        {status === 'loading' && (
          <>
            <div className="spinner"></div>
            <p>{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <p className="success-text">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <p className="error-text">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
