import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);

const USERS_STORAGE_KEY = "head-spa-auth-users-v1";
const SESSION_STORAGE_KEY = "head-spa-auth-session-v1";
const RESERVATIONS_STORAGE_KEY = "head-spa-reservations-v1";
const VOUCHERS_STORAGE_KEY = "head-spa-vouchers-v1";

export type AuthUserRole = "customer" | "admin";

export type ReservationRecord = {
  id: string;
  customer_name: string;
  email: string;
  phone?: string;
  service_id: string;
  preferred_time: string;
  amount_czk: number;
  status: string;
  payment_session_id: string | null;
  created_at: string;
  therapist?: string;
  gift_voucher?: boolean;
  gift_voucher_number?: string | null;
};

export type VoucherRecord = {
  id: string;
  voucher_kind: "procedure" | "amount";
  service_id: string | null;
  amount_czk: number;
  customer_name: string;
  phone: string;
  email: string;
  delivery_type: string;
  status: string;
  payment_session_id: string | null;
  created_at: string;
};

type LocalAuthUser = {
  id: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: AuthUserRole;
  user_metadata?: {
    role?: AuthUserRole;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
};

type LocalSession = {
  user: LocalAuthUser;
};

type AuthContextValue = {
  session: LocalSession | null;
  user: LocalAuthUser | null;
  role: AuthUserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: LocalAuthUser | null; error: string | null }>;
  signUp: (payload: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<{ user: LocalAuthUser | null; error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function safeReadUsers(): LocalAuthUser[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalAuthUser[]) : [];
  } catch {
    return [];
  }
}

function safeWriteUsers(users: LocalAuthUser[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

function getAdminRole(email: string): AuthUserRole {
  return ADMIN_EMAILS.includes(normalizeEmail(email)) ? "admin" : "customer";
}

function resolveRole(user: LocalAuthUser | null): AuthUserRole {
  if (!user) return "customer";
  if (user.role === "admin") return "admin";
  if (user.user_metadata?.role === "admin") return "admin";
  if (user.email && ADMIN_EMAILS.includes(normalizeEmail(user.email))) return "admin";
  return "customer";
}

function readStorageList<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorageList<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function readReservations(): ReservationRecord[] {
  const fallback: ReservationRecord[] = [];
  return readStorageList(RESERVATIONS_STORAGE_KEY, fallback);
}

export function addReservation(input: Omit<ReservationRecord, "id" | "created_at">): ReservationRecord {
  const next: ReservationRecord = {
    ...input,
    id: `reservation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };

  const items = readReservations();
  writeStorageList(RESERVATIONS_STORAGE_KEY, [...items, next]);
  return next;
}

export function readVoucherOrders(): VoucherRecord[] {
  const fallback: VoucherRecord[] = [];
  return readStorageList(VOUCHERS_STORAGE_KEY, fallback);
}

export function addVoucherOrder(input: Omit<VoucherRecord, "id" | "created_at">): VoucherRecord {
  const next: VoucherRecord = {
    ...input,
    id: `voucher-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    status: input.status ?? "pending_payment",
    payment_session_id: input.payment_session_id ?? null,
  };

  const items = readVoucherOrders();
  writeStorageList(VOUCHERS_STORAGE_KEY, [...items, next]);
  return next;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LocalSession | null>(null);
  const [user, setUser] = useState<LocalAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (rawSession) {
        const parsed = JSON.parse(rawSession) as LocalSession;
        if (parsed?.user?.email) {
          setSession(parsed);
          setUser(parsed.user);
        }
      }
    } catch {
      // ignore invalid session
    }

    setLoading(false);
  }, []);

  const persistSession = useCallback((nextUser: LocalAuthUser | null) => {
    if (typeof window === "undefined") return;

    if (!nextUser) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      setSession(null);
      setUser(null);
      return;
    }

    const nextSession: LocalSession = { user: nextUser };
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setUser(nextUser);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const users = safeReadUsers();
    const normalizedEmail = normalizeEmail(email);
    const match = users.find((entry) => normalizeEmail(entry.email) === normalizedEmail);

    if (!match) return { user: null, error: "No account found with that email." };
    if (match.password !== password) return { user: null, error: "Incorrect password." };

    const nextUser: LocalAuthUser = {
      ...match,
      role: resolveRole(match),
      user_metadata: {
        role: resolveRole(match),
        first_name: match.first_name,
        last_name: match.last_name,
        phone: match.phone,
      },
    };

    persistSession(nextUser);
    return { user: nextUser, error: null };
  }, [persistSession]);

  const signUp = useCallback(async ({ firstName, lastName, email, phone, password }: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const users = safeReadUsers();
    const normalizedEmail = normalizeEmail(email);

    if (users.some((entry) => normalizeEmail(entry.email) === normalizedEmail)) {
      return { user: null, error: "An account with this email already exists." };
    }

    const role = getAdminRole(normalizedEmail);
    const createdUser: LocalAuthUser = {
      id: `local-${Date.now()}`,
      email: normalizedEmail,
      password,
      first_name: firstName,
      last_name: lastName,
      phone,
      role,
      user_metadata: {
        role,
        first_name: firstName,
        last_name: lastName,
        phone,
      },
    };

    safeWriteUsers([...users, createdUser]);
    persistSession(createdUser);
    return { user: createdUser, error: null };
  }, [persistSession]);

  const signOut = useCallback(async () => {
    persistSession(null);
  }, [persistSession]);

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
