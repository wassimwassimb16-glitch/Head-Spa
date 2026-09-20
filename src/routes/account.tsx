import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  LogOut,
  UserRound,
} from "lucide-react";
import { CompactHero, PageShell } from "@/components/head-spa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Můj účet | Head Spa By Kratochvílová" }],
  }),
  component: AccountPage,
});

type ReservationRow = {
  id: string;
  customer_name: string;
  service_id: string;
  preferred_time: string;
  amount_czk: number;
  status: string;
  payment_session_id: string | null;
  created_at: string;
};

function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login", replace: true });
      return;
    }

    if (!user?.email) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("reservation_requests")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        setFetchError("Nepodařilo se načíst vaše rezervace.");
        return;
      }
      setReservations((data ?? []) as ReservationRow[]);
    };

    void load();
  }, [isAuthenticated, loading, navigate, user]);

  const upcoming = useMemo(
    () =>
      reservations.filter(
        (item) => item.status !== "completed`" && item.status !== "cancelled",
      ),
    [reservations],
  );

  const past = useMemo(
    () =>
      reservations.filter(
        (item) => item.status === "completed" || item.status === "cancelled",
      ),
    [reservations],
  );

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <PageShell>
      <CompactHero />
      <main className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Můj účet</p>
            <h1 className="section-heading">
              Vítejte,{" "}
              {user?.user_metadata?.first_name ?? user?.email ?? "zákazníku"}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              <ArrowLeft /> Zpět domů
            </Link>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={handleSignOut}
            >
              <LogOut /> Odhlásit
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="surface-card p-6">
            <UserRound className="mb-4 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Profil
            </p>
            <p className="mt-3 font-semibold text-foreground">{user?.email}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {user?.user_metadata?.phone ?? "Telefon neuveden"}
            </p>
          </div>
          <div className="surface-card p-6">
            <CalendarDays className="mb-4 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Nadcházející
            </p>
            <p className="mt-3 text-3xl font-serif text-foreground">
              {upcoming.length}
            </p>
          </div>
          <div className="surface-card p-6">
            <CreditCard className="mb-4 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Výše rezervací
            </p>
            <p className="mt-3 text-3xl font-serif text-foreground">
              {reservations.length}
            </p>
          </div>
        </div>

        {fetchError && (
          <p className="mt-8 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {fetchError}
          </p>
        )}

        <section className="mt-10 surface-card p-6 md:p-8">
          <h2 className="font-serif text-3xl">Moje rezervace</h2>
          {reservations.length === 0 ? (
            <p className="mt-4 text-muted-foreground">
              Zatím nemáte žádné rezervace.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 pr-4">Služba</th>
                    <th className="pb-3 pr-4">Datum</th>
                    <th className="pb-3 pr-4">Čas</th>
                    <th className="pb-3 pr-4">Cena</th>
                    <th className="pb-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-b border-border align-top"
                    >
                      <td className="py-4 pr-4 font-medium text-foreground">
                        {reservation.service_id}
                      </td>
                      <td className="py-4 pr-4 text-muted-foreground">
                        {new Date(reservation.created_at).toLocaleDateString(
                          "cs-CZ",
                        )}
                      </td>
                      <td className="py-4 pr-4 text-muted-foreground">
                        {reservation.preferred_time}
                      </td>
                      <td className="py-4 pr-4 text-foreground">
                        {reservation.amount_czk.toLocaleString("cs-CZ")} Kč
                      </td>
                      <td className="py-4 pr-4">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium uppercase tracking-[0.08em] text-primary">
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </PageShell>
  );
}
