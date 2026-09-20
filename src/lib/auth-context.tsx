import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthUserRole = "customer" | "admin";
export type ReservationRecord = { id: string; customer_name: string; email: string; phone: string; service_id: string; preferred_time: string; amount_czk: number; status: string; payment_session_id: string | null; created_at: string; updated_at?: string; therapist?: string | null; gift_voucher?: boolean; gift_voucher_number?: string | null };
export type VoucherRecord = { id: string; voucher_kind: "procedure" | "amount"; service_id: string | null; amount_czk: number; customer_name: string; phone: string; email: string; delivery_type: string; status: string; payment_session_id: string | null; created_at: string; updated_at?: string };
export type ReservationInput = Omit<ReservationRecord, "id" | "created_at" | "updated_at">;
export type VoucherInput = Omit<VoucherRecord, "id" | "created_at" | "updated_at">;

type AuthContextValue = { session: Session | null; user: User | null; role: AuthUserRole; isAuthenticated: boolean; isAdmin: boolean; loading: boolean; signIn: (email: string, password: string) => Promise<{ user: User | null; session: Session | null; error: string | null }>; signUp: (payload: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<{ user: User | null; session: Session | null; error: string | null }>; signOut: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);
function normalizeEmail(email: string) { return email.trim().toLowerCase(); }
function readableError(error: { message?: string } | null) {
  if (!error?.message) return "Something went wrong. Please try again.";
  const message = error.message.toLowerCase();
  if (message.includes("invalid login credentials")) return "The email or password is incorrect.";
  if (message.includes("email not confirmed")) return "Please confirm your email address before signing in.";
  return error.message;
}

export async function readReservations(): Promise<ReservationRecord[]> {
  const { data, error } = await supabase.from("reservation_requests").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(readableError(error));
  return (data ?? []) as ReservationRecord[];
}
export async function createReservation(input: ReservationInput): Promise<ReservationRecord> {
  const { data, error } = await supabase.from("reservation_requests").insert({ ...input, status: "pending_payment", payment_session_id: null }).select("*").single();
  if (error || !data) throw new Error(readableError(error));
  return data as ReservationRecord;
}
export async function readVoucherOrders(): Promise<VoucherRecord[]> {
  const { data, error } = await supabase.from("voucher_orders").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(readableError(error));
  return (data ?? []) as VoucherRecord[];
}
export async function createVoucherOrder(input: VoucherInput): Promise<VoucherRecord> {
  const { data, error } = await supabase.from("voucher_orders").insert({ ...input, status: "pending_payment", payment_session_id: null }).select("*").single();
  if (error || !data) throw new Error(readableError(error));
  return data as VoucherRecord;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkAdmin = useCallback(async (nextUser: User | null) => {
    if (!nextUser) { setIsAdmin(false); return; }
    if (nextUser.app_metadata?.role === "admin" || nextUser.user_metadata?.role === "admin") { setIsAdmin(true); return; }
    const { data, error } = await supabase.from("admin_users").select("id").eq("id", nextUser.id).maybeSingle();
    setIsAdmin(!error && !!data);
  }, []);
  useEffect(() => {
    let mounted = true;
    const applySession = async (nextSession: Session | null) => {
      if (!mounted) return;
      setLoading(true); setSession(nextSession); setUser(nextSession?.user ?? null);
      await checkAdmin(nextSession?.user ?? null);
      if (mounted) setLoading(false);
    };
    void supabase.auth.getSession().then(({ data }) => applySession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { window.setTimeout(() => void applySession(nextSession), 0); });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [checkAdmin]);
  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });
    return { user: data.user, session: data.session, error: error ? readableError(error) : null };
  }, []);
  const signUp = useCallback(async ({ firstName, lastName, email, phone, password }: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({ email: normalizeEmail(email), password, options: { data: { first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim() } } });
    return { user: data.user, session: data.session, error: error ? readableError(error) : null };
  }, []);
  const signOut = useCallback(async () => { const { error } = await supabase.auth.signOut(); if (error) throw new Error(readableError(error)); }, []);
  const role: AuthUserRole = isAdmin ? "admin" : "customer";
  const value = useMemo<AuthContextValue>(() => ({ session, user, role, isAuthenticated: !!user && !!session, isAdmin, loading, signIn, signUp, signOut }), [session, user, role, isAdmin, loading, signIn, signUp, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within an AuthProvider"); return context; }
