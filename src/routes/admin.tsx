import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ClipboardList,
  PencilLine,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import {
  CompactHero,
  PageShell,
  services,
  type Service,
} from "@/components/head-spa";
import { Button } from "@/components/ui/button";
import { readReservations, useAuth } from "@/lib/auth-context";

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

type ProductRow = Service & {
  details: { cs: string; en: string };
};

const PRODUCT_STORAGE_KEY = "head-spa-products-v1";

const readStoredProducts = (): ProductRow[] => {
  const fallback: ProductRow[] = services.map((service) => ({
    ...service,
    details: { ...service.details },
  }));

  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as ProductRow[];
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;

    return parsed.map((row) => ({
      ...row,
      category: row.category ?? "zeny",
      amount: Number(row.amount ?? 0),
      duration: row.duration ?? "60 min",
      image: row.image ?? fallback[0]?.image ?? "",
      details: {
        cs: row.details?.cs ?? "",
        en: row.details?.en ?? "",
      },
    }));
  } catch {
    return fallback;
  }
};

const saveProductRows = (rows: ProductRow[]) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(rows));
  }

  services.splice(0, services.length, ...rows.map((row) => ({ ...row })));
};

function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading, signOut } = useAuth();
  const [rows, setRows] = useState<ReservationRow[]>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "products">(
    "dashboard",
  );
  const [products, setProducts] = useState<ProductRow[]>(() => readStoredProducts());

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate({ to: "/login", replace: true });
      return;
    }

    const load = async () => {
      try {
        const items = (await readReservations()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRows(items as ReservationRow[]);
      } catch (error) { console.error(error); setRows([]); }
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

  const updateProduct = <K extends keyof ProductRow>(
    id: string,
    field: K,
    value: ProductRow[K],
  ) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  const updateProductDetails = (
    id: string,
    locale: "cs" | "en",
    value: string,
  ) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              details: {
                ...product.details,
                [locale]: value,
              },
            }
          : product,
      ),
    );
  };

  const addProduct = () => {
    const nextId = `custom-${Date.now()}`;
    const nextProduct: ProductRow = {
      id: nextId,
      category: "zeny",
      name: "New ritual",
      amount: 1500,
      duration: "60 min",
      image: services[0]?.image ?? "",
      details: {
        cs: "Popis rituálu.",
        en: "Ritual description.",
      },
    };

    setProducts((current) => [...current, nextProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const saveProducts = () => {
    const next = products.map((product) => ({
      ...product,
      amount: Number(product.amount) || 0,
      name: product.name.trim() || "Untitled ritual",
      duration: product.duration.trim() || "60 min",
      details: {
        cs: product.details.cs.trim() || "",
        en: product.details.en.trim() || "",
      },
    }));

    setProducts(next);
    saveProductRows(next);
  };

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
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex rounded-full border border-border bg-background p-1">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("products")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${activeTab === "products" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                Products
              </button>
            </div>
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

        {activeTab === "dashboard" ? (
          <>
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
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow">Product management</p>
                <h2 className="section-heading">Edit services and pricing</h2>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="rounded-full" onClick={addProduct}>
                  <Plus /> Add ritual
                </Button>
                <Button type="button" className="rounded-full" onClick={saveProducts}>
                  <Save /> Save changes
                </Button>
              </div>
            </div>

            <div className="grid gap-5">
              {products.map((product) => (
                <div key={product.id} className="surface-card p-5 md:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <PencilLine className="h-4 w-4" />
                      {product.name || "Untitled ritual"}
                    </div>
                    <Button type="button" variant="ghost" className="rounded-full p-2 text-destructive" onClick={() => deleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Name</span>
                      <input
                        value={product.name}
                        onChange={(event) => updateProduct(product.id, "name", event.target.value)}
                        className="field-control"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Category</span>
                      <select
                        value={product.category}
                        onChange={(event) =>
                          updateProduct(product.id, "category", event.target.value as ProductRow["category"])
                        }
                        className="field-control"
                      >
                        <option value="zeny">zeny</option>
                        <option value="muzi">muzi</option>
                        <option value="deti">deti</option>
                        <option value="par">par</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Price</span>
                      <input
                        type="number"
                        min={0}
                        value={product.amount}
                        onChange={(event) => updateProduct(product.id, "amount", Number(event.target.value))}
                        className="field-control"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Duration</span>
                      <input
                        value={product.duration}
                        onChange={(event) => updateProduct(product.id, "duration", event.target.value)}
                        className="field-control"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Description (CZ)</span>
                      <textarea
                        rows={3}
                        value={product.details.cs}
                        onChange={(event) => updateProductDetails(product.id, "cs", event.target.value)}
                        className="field-control min-h-[88px]"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">Description (EN)</span>
                      <textarea
                        rows={3}
                        value={product.details.en}
                        onChange={(event) => updateProductDetails(product.id, "en", event.target.value)}
                        className="field-control min-h-[88px]"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </PageShell>
  );
}
