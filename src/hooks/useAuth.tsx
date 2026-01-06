import { useState, useEffect, useCallback, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const adminTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const adminLoginTimeRef = useRef<number | null>(null);

  const clearAdminTimeout = useCallback(() => {
    if (adminTimeoutRef.current) {
      clearTimeout(adminTimeoutRef.current);
      adminTimeoutRef.current = null;
    }
    adminLoginTimeRef.current = null;
    localStorage.removeItem('admin_login_time');
  }, []);

  const autoLogoutAdmin = useCallback(async () => {
    toast.warning("Session admin expirée. Déconnexion automatique.");
    clearAdminTimeout();
    await supabase.auth.signOut();
  }, [clearAdminTimeout]);

  const startAdminTimeout = useCallback((remainingTime?: number) => {
    clearAdminTimeout();
    
    const timeout = remainingTime ?? ADMIN_SESSION_TIMEOUT;
    adminLoginTimeRef.current = Date.now();
    localStorage.setItem('admin_login_time', adminLoginTimeRef.current.toString());
    
    adminTimeoutRef.current = setTimeout(() => {
      autoLogoutAdmin();
    }, timeout);
  }, [clearAdminTimeout, autoLogoutAdmin]);

  // Check for existing admin session timeout on mount
  useEffect(() => {
    const storedLoginTime = localStorage.getItem('admin_login_time');
    if (storedLoginTime && isAdmin) {
      const loginTime = parseInt(storedLoginTime, 10);
      const elapsed = Date.now() - loginTime;
      const remaining = ADMIN_SESSION_TIMEOUT - elapsed;
      
      if (remaining <= 0) {
        autoLogoutAdmin();
      } else {
        startAdminTimeout(remaining);
      }
    }
  }, [isAdmin, autoLogoutAdmin, startAdminTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearAdminTimeout();
    };
  }, [clearAdminTimeout]);

  const clearInvalidSession = useCallback(async () => {
    // Clear all Supabase-related localStorage items
    const keysToRemove = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') || key === 'admin_login_time'
    );
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setAdminChecked(true);
    setLoading(false);
    clearAdminTimeout();
  }, [clearAdminTimeout]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin role when session changes
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setAdminChecked(true);
          clearAdminTimeout();
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      // Handle invalid session error
      if (error?.code === 'session_not_found' || error?.message?.includes('session_not_found')) {
        console.warn('Session invalide détectée, nettoyage...');
        await clearInvalidSession();
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setAdminChecked(true);
      }
      setLoading(false);
    }).catch(async (error) => {
      // Catch any unexpected errors and clear invalid session
      console.warn('Erreur de session:', error);
      await clearInvalidSession();
    });

    return () => subscription.unsubscribe();
  }, [clearAdminTimeout, clearInvalidSession]);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .single();

      if (!error && data) {
        setIsAdmin(true);
        // Start timeout for admin users
        const storedLoginTime = localStorage.getItem('admin_login_time');
        if (!storedLoginTime) {
          startAdminTimeout();
        }
      } else {
        setIsAdmin(false);
        clearAdminTimeout();
      }
    } finally {
      setAdminChecked(true);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signOut = async () => {
    clearAdminTimeout();
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading: loading || !adminChecked,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
};
