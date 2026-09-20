import { createFileRoute } from "@tanstack/react-router";
import { CompactHero, PageShell } from "@/components/head-spa";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/pred-navstevou")({
  head: () => ({
    meta: [
      { title: "Před návštěvou | Verdea Head Spa" },
      { name: "description", content: "Praktické informace před rituálem ve Verdea Head Spa v Hradci Králové." },
      { property: "og:title", content: "Před návštěvou | Verdea Head Spa" },
      { property: "og:description", content: "Připravte se na svůj rituál ve Verdea Head Spa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return <PageShell><CompactHero /><main className="mx-auto max-w-4xl px-6 pb-24 md:px-10">
    <span className="eyebrow">{t.before.eyebrow}</span>
    <h1 className="section-heading">{t.before.title}</h1>
    <div className="space-y-8 text-lg leading-8 text-muted-foreground">
      <p>{t.before.intro1}</p>
      <p>{t.before.intro2}</p>
      {t.before.blocks.map(block => (
        <section key={block.title} className="border-l-2 border-copper pl-6">
          <h2 className="mb-3 font-serif text-2xl text-foreground">{block.title}</h2>
          <p className="text-base leading-8">{block.copy}</p>
        </section>
      ))}
    </div>
  </main></PageShell>;
}
