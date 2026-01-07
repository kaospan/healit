import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, Session, UserRole } from '@/types';
import { logAuditEvent } from '@/lib/audit/logger';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  isDoctor: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isPatient: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Authentication Provider for Healit
 * 
 * @description Manages user authentication and role-based access
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser(data as User);
      
      // Get session
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        setSession({
          user: data as User,
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_at: sessionData.session.expires_at || 0,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await loadUserProfile(data.user.id);
      
      await logAuditEvent({
        userId: data.user.id,
        actionType: 'sign_in',
        resourceType: 'session',
        resourceId: data.session?.access_token || '',
        details: { email },
      });
    }
  }

  async function signUp(email: string, password: string, fullName: string, role: UserRole) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        language: 'he', // Default Hebrew
      });

      if (profileError) throw profileError;

      await logAuditEvent({
        userId: data.user.id,
        actionType: 'sign_up',
        resourceType: 'user',
        resourceId: data.user.id,
        details: { email, role },
      });
    }
  }

  async function signOut() {
    const userId = user?.id;
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    if (userId) {
      await logAuditEvent({
        userId,
        actionType: 'sign_out',
        resourceType: 'session',
        resourceId: session?.access_token || '',
        details: {},
      });
    }

    setUser(null);
    setSession(null);
  }

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isDoctor: user?.role === UserRole.DOCTOR,
    isStaff: user?.role === UserRole.STAFF,
    isAdmin: user?.role === UserRole.ADMIN,
    isPatient: user?.role === UserRole.PATIENT,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
