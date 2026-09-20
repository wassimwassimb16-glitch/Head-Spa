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
import hero from "@/assets/ritual-hero.jpg";
import water from "@/assets/ritual-water.jpg";
import touch from "@/assets/ritual-touch.jpg";
import products from "@/assets/ritual-products.jpg";

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
                  {t.hero.cta}
                </Button>
                <a
                  href="#sluzby"
                  className={linkButton(
                    "border border-secondary-foreground/40 bg-transparent text-secondary-foreground",
                  )}
                >
                  {t.hero.secondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card/80 py-8 md:py-10">
          <div className="mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-3 md:px-10">
            {[
              { label: "Diagnostika", value: "vědomá péče" },
              { label: "Spánek hlavy", value: "bez spěchu" },
              { label: "Výsledek", value: "lehčí pocit" },
            ].map((item) => (
              <div
                key={item.label}
                className="soft-panel rounded-2xl px-5 py-4 text-center"
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-copper">
                  {item.label}
                </div>
                <div className="mt-2 font-serif text-2xl text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="sluzby" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            <div className="max-w-2xl">
              <span className="eyebrow">{t.servicesSection.eyebrow}</span>
              <h2 className="section-heading">{t.servicesSection.title}</h2>
            </div>
            <div className="mb-8 flex gap-1 overflow-x-auto border-b border-border pb-2">
              {filterKeys.map((key) => (
                <Button
                  key={key}
                  variant="ghost"
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                  className={`shrink-0 rounded-full px-4 py-2 ${filter === key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
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
              <div className="grid gap-4 md:grid-cols-2">
                {visible.map((s, i) => (
                  <article
                    key={s.id}
                    className="soft-panel rounded-[28px] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(34,31,29,0.08)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-[0.22em] text-copper">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full border border-border bg-white/40 px-2.5 py-1 text-xs text-muted-foreground">
                        {s.duration}
                      </span>
                    </div>
                    <img
                      src={s.image}
                      alt={s.name}
                      className="mt-4 h-40 w-full rounded-2xl object-cover"
                    />
                    <div className="mt-6">
                      <h3 className="font-serif text-3xl md:text-[2rem]">
                        {s.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {s.details[lang]}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                      <strong className="font-serif text-2xl text-foreground">
                        {t.common.currency(s.amount)}
                      </strong>
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
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          id="aktuality"
          className="border-b border-border bg-card py-12 md:py-16"
        >
          <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
            <span className="eyebrow">{t.news.eyebrow}</span>
            <h2 className="font-serif text-3xl md:text-4xl">{t.news.title}</h2>
            <p className="mt-5 leading-8 text-muted-foreground">
              {t.news.copy}
            </p>
          </div>
        </section>

        <section className="bg-secondary py-20 text-secondary-foreground md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-10">
            <div className="image-frame h-[520px] overflow-hidden rounded-[30px]">
              <img
                src={water}
                alt="Head Spa"
                loading="lazy"
                width={1200}
                height={1408}
                className="h-full w-full object-cover"
              />
            </div>
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

        <section className="pb-20 md:pb-28">
          <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3 md:px-10">
            <div className="image-frame h-[440px] overflow-hidden rounded-[30px] md:col-span-2">
              <img
                src={touch}
                alt="Head Spa"
                loading="lazy"
                width={1200}
                height={1408}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="image-frame h-[440px] overflow-hidden rounded-[30px]">
              <img
                src={products}
                alt="Head Spa"
                loading="lazy"
                width={1200}
                height={1408}
                className="h-full w-full object-cover"
              />
            </div>
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
                  "border border-[#6f5f52] bg-[#6f5f52] text-[#f9f5f1] shadow-sm",
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
            <img
              src={detail.image}
              alt={detail.name}
              className="mt-6 h-64 w-full rounded-[24px] object-cover"
            />
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
