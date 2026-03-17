import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { CREDITS } from '../types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  });

  // Fetch or create profile — never throws, never hangs
  const fetchProfile = useCallback(async (user: User): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) return data as Profile;

      // Profile doesn't exist — create it (new signup)
      if (error && error.code === 'PGRST116') {
        const newProfile: Omit<Profile, 'created_at'> = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          credits: CREDITS.SIGNUP_BONUS,
          is_dev: false,
        };

        const { data: created, error: createErr } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createErr) {
          console.error('[Auth] Failed to create profile:', createErr);
          return null;
        }

        // Record the signup bonus transaction
        await supabase.from('credit_transactions').insert({
          user_id: user.id,
          amount: CREDITS.SIGNUP_BONUS,
          reason: `Bônus de boas-vindas (+${CREDITS.SIGNUP_BONUS} créditos de cadastro)`,
        });

        return created as Profile;
      }

      console.error('[Auth] Failed to fetch profile:', error);
      return null;
    } catch (err) {
      console.error('[Auth] fetchProfile exception:', err);
      return null;
    }
  }, []);

  // Initialize — check existing session
  useEffect(() => {
    let mounted = true;

    // Listen for auth changes FIRST — so we catch the OAuth callback token
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] Event:', event);

        if (event === 'SIGNED_OUT') {
          if (mounted) setState({ user: null, profile: null, session: null, loading: false });
          return;
        }

        if (session?.user) {
          if (mounted) {
            setState(prev => ({ ...prev, user: session.user, session, loading: false }));
          }
          const profile = await fetchProfile(session.user);
          if (mounted) {
            setState(prev => ({ ...prev, profile }));
          }
        } else if (event === 'TOKEN_REFRESHED' && !session) {
          // Refresh failed — force sign out
          console.warn('[Auth] Token refresh failed — signing out');
          await supabase.auth.signOut();
          if (mounted) setState({ user: null, profile: null, session: null, loading: false });
        }
      }
    );

    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] getSession error:', error);
          if (mounted) setState({ user: null, profile: null, session: null, loading: false });
          return;
        }

        if (session?.user) {
          // Validate the session is actually usable by checking token expiry
          const expiresAt = session.expires_at ?? 0;
          const now = Math.floor(Date.now() / 1000);

          if (expiresAt > 0 && expiresAt < now) {
            // Token expired — try to refresh
            console.log('[Auth] Session expired, refreshing...');
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

            if (refreshError || !refreshData.session) {
              console.warn('[Auth] Refresh failed — clearing stale session');
              await supabase.auth.signOut();
              if (mounted) setState({ user: null, profile: null, session: null, loading: false });
              return;
            }

            // refreshSession triggers onAuthStateChange, which will set state
            return;
          }

          // Valid session
          if (mounted) {
            setState({ user: session.user, profile: null, session, loading: false });
          }
          const profile = await fetchProfile(session.user);
          if (mounted) {
            setState(prev => ({ ...prev, profile }));
          }
        } else {
          if (mounted) setState({ user: null, profile: null, session: null, loading: false });
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
        if (mounted) setState({ user: null, profile: null, session: null, loading: false });
      }
    };

    init();

    // Safety timeout — absolute worst case, never loading forever
    const timeout = setTimeout(() => {
      if (mounted) {
        setState(prev => {
          if (prev.loading) {
            console.warn('[Auth] Safety timeout — forcing loading=false');
            return { ...prev, loading: false };
          }
          return prev;
        });
      }
    }, 4000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    return { error: error?.message || null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    return { error: error?.message || null };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[Auth] signOut error (forcing local cleanup):', err);
    }
    // Always clear local state, even if Supabase call fails
    setState({ user: null, profile: null, session: null, loading: false });
  };

  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user);
      setState(prev => ({ ...prev, profile }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
