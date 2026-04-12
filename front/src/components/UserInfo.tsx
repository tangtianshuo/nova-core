import type { UserInfo, LinkedAccountsResponse } from 'nova-auth-sdk';
import { LinkedAccounts } from './LinkedAccounts';

interface UserInfoProps {
  user: UserInfo | null;
  token: string | null;
  linkedAccounts: LinkedAccountsResponse | null;
  onValidate: () => Promise<void>;
  onLogout: () => Promise<void>;
  onUnlinkAccount: (provider: string) => Promise<void>;
  validating?: boolean;
}

export function UserInfo({
  user,
  token,
  linkedAccounts,
  onValidate,
  onLogout,
  onUnlinkAccount,
  validating = false
}: UserInfoProps) {
  return (
    <div className="user-info-container">
      <div className="user-card">
        <h2>欢迎, {user?.username || '用户'}!</h2>

        <div className="info-section">
          <h3>账户信息</h3>
          <div className="info-item">
            <span className="label">用户 ID:</span>
            <span className="value">{user?.userId || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">用户名:</span>
            <span className="value">{user?.username || 'N/A'}</span>
          </div>
        </div>

        {linkedAccounts && (
          <LinkedAccounts
            accounts={linkedAccounts.accounts}
            onUnlink={onUnlinkAccount}
          />
        )}

        <div className="info-section">
          <h3>令牌信息</h3>
          <div className="token-display">
            <span className="label">访问令牌:</span>
            <code className="token-value">
              {token ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}` : 'N/A'}
            </code>
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={onValidate}
            disabled={validating}
            className="validate-button"
          >
            {validating ? '验证中...' : '验证令牌'}
          </button>
          <button
            onClick={onLogout}
            className="logout-button"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}
