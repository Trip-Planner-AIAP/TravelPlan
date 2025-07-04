import { useState, useEffect } from 'react';
import type { User } from '../types';

// Default user for the app (no authentication needed)
const DEFAULT_USER: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
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