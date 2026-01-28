import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Profile } from '../types';
import { Session } from '@supabase/supabase-js';
import { ENV, isSupabaseLinked } from '../lib/env';

interface AuthContextType {
  user: (User & { id?: string }) | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  error: string | null;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<(User & { id?: string }) | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchProfile = useCallback(async (userId: string, email: string) => {
    if (!isSupabaseLinked()) return;

    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (data) {
        const profile = data as Profile;
        
        // REGLA DE NEGOCIO: GOD_MODE para el dueño o cualquier admin
        const isGodAccount = email.toLowerCase() === 'ap@adalparedes.com';
        const finalIsAdmin = !!profile.is_admin || isGodAccount; // The final authority on admin status
        setIsAdmin(finalIsAdmin);
        
        const mappedUser: User & { id: string } = {
          id: profile.id,
          fullName: profile.full_name || '',
          email: email,
          username: profile.username,
          gender: profile.gender || 'other',
          ageRange: profile.age_range || '18-29',
          membership: finalIsAdmin ? 'ADMIN' : (profile.plan || 'free').toUpperCase(),
          balance: finalIsAdmin ? 9999 : (profile.credits || 0)
        };
        
        setUser(mappedUser);
        return mappedUser;
      }
    } catch (err: any) {
      console.warn("[Auth] Error fetching remote profile.");
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id, currentSession.user.email || '');
      }
    } catch (e) {
      console.warn("[Auth] Error en refreshProfile.");
    }
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const { data: { session: initialSession }, error: initError } = await supabase.auth.getSession();
        if (initError) throw initError;
        
        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            fetchProfile(initialSession.user.id, initialSession.user.email || '');
          }
          setIsLoading(false);
        }
      } catch (e) {
        if (mounted) setIsLoading(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (mounted) {
        setSession(newSession);
        if (newSession) {
          fetchProfile(newSession.user.id, newSession.user.email || '');
          setIsLoading(false);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const authValue = useMemo(() => ({
    user,
    session,
    isLoading,
    isAdmin,
    isGuest: !session,
    error,
    clearError,
    signUp: async (email: string, password: string, metadata: any) => {
      const { error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { 
          data: {
            ...metadata,
            plan: 'free',
            credits: 3 // Créditos iniciales Plan Piojoso
          }, 
          emailRedirectTo: ENV.SITE_URL 
        } 
      });
      if (signUpError) {
        setError(signUpError.message);
        throw signUpError;
      }
    },
    signIn: async (email: string, password: string) => {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        throw signInError;
      }
    },
    signOut: async () => {
      try {
        await supabase.auth.signOut();
      } finally {
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      }
    },
    refreshProfile,
    resetPassword: async (email: string) => {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) {
        setError(resetError.message);
        throw resetError;
      }
    }
  }), [user, session, isLoading, isAdmin, refreshProfile, error]);

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};