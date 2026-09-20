import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { CompactHero, PageShell } from "@/components/head-spa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin dashboard | Head Spa By Kratochvílová" }],
  }),
  component: AdminPage,
});

type ReservationRow = {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  service_id: string;
  preferred_time: string;
  amount_czk: number;
  status: string;
  payment_session_id: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading, signOut } = useAuth();
  const [rows, setRows] = useState<ReservationRow[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate({ to: "/login", replace: true });
      return;
    }

    const load = async () => {
      const { data, error } = await supabase
        .from("reservation_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setRows((data ?? []) as ReservationRow[]);
      }
    };

    void load();
  }, [isAdmin, isAuthenticated, loading, navigate]);

  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return rows;
    return rows.filter((row) =>
      `${row.customer_name} ${row.email} ${row.phone} ${row.service_id} ${row.status}`
        .toLowerCase()
        .includes(value),
    );
  }, [query, rows]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      today: rows.filter(
        (row) =>
          new Date(row.created_at).toDateString() === new Date().toDateString(),
      ).length,
      pending: rows.filter(
        (row) => row.status === "pending_payment" || row.status === "pending",
      ).length,
      customers: new Set(rows.map((row) => row.email)).size,
    }),
    [rows],
  );

  return (
    <PageShell>
      <CompactHero />
      <main className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1 className="section-heading">Rezervace a objednávky</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() =>
                void signOut().then(() =>
                  navigate({ to: "/login", replace: true }),
                )
              }
            >
              <ShieldCheck /> Odhlásit
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="surface-card p-5">
            <ClipboardList className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Dnes
            </p>
            <p className="mt-3 text-3xl font-serif text-foreground">
              {stats.today}
            </p>
          </div>
          <div className="surface-card p-5">
            <Check className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Celkem
            </p>
            <p className="mt-3 text-3xl font-serif text-foreground">
              {stats.total}
            </p>
          </div>
          <div className="surface-card p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Čeká na úhradu
            </p>
            <p className="mt-3 text-3xl font-serif text-foreground">
              {stats.pending}
            </p>
          </div>
          <div className="surface-card p-5">
            <Users className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Registrovaní
            </p>
            <p className="mt-3 text-3xl font-serif text-foreground">
              {stats.customers}
            </p>
          </div>
        </div>

        <div className="mt-8 surface-card p-5 md:p-6">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Hledat zákazníka, email, službu ..."
                className="h-11 w-full rounded-full border border-border bg-background pl-9 pr-3 text-sm"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredRows.length} záznamů
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 pr-4">Zákazník</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Telefon</th>
                  <th className="pb-3 pr-4">Služba</th>
                  <th className="pb-3 pr-4">Datum</th>
                  <th className="pb-3 pr-4">Čas</th>
                  <th className="pb-3 pr-4">Cena</th>
                  <th className="pb-3 pr-4">Platba</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Vytvořeno</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className="border-b border-border align-top">
                    <td className="py-4 pr-4 font-medium text-foreground">
                      {row.customer_name}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {row.email}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {row.phone}
                    </td>
                    <td className="py-4 pr-4 text-foreground">
                      {row.service_id}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {new Date(row.created_at).toLocaleDateString("cs-CZ")}
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {row.preferred_time}
                    </td>
                    <td className="py-4 pr-4 text-foreground">
                      {row.amount_czk.toLocaleString("cs-CZ")} Kč
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {row.payment_session_id ?? "—"}
                    </td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-primary">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {new Date(row.created_at).toLocaleString("cs-CZ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            <ArrowLeft /> Zpět na web
          </Link>
        </div>
      </main>
    </PageShell>
  );
}
