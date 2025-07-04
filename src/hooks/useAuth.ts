import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

// Guest user for demo purposes
const GUEST_USER: User = {
  id: 'guest',
  email: 'guest@example.com',
  created_at: new Date().toISOString(),
  last_login: new Date().toISOString()
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if user chose guest mode
    const guestMode = localStorage.getItem('guestMode');
    if (guestMode === 'true') {
      setUser(GUEST_USER);
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        created_at: session.user.created_at,
        last_login: session.user.last_sign_in_at
      } : null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ? {
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at,
          last_login: session.user.last_sign_in_at
        } : null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const continueAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    setUser(GUEST_USER);
    setIsGuest(true);
    return { error: null };
  };

  const signInWithEmail = async (email: string, password: string) => {
    // Clear guest mode when signing in
    localStorage.removeItem('guestMode');
    setIsGuest(false);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    // Clear guest mode when signing up
    localStorage.removeItem('guestMode');
    setIsGuest(false);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  const signOut = async () => {
    if (isGuest) {
      localStorage.removeItem('guestMode');
      setUser(null);
      setIsGuest(false);
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    isGuest,
    loading,
    continueAsGuest,
    signInWithEmail,
    signUpWithEmail,
    signOut
  };
};