import { useEffect } from 'react';

interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissAfter?: number;
}

export function ErrorMessage({
  message,
  onDismiss,
  autoDismiss = true,
  dismissAfter = 5000,
}: ErrorMessageProps) {
  useEffect(() => {
    if (message && autoDismiss && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, dismissAfter);

      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, dismissAfter, onDismiss]);

  if (!message) {
    return null;
  }

  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{message}</span>
      {onDismiss && (
        <button
          className="error-dismiss"
          onClick={onDismiss}
          aria-label="关闭错误"
        >
          ×
        </button>
      )}
    </div>
  );
}
