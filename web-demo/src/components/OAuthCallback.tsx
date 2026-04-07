import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function OAuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('处理登录中...');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const userId = searchParams.get('user_id');
      const username = searchParams.get('username');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`登录失败: ${error}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!accessToken || !refreshToken) {
        setStatus('error');
        setMessage('未收到登录令牌');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Store tokens using the SDK's token manager
        const { authClient } = await import('../services/api');
        await authClient.setToken(accessToken);
        await authClient.setRefreshToken(refreshToken);

        setStatus('success');
        setMessage('登录成功！正在跳转...');

        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        setStatus('error');
        setMessage('保存登录信息失败');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

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
