import { useState, useEffect } from 'react';
import type { User } from '../types';

// Default user for the app (no authentication needed)
const DEFAULT_USER: User = {
  id: 'fec18839-8366-4317-b674-1b04a4a9b8bd',
  email: 'user@tripplanner.com',
  created_at: new Date().toISOString(),
  last_login: new Date().toISOString()
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [loading, setLoading] = useState(false);

  // No authentication needed - user is always logged in
  useEffect(() => {
    setUser(DEFAULT_USER);
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    signOut: () => Promise.resolve({ error: null })
  };
};