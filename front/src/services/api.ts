import { AuthClient } from 'nova-auth-sdk';

// Create singleton instance
export const authClient = new AuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  storage: 'localStorage',
});
