import { useState, FormEvent } from 'react';

interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
  loading?: boolean;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSubmit, loading = false, onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    if (password.length < 8) {
      alert('密码至少需要 8 个字符');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(username, email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>注册 Nova 账号</h2>

        <div className="form-group">
          <label htmlFor="reg-username">用户名</label>
          <input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="3-20个字符，字母/数字/下划线/连字符"
            disabled={loading || submitting}
            autoComplete="username"
            required
            minLength={3}
            maxLength={20}
            pattern="^[a-zA-Z0-9_-]{3,20}$"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">邮箱</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading || submitting}
            autoComplete="email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">密码</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少8个字符，包含大小写字母或数字"
            disabled={loading || submitting}
            autoComplete="new-password"
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm-password">确认密码</label>
          <input
            id="reg-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="再次输入密码"
            disabled={loading || submitting}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || submitting || !username.trim() || !email.trim() || !password.trim() || password !== confirmPassword}
            className="submit-button"
          >
            {submitting ? '注册中...' : '注册'}
          </button>
        </div>

        <div className="form-switch">
          <span className="form-switch-text">已有账号？</span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            disabled={loading || submitting}
            className="switch-button"
          >
            去登录
          </button>
        </div>
      </form>
    </div>
  );
}
