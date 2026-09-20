import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Globe, Menu, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createReservation, useAuth } from "@/lib/auth-context";
import { createCheckoutSession } from "@/lib/payment.functions";
import { BRAND, CONTACT_PLACEHOLDERS, useI18n, type Lang } from "@/lib/i18n";
import logoSvg from "@/assets/logo.svg";
import harmonyImage from "@/assets/service-harmony.jpg";
import deepImage from "@/assets/service-deep.jpg";
import royalImage from "@/assets/service-royal.jpg";
import menImage from "@/assets/service-men.jpg";
import kidImage from "@/assets/service-kid.jpg";
import dryImage from "@/assets/service-dry.jpg";
import peatWomanImage from "@/assets/service-peat-woman.jpg";
import peatMenImage from "@/assets/service-peat-men.jpg";
import pairImage from "@/assets/service-pair.jpg";
import sensoryImage from "@/assets/service-sensory.jpg";

export type Service = {
  id: string;
  category: "zeny" | "muzi" | "deti" | "par";
  name: string;
  amount: number;
  duration: string;
  image: string;
  details: { cs: string; en: string };
};

export const services: Service[] = [
  {
    id: "harmony",
    category: "zeny",
    name: "Harmony",
    amount: 1500,
    duration: "90 min",
    image: harmonyImage,
    details: {
      cs: "Diagnostika vlasové pokožky, hloubkové čištění, profesionální péče, masáž hlavy, ramen a šíje, vodní terapie a jednoduchý styling.",
      en: "Scalp diagnostics, deep cleansing, professional care, head, shoulder and neck massage, water therapy and simple styling.",
    },
  },
  {
    id: "deep",
    category: "zeny",
    name: "Deep Relax",
    amount: 2000,
    duration: "120 min",
    image: deepImage,
    details: {
      cs: "Rozšířený rituál s péčí o obličej, aromaterapií, masáží a vodní terapií pro skutečně hluboké zklidnění.",
      en: "An extended ritual with facial care, aromatherapy, massage and water therapy for truly deep calm.",
    },
  },
  {
    id: "royal",
    category: "zeny",
    name: "Royal Ritual",
    amount: 3500,
    duration: "180 min",
    image: royalImage,
    details: {
      cs: "Tříhodinový celostní rituál spojující diagnostiku, péči o vlasy a pleť, masáž rukou, aromaterapii a styling.",
      en: "A three-hour holistic ritual combining diagnostics, hair and skin care, hand massage, aromatherapy and styling.",
    },
  },
  {
    id: "men",
    category: "muzi",
    name: "Men's Reset",
    amount: 1400,
    duration: "60 min",
    image: menImage,
    details: {
      cs: "Cílená pánská péče s diagnostikou, čištěním, masáží šíje a ramen a vodní terapií.",
      en: "Focused care for men with diagnostics, cleansing, neck and shoulder massage and water therapy.",
    },
  },
  {
    id: "kid",
    category: "deti",
    name: "Kids Calm",
    amount: 1000,
    duration: "60 min",
    image: kidImage,
    details: {
      cs: "Jemný a bezpečný rituál pro děti s šetrnou kosmetikou, vodní terapií a jednoduchým stylingem.",
      en: "A gentle, safe ritual for children with mild products, water therapy and simple styling.",
    },
  },
  {
    id: "dry",
    category: "zeny",
    name: "Dry Touch",
    amount: 1250,
    duration: "60 min",
    image: dryImage,
    details: {
      cs: "Suchý rituál doteku, jemného škrábání a masáže vlasové pokožky, obličeje, šíje a dekoltu.",
      en: "A dry ritual of touch, gentle scalp scratching and massage of the scalp, face, neck and décolleté.",
    },
  },
  {
    id: "peat-w",
    category: "zeny",
    name: "Peat Therapy",
    amount: 3000,
    duration: "150 min",
    image: peatWomanImage,
    details: {
      cs: "Specializovaná rašelinová péče pro problematickou pokožku, doplněná masáží, kosmetickým ošetřením a stylingem.",
      en: "Specialised peat care for problematic scalps, with massage, a facial treatment and styling.",
    },
  },
  {
    id: "peat-m",
    category: "muzi",
    name: "Peat Therapy Men",
    amount: 2200,
    duration: "90 min",
    image: peatMenImage,
    details: {
      cs: "Pánská rašelinová péče pro citlivou či problematickou vlasovou pokožku s masáží a vodní terapií.",
      en: "Peat care for men with a sensitive or problematic scalp, including massage and water therapy.",
    },
  },
  {
    id: "pair",
    category: "par",
    name: "Ritual for Two",
    amount: 3400,
    duration: "90 / 120 min",
    image: pairImage,
    details: {
      cs: "Společný čas s individuální péčí terapeutky pro každého hosta a plným soukromím během procedury.",
      en: "Shared time with a dedicated therapist for each guest and full privacy throughout the treatment.",
    },
  },
  {
    id: "sensory",
    category: "zeny",
    name: "Sensory Rest",
    amount: 1000,
    duration: "60 min",
    image: sensoryImage,
    details: {
      cs: "Hodina vědomého doteku a jemných senzorických podnětů pro zklidnění nervového systému.",
      en: "An hour of mindful touch and gentle sensory input to calm the nervous system.",
    },
  },
];

export const teamMembers = [
  { name: "Lucie Malinová", initial: "LM" },
  { name: "Jitka Slavíčková", initial: "JS" },
  { name: "Barbora Donát", initial: "BD" },
];

export function useServicePrice() {
  const { t } = useI18n();
  return (s: Service) => t.common.currency(s.amount);
}

function Brand({ inverted }: { inverted?: boolean } = {}) {
  return (
    <span className="flex items-center gap-3">
      <img
        src={logoSvg}
        alt={`${BRAND.name} ${BRAND.suffix}`}
        className={cn(
          "h-10 w-auto object-contain",
          inverted ? "brightness-0 invert" : "",
        )}
      />
      {!inverted && (
        <span className="leading-tight">
          <strong className="block font-serif text-lg font-normal">
            {BRAND.name} {BRAND.suffix}
          </strong>
          <small
            className={cn(
              "text-[9px] uppercase tracking-[.28em]",
              inverted ? "text-secondary-foreground/60" : "text-muted-foreground",
            )}
          >
            {BRAND.city}
          </small>
        </span>
      )}
    </span>
  );
}

function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const options: [Lang, string][] = [
    ["cs", "CZ"],
    ["en", "EN"],
  ];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-background p-1",
        className,
      )}
      role="group"
      aria-label="Language / Jazyk"
    >
      <Globe
        className="ml-1.5 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      {options.map(([code, label]) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors",
            lang === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function Header({ onReserve }: { onReserve: () => void }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const links: [string, string][] = [
    [t.nav.home, "/"],
    [t.nav.services, "/#sluzby"],
    [t.nav.prices, "/#ceny"],
    [t.nav.gallery, "/#galerie"],
    [t.nav.about, "/#o-nas"],
    [t.nav.vouchers, "/darkovy-poukaz"],
    [t.nav.news, "/#aktuality"],
    [t.nav.contact, "/#kontakt"],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-[rgba(247,243,237,0.88)] backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 md:px-10">
        <Link to="/" aria-label={BRAND.name}>
          <Brand />
        </Link>
        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {links.map(([label, href]) =>
            href.startsWith("/") && !href.startsWith("/#") ? (
              <Link key={href} to={href} className="nav-link">
                {label}
              </Link>
            ) : (
              <a key={href} href={href} className="nav-link">
                {label}
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-card sm:inline-flex"
          >
            {t.nav.login}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={t.common.menu}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <div className="absolute inset-x-4 top-[70px] rounded-[28px] border border-[rgba(34,31,29,0.08)] bg-[#f4ece3] p-5 shadow-[0_18px_42px_rgba(34,31,29,0.10)] lg:hidden">
            <nav className="flex flex-col">
              {links.map(([label, href]) =>
                href.startsWith("/") && !href.startsWith("/#") ? (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setOpen(false)}
                    className="border-b border-[rgba(34,31,29,0.08)] py-3.5 text-base text-foreground"
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="border-b border-[rgba(34,31,29,0.08)] py-3.5 text-base text-foreground"
                  >
                    {label}
                  </a>
                ),
              )}
              <div className="mt-3 flex items-center justify-between gap-3">
                <LanguageSwitcher className="bg-white/80" />
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border bg-white/80 px-3 py-2 text-sm font-medium text-foreground"
                >
                  {t.nav.login}
                </Link>
                <Button
                  onClick={() => {
                    setOpen(false);
                    onReserve();
                  }}
                  size="lg"
                  className="flex-1 rounded-full bg-[#6f5f52] text-[#f9f5f1]"
                >
                  {t.common.reserveSlot}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export function CompactHero() {
  return (
    <div className="mx-auto flex h-56 max-w-7xl items-end px-6 pb-10 pt-24 md:px-10">
      <Brand />
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer id="kontakt" className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-10">
        <div>
          <Brand inverted />
          <p className="mt-6 max-w-xs text-sm leading-6 text-secondary-foreground/70">
            {t.footer.tagline}
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[.2em] text-copper">
            {t.footer.visit}
          </p>
          <p className="text-sm leading-7">
            {CONTACT_PLACEHOLDERS.address}
            <br />
            {t.footer.floor}
            <br />
            {BRAND.city}
          </p>
          <p className="mt-3 text-sm text-secondary-foreground/70">
            {t.footer.hours}
          </p>
          <span className="mt-3 inline-block text-sm text-secondary-foreground/70">
            {t.footer.map}
          </span>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[.2em] text-copper">
            {t.footer.contact}
          </p>
          <p className="text-sm leading-7">
            Lucie Malinová
            <br />
            <span className="hover:underline">
              {CONTACT_PLACEHOLDERS.phone}
            </span>
            <br />
            <span className="hover:underline">
              {CONTACT_PLACEHOLDERS.email}
            </span>
          </p>
          <p className="mt-4 text-sm leading-7">
            Jitka Slavíčková
            <br />
            <span className="hover:underline">
              {CONTACT_PLACEHOLDERS.phone}
            </span>
            <br />
            <span className="hover:underline">
              {CONTACT_PLACEHOLDERS.email}
            </span>
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs uppercase tracking-[.2em] text-copper">
            {t.footer.info}
          </p>
          <Link
            to="/pred-navstevou"
            className="block py-1 text-sm hover:underline"
          >
            {t.nav.before}
          </Link>
          <Link
            to="/darkovy-poukaz"
            className="block py-1 text-sm hover:underline"
          >
            {t.nav.vouchers}
          </Link>
          <Link
            to="/ochrana-osobnich-udaju-gdpr"
            className="block py-1 text-sm hover:underline"
          >
            GDPR
          </Link>
          <Link
            to="/vseobecne-obchodni-podminky"
            className="block py-1 text-sm hover:underline"
          >
            {t.footer.terms}
          </Link>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/15 px-6 py-5 text-center text-xs text-secondary-foreground/55">
        © 2026 {BRAND.name} {BRAND.suffix} · {t.footer.rights}
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  const [reserve, setReserve] = useState(false);
  const { t } = useI18n();
  return (
    <>
      <Header onReserve={() => setReserve(true)} />
      {children}
      <Footer />
      {reserve && <ReservationModal onClose={() => setReserve(false)} />}
    </>
  );
}

const digits = (v: string) => v.replace(/\D/g, "").length;

type FieldErrors = {
  name?: string;
  phone?: string;
  email?: string;
  time?: string;
};

export function ReservationModal({
  onClose,
  initialService = "",
}: {
  onClose: () => void;
  initialService?: string;
}) {
  const { t, lang } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState(initialService ? 2 : 1);
  const [serviceId, setServiceId] = useState(initialService);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const selected = services.find((s) => s.id === serviceId);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const time = String(data.get("time") || "");

    const errs: FieldErrors = {};
    if (name.length < 2 || name.length > 120)
      errs.name = t.reservation.errors.name;
    if (digits(phone) < 6 || phone.length > 40)
      errs.phone = t.reservation.errors.phone;
    if (
      email.length < 5 ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    )
      errs.email = t.reservation.errors.email;
    if (!["dopoledne", "odpoledne", "kdykoliv"].includes(time))
      errs.time = t.reservation.errors.time;

    setFieldErrors(errs);
    if (Object.keys(errs).length) {
      setError(t.reservation.errors.generic);
      return;
    }

    setSaving(true);
    setError("");
    const gift = data.get("gift") === "yes";
    try {
      const reservation = await createReservation({
        service_id: selected.id,
        customer_name: name,
        phone,
        email: user?.email ?? email,
        preferred_time: time,
        gift_voucher: gift,
        gift_voucher_number: gift ? String(data.get("voucher") || "").trim() || null : null,
        therapist: String(data.get("therapist") || "bez preference"),
        amount_czk: selected.amount,
        status: "pending_payment",
        payment_session_id: null,
      });
      const checkout = await createCheckoutSession({ data: { orderId: reservation.id, orderType: "reservation" } });
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
      <div
        className="fixed inset-0 z-50 grid place-items-center bg-secondary/85 p-3"
        role="dialog"
        aria-modal="true"
        aria-label={t.reservation.title}
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="w-full max-w-xl rounded-xl bg-background p-6 shadow-2xl md:p-10">
          <span className="eyebrow">{t.reservation.eyebrow}</span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">
            Account required
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Please register or log in before booking a ritual. Booking requests are only available for signed-in customers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
              {t.common.close}
            </Button>
            <Link
              to="/login"
              className={buttonVariants({ size: "lg", className: "rounded-full" })}
            >
              Sign in / Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-secondary/85 p-3"
      role="dialog"
      aria-modal="true"
      aria-label={t.reservation.title}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background p-6 shadow-2xl md:p-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">{t.reservation.eyebrow}</span>
            <h2 className="font-serif text-3xl md:text-4xl">
              {t.reservation.title}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t.common.close}
          >
            <X />
          </Button>
        </div>

        {sent ? (
          <div className="py-12 text-center" role="status">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check />
            </span>
            <h3 className="mt-6 font-serif text-3xl">
              {t.reservation.success}
            </h3>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
              {t.reservation.successCopy}
            </p>
            <Button className="mt-7 rounded-full" onClick={onClose}>
              {t.common.done}
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-3 text-xs text-muted-foreground">
              {[t.reservation.stepService, t.reservation.stepDetails].map(
                (label, i) => (
                  <span key={label} className="flex flex-1 flex-col gap-2">
                    <span
                      className={cn(
                        "h-1 w-full rounded-full",
                        i + 1 <= step ? "bg-primary" : "bg-border",
                      )}
                    />
                    <span className={i + 1 === step ? "text-foreground" : ""}>
                      {i + 1}. {label}
                    </span>
                  </span>
                ),
              )}
            </div>

            {step === 1 ? (
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setServiceId(s.id)}
                      aria-pressed={serviceId === s.id}
                      className={cn(
                        "rounded-lg border p-4 text-left transition-colors",
                        serviceId === s.id
                          ? "border-primary bg-card"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <span className="font-serif text-xl">{s.name}</span>
                      <span className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>{s.duration}</span>
                        <strong className="text-foreground">
                          {t.common.currency(s.amount)}
                        </strong>
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  disabled={!serviceId}
                  onClick={() => setStep(2)}
                  className="mt-6 w-full rounded-full"
                  size="lg"
                >
                  {t.common.continue} <ArrowRight />
                </Button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                className="grid gap-5 md:grid-cols-2"
              >
                <div className="rounded-lg border-l-2 border-primary bg-card p-4 md:col-span-2">
                  <strong className="font-serif text-xl">
                    {selected?.name}
                  </strong>
                  <span className="ml-3 text-sm text-muted-foreground">
                    {selected?.duration} ·{" "}
                    {selected ? t.common.currency(selected.amount) : ""}
                  </span>
                </div>
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
                <Field
                  label={t.reservation.fields.time}
                  error={fieldErrors.time}
                >
                  <select name="time" defaultValue="">
                    <option value="" disabled>
                      {t.reservation.choose}
                    </option>
                    <option value="dopoledne">
                      {t.reservation.times.dopoledne}
                    </option>
                    <option value="odpoledne">
                      {t.reservation.times.odpoledne}
                    </option>
                    <option value="kdykoliv">
                      {t.reservation.times.kdykoliv}
                    </option>
                  </select>
                </Field>
                <Field label={t.reservation.fields.therapist}>
                  <select name="therapist" defaultValue="bez preference">
                    <option value="bez preference">
                      {t.reservation.noPreference}
                    </option>
                    <option value="Lucka">Lucka</option>
                    <option value="Jitka">Jitka</option>
                    <option value="Barča">Barča</option>
                  </select>
                </Field>
                <Field label={t.reservation.fields.gift}>
                  <select name="gift" defaultValue="no">
                    <option value="no">{t.reservation.no}</option>
                    <option value="yes">{t.reservation.yes}</option>
                  </select>
                </Field>
                <Field label={t.reservation.fields.voucherNo} wide>
                  <input
                    name="voucher"
                    placeholder={t.reservation.placeholders.voucherNo}
                  />
                </Field>
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 md:col-span-2">
                  {t.reservation.paymentRequired}
                </div>
                <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground md:col-span-2">
                  <input type="checkbox" required className="mt-0.5 h-4 w-4" />{" "}
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
                <div className="flex gap-3 md:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setStep(1)}
                  >
                    {t.common.back}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-full"
                    disabled={saving}
                  >
                    {saving ? t.common.saving : t.reservation.payNow}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground md:col-span-2">
                  {lang === "cs"
                    ? "Rezervace je vázána na úhradu, aby se termín zajistil."
                    : "Your booking is secured only after payment is completed."}
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function Field({
  label,
  wide,
  error,
  children,
}: {
  label: string;
  wide?: boolean | undefined;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <label className={cn("block", wide && "md:col-span-2")}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">
        {label}
      </span>
      <div
        className={cn(
          "[&_input]:field-control [&_select]:field-control",
          error && "[&_input]:border-destructive [&_select]:border-destructive",
        )}
      >
        {children}
      </div>
      {error && (
        <span className="mt-1.5 block text-xs text-destructive">{error}</span>
      )}
    </label>
  );
}

export const linkButton = (className?: string) =>
  buttonVariants({ size: "lg", className: cn("rounded-full", className) });
