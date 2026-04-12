import { useState } from 'react';

interface LinkedAccountsProps {
  accounts: Array<{
    provider: string;
    providerId: string;
    connectedAt: string;
  }>;
  onUnlink: (provider: string) => Promise<void>;
}

const PROVIDER_NAMES: Record<string, string> = {
  github: 'GitHub',
  wechat: '微信',
  google: 'Google',
};

export function LinkedAccounts({ accounts, onUnlink }: LinkedAccountsProps) {
  const [unlinking, setUnlinking] = useState<string | null>(null);

  const handleUnlink = async (provider: string) => {
    setUnlinking(provider);
    try {
      await onUnlink(provider);
    } finally {
      setUnlinking(null);
    }
  };

  return (
    <div className="linked-accounts">
      <h3>已绑定账号</h3>

      {accounts.length === 0 ? (
        <p className="no-accounts">暂无绑定的第三方账号</p>
      ) : (
        <div className="accounts-list">
          {accounts.map((account) => (
            <div key={account.provider} className="account-item">
              <div className="account-info">
                <span className="account-provider">
                  {PROVIDER_NAMES[account.provider] || account.provider}
                </span>
                <span className="account-date">
                  {new Date(account.connectedAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <button
                onClick={() => handleUnlink(account.provider)}
                disabled={unlinking === account.provider}
                className="unlink-button"
              >
                {unlinking === account.provider ? '解绑中...' : '解绑'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
