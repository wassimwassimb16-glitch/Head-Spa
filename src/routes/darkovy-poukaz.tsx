import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, Gift } from "lucide-react";
import { CompactHero, Field, PageShell, services } from "@/components/head-spa";
import { Button } from "@/components/ui/button";
import { createVoucherOrder, useAuth } from "@/lib/auth-context";
import { confirmCheckoutSession, createCheckoutSession } from "@/lib/payment.functions";
import { useI18n } from "@/lib/i18n";
import products from "@/assets/ritual-products.jpg";

export const Route = createFileRoute("/darkovy-poukaz")({
  head: () => ({
    meta: [
      { title: "Dárkové poukazy | Head Spa By Kratochvílová" },
      {
        name: "description",
        content:
          "Darujte vědomou péči. Vyberte rituál Head Spa By Kratochvílová nebo hodnotu poukazu a objednejte jej online.",
      },
      {
        property: "og:title",
        content: "Dárkové poukazy | Head Spa By Kratochvílová",
      },
      {
        property: "og:description",
        content: "Darujte čas, klid a péči v Hradci Králové.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

type Errs = { name?: string; phone?: string; email?: string };
const digits = (v: string) => v.replace(/\D/g, "").length;

function Page() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [kind, setKind] = useState<"procedure" | "amount">("procedure");
  const [serviceId, setServiceId] = useState("harmony");
  const [value, setValue] = useState(1500);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Errs>({});
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (params.get("payment") !== "success" || !sessionId) return;
    void confirmCheckoutSession({ data: { sessionId } }).then((result) => setSent(result.paid)).catch((verificationError) => { console.error(verificationError); setError(t.voucher.error); });
    window.history.replaceState({}, "", window.location.pathname);
  }, [t.voucher.error]);

  const selected = useMemo(
    () => services.find((s) => s.id === serviceId),
    [serviceId],
  );
  const total = kind === "procedure" ? (selected?.amount ?? 1500) : value;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const errs: Errs = {};
    if (name.length < 2 || name.length > 120)
      errs.name = t.reservation.errors.name;
    if (digits(phone) < 6 || phone.length > 40)
      errs.phone = t.reservation.errors.phone;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = t.reservation.errors.email;
    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      setError(t.voucher.error);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const order = await createVoucherOrder({
        voucher_kind: kind,
        service_id: kind === "procedure" ? serviceId : null,
        amount_czk: total,
        customer_name: name,
        phone,
        email,
        delivery_type: String(data.get("delivery") || "email"),
        status: "pending_payment",
        payment_session_id: null,
      });
      const checkout = await createCheckoutSession({ data: { orderId: order.id, orderType: "voucher" } });
      setSaving(false);
      if (!checkout.url) throw new Error("Stripe checkout URL is missing.");
      window.location.assign(checkout.url);
    } catch (err) {
      console.error(err);
      setSaving(false);
      setError(t.reservation.errors.network);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageShell>
        <CompactHero />
        <main className="mx-auto max-w-4xl px-6 pb-24 pt-8 md:px-10">
          <div className="surface-card p-8 md:p-10 text-center">
            <span className="eyebrow">{t.voucher.eyebrow}</span>
            <h1 className="section-heading mt-3">Account required</h1>
            <p className="mt-4 mx-auto max-w-xl leading-8 text-muted-foreground">
              Please register or log in before ordering a gift voucher. Voucher orders are only available for signed-in customers.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button type="button" variant="outline" className="rounded-full" onClick={() => window.history.back()}>
                Back
              </Button>
              <a href="/login" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow">
                Sign in / Register
              </a>
            </div>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <CompactHero />
      <main className="pb-24">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[.9fr_1.1fr] md:px-10">
          <div>
            <span className="eyebrow">{t.voucher.eyebrow}</span>
            <h1 className="section-heading">{t.voucher.title}</h1>
            <p className="max-w-md leading-8 text-muted-foreground">
              {t.voucher.copy}
            </p>
            <img
              src={products}
              alt="Head Spa"
              loading="lazy"
              width={1200}
              height={1408}
              className="mt-10 h-72 w-full rounded-xl object-cover"
            />
          </div>
          <div>
            {sent ? (
              <div
                className="grid min-h-[480px] place-items-center surface-card p-10 text-center"
                role="status"
              >
                <div>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check />
                  </span>
                  <h2 className="mt-6 font-serif text-3xl">
                    {t.voucher.success}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">
                    {t.voucher.successCopy}
                  </p>
                </div>
              </div>
            ) : (
              <div className="surface-card p-6 md:p-10">
                <div className="mb-8 flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setKind("procedure")}
                    variant={kind === "procedure" ? "default" : "outline"}
                    className="flex-1 rounded-full"
                  >
                    {t.voucher.byRitual}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setKind("amount")}
                    variant={kind === "amount" ? "default" : "outline"}
                    className="flex-1 rounded-full"
                  >
                    {t.voucher.byAmount}
                  </Button>
                </div>
                <form
                  onSubmit={submit}
                  noValidate
                  className="grid gap-5 md:grid-cols-2"
                >
                  {kind === "procedure" ? (
                    <Field label={t.voucher.chooseRitual} wide>
                      <select
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} · {t.common.currency(s.amount)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ) : (
                    <Field label={t.voucher.amount} wide>
                      <select
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                      >
                        {[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000].map(
                          (v) => (
                            <option key={v} value={v}>
                              {t.common.currency(v)}
                            </option>
                          ),
                        )}
                      </select>
                    </Field>
                  )}
                  <Field
                    label={t.reservation.fields.name}
                    error={fieldErrors.name}
                  >
                    <input
                      name="name"
                      placeholder={t.reservation.placeholders.name}
                    />
                  </Field>
                  <Field
                    label={t.reservation.fields.phone}
                    error={fieldErrors.phone}
                  >
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder={t.reservation.placeholders.phone}
                    />
                  </Field>
                  <Field
                    label={t.reservation.fields.email}
                    error={fieldErrors.email}
                  >
                    <input
                      name="email"
                      type="email"
                      placeholder={t.reservation.placeholders.email}
                    />
                  </Field>
                  <Field label={t.voucher.delivery}>
                    <select name="delivery" defaultValue="email">
                      <option value="email">{t.voucher.deliveryEmail}</option>
                      <option value="pickup">{t.voucher.deliveryPickup}</option>
                    </select>
                  </Field>
                  <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground md:col-span-2">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5 h-4 w-4"
                    />{" "}
                    {t.reservation.consent}
                  </label>
                  {error && (
                    <p
                      role="alert"
                      className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive md:col-span-2"
                    >
                      {error}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-5 md:col-span-2">
                    <span>
                      <small className="block text-muted-foreground">
                        {t.common.total}
                      </small>
                      <strong className="text-xl">
                        {t.common.currency(total)}
                      </strong>
                    </span>
                    <Button disabled={saving} className="rounded-full">
                      {saving ? t.common.saving : t.voucher.submit} <Gift />
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-7xl px-6 md:px-10">
          <div className="grid gap-5 md:grid-cols-3">
            {t.voucher.terms.map((item, i) => (
              <div key={item.title} className="surface-card p-8">
                <span className="text-xs text-copper">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-serif text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
