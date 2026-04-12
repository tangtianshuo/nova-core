import { useState, useEffect, useCallback } from 'react';
import { authClient } from '../services/api';
import type { AuthState, LinkedAccountsResponse, SmsStatsResponse } from 'nova-auth-sdk';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccountsResponse | null>(null);
  const [smsStats, setSmsStats] = useState<SmsStatsResponse | null>(null);
  const [smsCodeSent, setSmsCodeSent] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const state = await authClient.getAuthState();
        setAuthState(state);

        // Load linked accounts if authenticated
        if (state.isAuthenticated) {
          try {
            const accounts = await authClient.getLinkedAccounts();
            setLinkedAccounts(accounts);
          } catch {
            // Ignore error if endpoint not available
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setAuthState({
          isAuthenticated: false,
          token: null,
          user: null,
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setError(null);
    try {
      const result = await authClient.login({ username, password });
      setAuthState({
        isAuthenticated: true,
        token: result.accessToken,
        user: null, // Will be fetched on validate
      });

      // Fetch user info
      const validation = await authClient.validateToken();
      setAuthState({
        isAuthenticated: true,
        token: result.accessToken,
        user: validation.user,
      });

      // Load linked accounts
      try {
        const accounts = await authClient.getLinkedAccounts();
        setLinkedAccounts(accounts);
      } catch {
        // Ignore error if endpoint not available
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setError(null);
    try {
      const result = await authClient.register({ username, email, password });
      setAuthState({
        isAuthenticated: true,
        token: result.accessToken,
        user: {
          userId: result.user.id,
          username: result.user.username,
        },
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await authClient.logout();
      setAuthState({
        isAuthenticated: false,
        token: null,
        user: null,
      });
      setLinkedAccounts(null);
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const validateToken = useCallback(async () => {
    setError(null);
    try {
      const result = await authClient.validateToken();
      setAuthState((prev) => ({
        ...prev,
        user: result.user,
      }));
      return result;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Validation failed';
      setError(errorMessage);

      // Clear auth state on validation failure
      setAuthState({
        isAuthenticated: false,
        token: null,
        user: null,
      });

      throw err;
    }
  }, []);

  // OAuth methods
  const getOAuthUrl = useCallback(async (provider: string) => {
    setError(null);
    try {
      return await authClient.getOAuthUrl(provider);
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Failed to get OAuth URL';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const linkOAuthAccount = useCallback(async (provider: string, code: string, state: string) => {
    setError(null);
    try {
      const result = await authClient.linkOAuthAccount(provider, code, state);

      // Refresh linked accounts
      const accounts = await authClient.getLinkedAccounts();
      setLinkedAccounts(accounts);

      return result;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Failed to link account';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const unlinkOAuthAccount = useCallback(async (provider: string) => {
    setError(null);
    try {
      const result = await authClient.unlinkOAuthAccount(provider);

      // Refresh linked accounts
      const accounts = await authClient.getLinkedAccounts();
      setLinkedAccounts(accounts);

      return result;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Failed to unlink account';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const refreshLinkedAccounts = useCallback(async () => {
    if (authState.isAuthenticated) {
      try {
        const accounts = await authClient.getLinkedAccounts();
        setLinkedAccounts(accounts);
      } catch (err) {
        console.error('Failed to refresh linked accounts:', err);
      }
    }
  }, [authState.isAuthenticated]);

  // SMS methods
  const sendSmsCode = useCallback(async (phone: string, type: 'login' | 'register') => {
    setError(null);
    try {
      const result = await authClient.sendSmsCode(phone, type);
      setSmsCodeSent(true);
      // Auto-reset smsCodeSent after 5 seconds
      setTimeout(() => setSmsCodeSent(false), 5000);
      return result;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Failed to send SMS code';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const smsLogin = useCallback(async (phone: string, code: string) => {
    setError(null);
    try {
      const result = await authClient.smsLogin(phone, code);
      setAuthState({
        isAuthenticated: true,
        token: result.accessToken,
        user: null, // Will be fetched on validate
      });

      // Fetch user info
      const validation = await authClient.validateToken();
      setAuthState({
        isAuthenticated: true,
        token: result.accessToken,
        user: validation.user,
      });

      // Load linked accounts
      try {
        const accounts = await authClient.getLinkedAccounts();
        setLinkedAccounts(accounts);
      } catch {
        // Ignore error if endpoint not available
      }

      return result;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'SMS login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const smsRegister = useCallback(async (phone: string, code: string, username: string) => {
    setError(null);
    try {
      const result = await authClient.smsRegister(phone, code, username);
      setAuthState({
        isAuthenticated: true,
        token: result.accessToken,
        user: {
          userId: result.user.id,
          username: result.user.username,
        },
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'SMS registration failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getSmsStats = useCallback(async (phone: string) => {
    setError(null);
    try {
      const stats = await authClient.getSmsStats(phone);
      setSmsStats(stats);
      return stats;
    } catch (err: any) {
      const errorMessage = err.apiMessage || err.message || 'Failed to get SMS stats';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    ...authState,
    loading,
    error,
    linkedAccounts,
    smsStats,
    smsCodeSent,
    login,
    register,
    logout,
    validateToken,
    getOAuthUrl,
    linkOAuthAccount,
    unlinkOAuthAccount,
    refreshLinkedAccounts,
    sendSmsCode,
    smsLogin,
    smsRegister,
    getSmsStats,
    clearError: () => setError(null),
  };
}
