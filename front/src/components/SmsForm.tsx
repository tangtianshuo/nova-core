import { useState, FormEvent, useEffect } from 'react';

interface SmsFormProps {
  onSubmit: (phone: string, code: string, username?: string) => Promise<void>;
  onSendCode: (phone: string, type: 'login' | 'register') => Promise<void>;
  loading?: boolean;
  onSwitchToLogin?: () => void;
}

type SmsMode = 'login' | 'register';

export function SmsForm({ onSubmit, onSendCode, loading = false, onSwitchToLogin }: SmsFormProps) {
  const [mode, setMode] = useState<SmsMode>('login');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  // 手机号格式验证
  const isValidPhone = /^1[3-9]\d{9}$/.test(phone);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (!isValidPhone) {
      setFormError('请输入有效的手机号码');
      return;
    }

    setFormError(null);
    setSendingCode(true);

    try {
      await onSendCode(phone, mode);
      // 开始60秒倒计时
      setCountdown(60);
    } catch (err: any) {
      setFormError(err.message || '发送验证码失败');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidPhone) {
      setFormError('请输入有效的手机号码');
      return;
    }

    if (!code.trim()) {
      setFormError('请输入验证码');
      return;
    }

    if (mode === 'register' && !username.trim()) {
      setFormError('请输入用户名');
      return;
    }

    if (mode === 'register' && !/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
      setFormError('用户名格式无效（3-20个字符，仅限字母、数字、下划线、连字符）');
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await onSubmit(phone, code);
      } else {
        await onSubmit(phone, code, username);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (newMode: SmsMode) => {
    setMode(newMode);
    setFormError(null);
    setCode('');
    setUsername('');
    setCountdown(0);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? '短信验证码登录' : '短信验证码注册'}</h2>

        {/* 模式切换 */}
        <div className="form-switch-inline">
          <button
            type="button"
            onClick={() => switchMode('login')}
            disabled={loading || submitting}
            className={`mode-switch-button ${mode === 'login' ? 'active' : ''}`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            disabled={loading || submitting}
            className={`mode-switch-button ${mode === 'register' ? 'active' : ''}`}
          >
            注册
          </button>
        </div>

        {formError && (
          <div className="error-message-inline">
            {formError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="phone">手机号</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="请输入手机号"
            disabled={loading || submitting}
            autoComplete="tel"
            maxLength={11}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="code">验证码</label>
          <div className="code-input-group">
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="请输入验证码"
              disabled={loading || submitting}
              autoComplete="one-time-code"
              maxLength={6}
              required
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || submitting || sendingCode || countdown > 0 || !isValidPhone}
              className="send-code-button"
            >
              {countdown > 0 ? `${countdown}秒后重试` : sendingCode ? '发送中...' : '发送验证码'}
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名（3-20个字符）"
              disabled={loading || submitting}
              autoComplete="username"
              maxLength={20}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || submitting || !phone.trim() || !code.trim() || (mode === 'register' && !username.trim())}
          className="submit-button"
        >
          {submitting ? (mode === 'login' ? '登录中...' : '注册中...') : (mode === 'login' ? '登录' : '注册')}
        </button>

        <div className="form-switch">
          <span className="form-switch-text">
            {mode === 'login' ? '使用密码登录？' : '已有账号？'}
          </span>
          {onSwitchToLogin && (
            <button
              type="button"
              onClick={onSwitchToLogin}
              disabled={loading || submitting}
              className="switch-button"
            >
              {mode === 'login' ? '密码登录' : '去登录'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
