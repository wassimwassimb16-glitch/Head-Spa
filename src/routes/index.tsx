import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Droplets,
  Leaf,
  ScanLine,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  PageShell,
  ReservationModal,
  linkButton,
  services,
  teamMembers,
  type Service,
} from "@/components/head-spa";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import hero from "@/assets/ritual-hero.svg";
import water from "@/assets/ritual-water.svg";
import touch from "@/assets/ritual-touch.svg";
import products from "@/assets/ritual-products.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Head Spa By Kratochvílová | Rituály pro zdravou pokožku a klid",
      },
      {
        name: "description",
        content:
          "Head Spa By Kratochvílová v Hradci Králové: diagnostika vlasové pokožky, odborná péče, masáž a vodní terapie ve zcela klidném prostoru.",
      },
      { property: "og:title", content: "Head Spa By Kratochvílová" },
      {
        property: "og:description",
        content:
          "Místo, kde se odborná péče o vlasovou pokožku setkává s hlubokým klidem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const stepIcons: LucideIcon[] = [ScanLine, Leaf, Droplets, Sparkles];
const filterKeys = ["vse", "zeny", "muzi", "deti", "par"] as const;

function Home() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<(typeof filterKeys)[number]>("vse");
  const [detail, setDetail] = useState<Service | null>(null);
  const [reserve, setReserve] = useState<string | null>(null);
  const { lang } = useI18n();
  const visible = services.filter(
    (s) => filter === "vse" || s.category === filter,
  );

  return (
    <PageShell>
      <main>
        <section className="relative min-h-[620px] overflow-hidden pt-[76px] md:min-h-[740px]">
          <img
            src={hero}
            alt="Head Spa By Kratochvílová"
            width={1536}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/92 via-secondary/55 to-secondary/10" />
          <div className="relative mx-auto flex min-h-[544px] max-w-7xl items-center px-6 py-20 md:min-h-[664px] md:px-10">
            <div className="max-w-2xl text-secondary-foreground">
              <span className="eyebrow">{t.hero.eyebrow}</span>
              <h1 className="font-serif text-5xl leading-[1.02] md:text-7xl">
                {t.hero.title}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-secondary-foreground/80 md:text-lg">
                {t.hero.copy}
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full"
                  onClick={() => setReserve("")}
                >
                  {t.hero.cta} <ArrowRight />
                </Button>
                <a
                  href="#sluzby"
                  className={linkButton(
                    "border border-secondary-foreground/40 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10",
                  )}
                >
                  {t.hero.secondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="aktuality"
          className="border-y border-border bg-card py-12 md:py-16"
        >
          <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
            <span className="eyebrow">{t.news.eyebrow}</span>
            <h2 className="font-serif text-3xl md:text-4xl">{t.news.title}</h2>
            <p className="mt-5 leading-8 text-muted-foreground">
              {t.news.copy}
            </p>
          </div>
        </section>

        <section id="pristup" className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[.9fr_1.1fr] md:px-10">
            <div>
              <span className="eyebrow">{t.approach.eyebrow}</span>
              <h2 className="section-heading">{t.approach.title}</h2>
              <p className="max-w-md leading-8 text-muted-foreground">
                {t.approach.copy}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {t.approach.steps.map((step, i) => {
                const Icon = stepIcons[i]!;
                return (
                  <div key={step.title} className="surface-card p-7">
                    <Icon className="mb-6 h-5 w-5 text-copper" />
                    <span className="text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {step.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-secondary py-20 text-secondary-foreground md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
            <img
              src={water}
              alt="Head Spa"
              loading="lazy"
              width={1200}
              height={1408}
              className="h-[520px] w-full rounded-xl object-cover"
            />
            <div>
              <span className="eyebrow">{t.quote.eyebrow}</span>
              <h2 className="font-serif text-4xl leading-tight md:text-6xl">
                {t.quote.title}
              </h2>
              <p className="mt-6 max-w-lg leading-8 text-secondary-foreground/75">
                {t.quote.copy}
              </p>
              <blockquote className="mt-10 border-l border-copper pl-6 font-serif text-2xl italic">
                {t.quote.text}
                <footer className="mt-3 font-sans text-xs not-italic uppercase tracking-[.15em] text-copper">
                  {t.quote.author}
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section id="sluzby" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="max-w-2xl">
              <span className="eyebrow">{t.servicesSection.eyebrow}</span>
              <h2 className="section-heading">{t.servicesSection.title}</h2>
            </div>
            <div className="mb-8 flex gap-1 overflow-x-auto border-b border-border">
              {filterKeys.map((key) => (
                <Button
                  key={key}
                  variant="ghost"
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                  className={`shrink-0 rounded-none border-b-2 px-5 ${filter === key ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                >
                  {t.filters[key]}
                </Button>
              ))}
            </div>
            {visible.length === 0 ? (
              <p className="py-10 text-muted-foreground">
                {t.servicesSection.empty}
              </p>
            ) : (
              <div className="divide-y divide-border border-y border-border">
                {visible.map((s, i) => (
                  <article
                    key={s.id}
                    className="grid items-center gap-4 py-6 md:grid-cols-[48px_1fr_120px_140px_auto]"
                  >
                    <span className="hidden text-xs text-muted-foreground md:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl">
                        {s.name}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {s.details[lang]}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {s.duration}
                    </span>
                    <strong>{t.common.currency(s.amount)}</strong>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setDetail(s)}
                      >
                        {t.common.detail}
                      </Button>
                      <Button
                        size="icon"
                        className="rounded-full"
                        onClick={() => setReserve(s.id)}
                        aria-label={`${t.common.reserve} — ${s.name}`}
                      >
                        <ArrowRight />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="pb-20 md:pb-28">
          <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3 md:px-10">
            <img
              src={touch}
              alt="Head Spa"
              loading="lazy"
              width={1200}
              height={1408}
              className="h-[440px] w-full rounded-xl object-cover md:col-span-2"
            />
            <img
              src={products}
              alt="Head Spa"
              loading="lazy"
              width={1200}
              height={1408}
              className="h-[440px] w-full rounded-xl object-cover"
            />
          </div>
        </section>

        <section id="o-nas" className="bg-card py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <span className="eyebrow">{t.team.eyebrow}</span>
            <h2 className="section-heading">{t.team.title}</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {teamMembers.map((p, i) => (
                <article key={p.name} className="surface-card p-8">
                  <span className="grid h-14 w-14 place-items-center rounded-full border border-copper font-serif text-xl text-copper">
                    {p.initial}
                  </span>
                  <h3 className="mt-6 font-serif text-2xl">{p.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[.12em] text-copper">
                    {t.team.people[i]?.role}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    {t.team.people[i]?.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <span className="eyebrow">{t.reviews.eyebrow}</span>
            <h2 className="section-heading">{t.reviews.title}</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {t.reviews.items.map((item) => (
                <blockquote key={item.author} className="surface-card p-8">
                  <p className="font-serif text-xl leading-8">„{item.quote}“</p>
                  <footer className="mt-6 text-xs uppercase tracking-[.15em] text-copper">
                    {item.author}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 text-center md:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <span className="eyebrow">{t.finalCta.eyebrow}</span>
            <h2 className="font-serif text-4xl leading-tight md:text-6xl">
              {t.finalCta.title}
            </h2>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="rounded-full"
                onClick={() => setReserve("")}
              >
                {t.finalCta.reserve} <ArrowRight />
              </Button>
              <Link
                to="/darkovy-poukaz"
                className={linkButton(
                  "border border-input bg-transparent text-foreground hover:bg-card",
                )}
              >
                {t.finalCta.voucher}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-secondary/75"
          onMouseDown={(e) => e.target === e.currentTarget && setDetail(null)}
        >
          <aside className="h-full w-full max-w-lg overflow-y-auto bg-background p-8 md:p-12">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDetail(null)}
                aria-label={t.common.close}
              >
                <X />
              </Button>
            </div>
            <span className="eyebrow">{detail.duration}</span>
            <h2 className="font-serif text-4xl">{detail.name}</h2>
            <p className="mt-8 leading-8 text-muted-foreground">
              {detail.details[lang]}
            </p>
            <p className="mt-8 text-xl font-semibold">
              {t.common.currency(detail.amount)}
            </p>
            <Button
              className="mt-10 w-full rounded-full"
              size="lg"
              onClick={() => {
                setDetail(null);
                setReserve(detail.id);
              }}
            >
              {t.reservation.reserveAnd} <ArrowRight />
            </Button>
          </aside>
        </div>
      )}
      {reserve !== null && (
        <ReservationModal
          initialService={reserve}
          onClose={() => setReserve(null)}
        />
      )}
    </PageShell>
  );
}
