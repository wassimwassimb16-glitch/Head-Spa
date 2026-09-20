import { createFileRoute } from "@tanstack/react-router";
import { CompactHero, PageShell } from "@/components/head-spa";
export const Route = createFileRoute("/ochrana-osobnich-udaju-gdpr")({
  head: () => ({
    meta: [
      { title: "Ochrana osobních údajů | Head Spa By Kratochvílová" },
      {
        name: "description",
        content:
          "Zásady ochrany osobních údajů salonu Head Spa By Kratochvílová.",
      },
      {
        property: "og:title",
        content: "Ochrana osobních údajů | Head Spa By Kratochvílová",
      },
      {
        property: "og:description",
        content: "Informace o zpracování osobních údajů.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});
function Page() {
  return (
    <PageShell>
      <CompactHero />
      <Legal
        title="Zásady ochrany osobních údajů (GDPR)"
        sections={[
          [
            "Správce osobních údajů",
            "Společnými správci jsou Lucie Malinová a Jitka Slavíčková. Provozovna: ---. Kontaktní e-mail: ---.",
          ],
          [
            "Zpracovávané údaje",
            "Zpracováváme základní identifikační, kontaktní a platební údaje a záznamy písemné komunikace v rozsahu potřebném pro rezervaci a poskytnutí služeb.",
          ],
          [
            "Účel a doba zpracování",
            "Údaje zpracováváme pro plnění smlouvy, zákonných povinností, ochranu oprávněných zájmů a na základě uděleného souhlasu. Údaje jsou uchovávány pouze po nezbytnou dobu.",
          ],
          [
            "Zvláštní kategorie údajů",
            "Před procedurou mohou být zjišťovány informace o zdravotním stavu, alergiích, kožních problémech nebo medikaci pro bezpečné poskytnutí služby.",
          ],
          [
            "Vaše práva",
            "Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost a vznesení námitky. Práva lze uplatnit prostřednictvím kontaktního formuláře nebo písemně v provozovně.",
          ],
          [
            "Cookies",
            "Web používá pouze nezbytné cookies potřebné pro technický chod a správné fungování formulářů.",
          ],
        ]}
      />
    </PageShell>
  );
}
export function Legal({
  title,
  sections,
}: {
  title: string;
  sections: [string, string][];
}) {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-24">
      <h1 className="section-heading">{title}</h1>
      <div className="space-y-10 text-sm leading-7 text-muted-foreground">
        {sections.map(([h, p]) => (
          <section key={h}>
            <h2 className="mb-3 text-lg font-bold text-primary">
              {h.toUpperCase()}
            </h2>
            <p>{p}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
