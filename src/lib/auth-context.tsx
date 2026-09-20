import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);

export type AuthUserRole = "customer" | "admin";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  role: AuthUserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ user: User | null; error: string | null }>;
  signUp: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function resolveRole(user: User | null): AuthUserRole {
  if (!user) return "customer";
  const metadataRole =
    typeof user.user_metadata?.role === "string"
      ? user.user_metadata.role
      : null;
  if (metadataRole === "admin") return "admin";
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))
    return "admin";
  return "customer";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!error) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    void loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!mounted) return;
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { user: null, error: error.message };
    setSession(data.session);
    setUser(data.user);
    return { user: data.user, error: null };
  }, []);

  const signUp = useCallback(
    async ({
      firstName,
      lastName,
      email,
      phone,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            role: "customer",
          },
        },
      });

      if (error) return { user: null, error: error.message };
      setSession(data.session);
      setUser(data.user);
      return { user: data.user, error: null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  const role = useMemo(() => resolveRole(user), [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      role,
      isAuthenticated: !!user,
      isAdmin: role === "admin",
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, user, role, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
