import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "cs" | "en";
const STORAGE_KEY = "head-spa-lang";

export const BRAND = {
  name: "Head Spa By Kratochvílová",
  suffix: "",
  city: "Hradec Králové",
};

type Dict = typeof cs;

const cs = {
  langName: "Čeština",
  nav: {
    home: "Domů",
    services: "Služby",
    prices: "Ceník",
    gallery: "Galerie",
    about: "O nás",
    news: "Aktuality",
    contact: "Kontakt",
    rituals: "Rituály",
    approach: "Náš přístup",
    team: "Tým",
    before: "Před návštěvou",
    vouchers: "Dárkové poukazy",
    login: "Přihlásit se",
    account: "Můj účet",
    admin: "Administrace",
    logout: "Odhlásit",
  },
  news: {
    eyebrow: "Aktuality",
    title: "Dárkový zážitek pro každý okamžik",
    copy: "Vyberte si rituál podle potřeby vaší vlasové pokožky nebo darujte klid a péči formou dárkového poukazu. Každý zážitek připravujeme s ohledem na vaši pohodu a individuální potřeby.",
  },
  reviews: {
    eyebrow: "Řekli o nás",
    title: "Odcházíte s lehčí hlavou. Doslova.",
    items: [
      {
        quote:
          "Nádherný zážitek. Klidný přístup, ticho, když ho potřebujete, a masáž, po které opravdu odpočinete.",
        author: "Lucie Jasná",
      },
      {
        quote:
          "Po deseti minutách si přejete, ať to neskončí. Příjemné prostředí a péče, na kterou se těšíte znovu.",
        author: "Anna Mazánková",
      },
      {
        quote:
          "Dlouhý rituál, ze kterého má tělo šanci vypnout. Odcházela jsem lehčí — a s krásnými vlasy.",
        author: "Lucie Čajková",
      },
    ],
  },
  common: {
    reserve: "Rezervovat",
    reserveSlot: "Rezervovat termín",
    menu: "Menu",
    close: "Zavřít",
    back: "Zpět",
    done: "Hotovo",
    continue: "Pokračovat",
    detail: "Detail",
    saving: "Odesílám…",
    total: "Celkem",
    currency: (n: number) => `${n.toLocaleString("cs-CZ")} Kč`,
    locale: "cs-CZ",
    email: "E-mail",
    password: "Heslo",
    login: "Přihlásit se",
    register: "Registrovat",
    account: "Můj účet",
    admin: "Administrace",
    customer: "Zákazník",
  },
  hero: {
    eyebrow: "Head Spa · Hradec Králové",
    title: "Péče, která začíná u kořínků.",
    copy: "Spojujeme diagnostiku vlasové pokožky, čisté rituály a vědomý dotek. Pro zdravější vlasy a hlavu, která konečně vypne.",
    cta: "Vybrat rituál",
    secondary: "Prohlédnout služby",
    gift: "Darovat zážitek",
  },
  approach: {
    eyebrow: "Náš přístup",
    title: "Více než jen relaxace.",
    copy: "Každý rituál skládáme podle potřeb vaší vlasové pokožky. Odbornost a klid u nás nejsou protiklady — patří k sobě.",
    steps: [
      {
        title: "Pozorujeme",
        copy: "Začínáme náhledem na vlasovou pokožku a krátkou konzultací.",
      },
      {
        title: "Pečujeme",
        copy: "Volíme cílenou profesionální kosmetiku podle aktuálních potřeb.",
      },
      {
        title: "Uvolňujeme",
        copy: "Vodní terapie a masáž pomáhají zklidnit tělo i mysl.",
      },
      {
        title: "Dokončujeme",
        copy: "Vlasy šetrně vysušíme a doporučíme jednoduchou domácí péči.",
      },
    ],
  },
  quote: {
    eyebrow: "Váš čas",
    title: "Zpomalit není luxus. Je to péče.",
    copy: "V tichém prostoru bez spěchu se soustředíme na jediného člověka — na vás. Od prvního doteku až po poslední kapku vody.",
    text: "„Odcházela jsem odpočatá a s pocitem lehkosti.“",
    author: "Lucie Čajková",
  },
  servicesSection: {
    eyebrow: "Naše rituály",
    title: "Vyberte péči podle sebe.",
    empty: "V této kategorii zatím nemáme žádný rituál.",
  },
  filters: {
    vse: "Vše",
    zeny: "Pro ženy",
    muzi: "Pro muže",
    deti: "Pro děti",
    par: "Pro dva",
  },
  team: {
    eyebrow: "Lidé za péčí",
    title: "Citlivé ruce. Odborný přístup.",
    people: [
      {
        role: "Zakladatelka a terapeutka",
        copy: "Do každého rituálu vnáší cit pro detail, klid a zkušenost z dlouholeté praxe.",
      },
      {
        role: "Kosmetička a terapeutka",
        copy: "Téměř třicet let kosmetické praxe propojuje s odbornou péčí o vlasovou pokožku.",
      },
      {
        role: "Terapeutka",
        copy: "Vědomým dotekem vytváří bezpečný prostor, ve kterém lze na chvíli zpomalit.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Dopřejte si prostor",
    title: "Vaše chvíle klidu může začít právě teď.",
    reserve: "Rezervovat rituál",
    voucher: "Koupit poukaz",
  },
  reservation: {
    eyebrow: "Rezervace",
    title: "Vyberte si čas pro sebe",
    stepService: "Rituál",
    stepDetails: "Kontaktní údaje",
    submit: "Odeslat rezervaci",
    reserveAnd: "Rezervovat tento rituál",
    success: "Žádost byla úspěšně odeslána.",
    successCopy:
      "Ozveme se vám s potvrzením termínu. Online úhrada bude dostupná po aktivaci plateb.",
    fields: {
      name: "Jméno a příjmení",
      phone: "Telefon",
      email: "E-mail",
      time: "Preferovaný čas",
      therapist: "Terapeutka",
      gift: "Mám dárkový poukaz",
      voucherNo: "Číslo poukazu",
    },
    placeholders: {
      name: "Jana Nováková",
      phone: "+420 777 123 456",
      email: "jana@email.cz",
      voucherNo: "Vyplňte pouze při uplatnění poukazu",
    },
    choose: "Vyberte",
    times: {
      dopoledne: "Dopoledne",
      odpoledne: "Odpoledne",
      kdykoliv: "Kdykoliv",
    },
    noPreference: "Bez preference",
    yes: "Ano",
    no: "Ne",
    consent:
      "Souhlasím s obchodními podmínkami a se zpracováním osobních údajů.",
    errors: {
      name: "Zadejte prosím celé jméno (alespoň 2 znaky).",
      phone: "Zadejte prosím platné telefonní číslo (alespoň 6 číslic).",
      email: "Zadejte prosím platnou e-mailovou adresu.",
      time: "Vyberte prosím preferovaný čas.",
      generic:
        "Žádost se nepodařilo odeslat. Zkontrolujte prosím zadané údaje a zkuste to znovu.",
      network:
        "Spojení se nepodařilo navázat. Zkuste to prosím za chvíli znovu.",
    },
  },
  voucher: {
    eyebrow: "Dárek, který nezůstane ležet",
    title: "Darujte čas pro sebe.",
    copy: "Elektronický poukaz pošleme e-mailem, fyzický připravíme k vyzvednutí v salonu. Platnost a podmínky jsou vždy uvedené přímo na poukazu.",
    byRitual: "Konkrétní rituál",
    byAmount: "Vlastní hodnota",
    chooseRitual: "Vyberte rituál",
    amount: "Hodnota poukazu",
    delivery: "Doručení",
    deliveryEmail: "Elektronicky e-mailem",
    deliveryPickup: "Osobní vyzvednutí",
    submit: "Objednat poukaz",
    success: "Objednávka byla úspěšně odeslána.",
    successCopy:
      "Ozveme se vám s potvrzením a dalšími kroky. Online úhrada bude dostupná po aktivaci plateb.",
    error:
      "Objednávku se nepodařilo odeslat. Zkontrolujte prosím zadané údaje a zkuste to znovu.",
    terms: [
      {
        title: "Platnost",
        copy: "Termín rezervujte s dostatečným předstihem. Platnost poukazu nelze prodloužit.",
      },
      {
        title: "Doručení",
        copy: "Elektronický poukaz obdržíte e-mailem, fyzický si vyzvednete v salonu.",
      },
      {
        title: "Uplatnění",
        copy: "Poukaz nelze směnit za hotovost a nevyužitý zbytek hodnoty se nevrací.",
      },
    ],
  },
  before: {
    title: "Před návštěvou",
    eyebrow: "Praktické informace",
    intro1:
      "Vlasy si umyjte ideálně 24–48 hodin před procedurou. Doporučujeme vyhnout se kofeinovým nápojům, abyste si mohli naplno odpočinout.",
    intro2:
      "Týden před rezervovaným termínem vám pošleme e-mailem krátký dotazník. Díky němu péči připravíme přesně pro vás.",
    blocks: [
      {
        title: "Platba",
        copy: "Online platba bude dostupná po aktivaci plateb. Do té doby potvrdíme způsob úhrady společně s termínem.",
      },
      {
        title: "Příchod",
        copy: "Dorazte prosím 5 minut před začátkem rezervace. Pokud přijdete dříve, posaďte se u nás v čekárně.",
      },
      {
        title: "Jak nás najdete",
        copy: "Akademika Heyrovského 1178/6, Hradec Králové. Vyjeďte výtahem do 3. patra a dejte se vlevo. Parkovat můžete v okolních ulicích.",
      },
      {
        title: "Důležité informace",
        copy: "Rezervaci lze zrušit zdarma nejpozději 48 hodin předem. Při pozdějším zrušení účtujeme 50 % ceny, při nedostavení 100 % ceny.",
      },
      {
        title: "Dárkové poukazy",
        copy: "Poukaz vezměte s sebou. Platnost nelze prodloužit, proto doporučujeme objednat se alespoň 3 měsíce před jejím koncem.",
      },
    ],
  },
  footer: {
    tagline:
      "Vědomá péče o vlasovou pokožku, vlasy a vnitřní klid v srdci Hradce Králové.",
    visit: "Návštěva",
    info: "Informace",
    contact: "Kontakt",
    map: "Zobrazit na mapě",
    floor: "3. patro",
    hours: "Termíny podle rezervace",
    rights: "Všechna práva vyhrazena.",
    terms: "Obchodní podmínky",
  },
};

const en: Dict = {
  langName: "English",
  nav: {
    home: "Home",
    services: "Services",
    prices: "Pricing",
    gallery: "Gallery",
    about: "About",
    news: "News",
    contact: "Contact",
    rituals: "Rituals",
    approach: "Our approach",
    team: "Team",
    before: "Before your visit",
    vouchers: "Gift vouchers",
    login: "Log in",
    account: "My account",
    admin: "Admin",
    logout: "Log out",
  },
  news: {
    eyebrow: "News",
    title: "A gift experience for any moment",
    copy: "Choose a ritual based on your scalp and hair needs, or give the gift of calm and care with a personalised voucher. Every experience is tailored to provide comfort, restoration and a sense of ease.",
  },
  reviews: {
    eyebrow: "Kind words",
    title: "You leave with a lighter head. Literally.",
    items: [
      {
        quote:
          "A beautiful experience. A calm approach, silence when you need it, and a massage that truly lets you rest.",
        author: "Lucie Jasná",
      },
      {
        quote:
          "After ten minutes you wish it would never end. A warm space and care you look forward to again.",
        author: "Anna Mazánková",
      },
      {
        quote:
          "A long ritual that actually lets the body switch off. I left lighter — and with beautiful hair.",
        author: "Lucie Čajková",
      },
    ],
  },
  common: {
    reserve: "Book",
    reserveSlot: "Book an appointment",
    menu: "Menu",
    close: "Close",
    back: "Back",
    done: "Done",
    continue: "Continue",
    detail: "Details",
    saving: "Sending…",
    total: "Total",
    currency: (n: number) => `${n.toLocaleString("en-GB")} CZK`,
    locale: "en-GB",
    email: "Email",
    password: "Password",
    login: "Log in",
    register: "Register",
    account: "My account",
    admin: "Admin",
    customer: "Customer",
  },
  hero: {
    eyebrow: "Head Spa · Hradec Králové",
    title: "Care that starts at the roots.",
    copy: "We combine scalp diagnostics, clean rituals and mindful touch — for healthier hair and a mind that finally switches off.",
    cta: "Choose a ritual",
    secondary: "View services",
    gift: "Give an experience",
  },
  approach: {
    eyebrow: "Our approach",
    title: "More than relaxation.",
    copy: "Every ritual is built around what your scalp needs. Expertise and calm are not opposites here — they belong together.",
    steps: [
      {
        title: "We observe",
        copy: "We begin with a close look at your scalp and a short consultation.",
      },
      {
        title: "We treat",
        copy: "We select targeted professional products for your current needs.",
      },
      {
        title: "We release",
        copy: "Water therapy and massage help calm both body and mind.",
      },
      {
        title: "We finish",
        copy: "We dry your hair gently and suggest a simple home routine.",
      },
    ],
  },
  quote: {
    eyebrow: "Your time",
    title: "Slowing down isn't a luxury. It's care.",
    copy: "In a quiet, unhurried space we focus on one person only — you. From the first touch to the last drop of water.",
    text: "“I left rested and feeling light.”",
    author: "Lucie Čajková",
  },
  servicesSection: {
    eyebrow: "Our rituals",
    title: "Choose the care that suits you.",
    empty: "There are no rituals in this category yet.",
  },
  filters: {
    vse: "All",
    zeny: "For women",
    muzi: "For men",
    deti: "For children",
    par: "For two",
  },
  team: {
    eyebrow: "The people behind the care",
    title: "Gentle hands. Expert approach.",
    people: [
      {
        role: "Founder and therapist",
        copy: "She brings an eye for detail, calm and years of hands-on experience to every ritual.",
      },
      {
        role: "Cosmetologist and therapist",
        copy: "Almost thirty years of skincare practice combined with expert scalp care.",
      },
      {
        role: "Therapist",
        copy: "Through mindful touch she creates a safe space where you can truly slow down.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Make room for yourself",
    title: "Your moment of calm can start right now.",
    reserve: "Book a ritual",
    voucher: "Buy a voucher",
  },
  reservation: {
    eyebrow: "Booking",
    title: "Choose time for yourself",
    stepService: "Ritual",
    stepDetails: "Contact details",
    submit: "Send booking request",
    reserveAnd: "Book this ritual",
    success: "Your request has been submitted successfully.",
    successCopy:
      "We'll get back to you to confirm the date and time. Online payment will be available once payments are activated.",
    fields: {
      name: "Full name",
      phone: "Phone",
      email: "Email",
      time: "Preferred time",
      therapist: "Therapist",
      gift: "I have a gift voucher",
      voucherNo: "Voucher number",
    },
    placeholders: {
      name: "Jane Novak",
      phone: "+420 777 123 456",
      email: "jane@email.com",
      voucherNo: "Only if you are redeeming a voucher",
    },
    choose: "Select",
    times: {
      dopoledne: "Morning",
      odpoledne: "Afternoon",
      kdykoliv: "Any time",
    },
    noPreference: "No preference",
    yes: "Yes",
    no: "No",
    consent:
      "I agree to the terms and conditions and to the processing of my personal data.",
    errors: {
      name: "Please enter your full name (at least 2 characters).",
      phone: "Please enter a valid phone number (at least 6 digits).",
      email: "Please enter a valid email address.",
      time: "Please choose a preferred time.",
      generic:
        "We couldn't send your request. Please check your details and try again.",
      network: "We couldn't reach the server. Please try again in a moment.",
    },
  },
  voucher: {
    eyebrow: "A gift that won't sit in a drawer",
    title: "Give the gift of time.",
    copy: "We send digital vouchers by email and prepare printed ones for pickup in the salon. Validity and conditions are always stated on the voucher.",
    byRitual: "A specific ritual",
    byAmount: "Custom value",
    chooseRitual: "Choose a ritual",
    amount: "Voucher value",
    delivery: "Delivery",
    deliveryEmail: "Digitally by email",
    deliveryPickup: "Pickup in the salon",
    submit: "Order voucher",
    success: "Your order has been submitted successfully.",
    successCopy:
      "We'll contact you with confirmation and next steps. Online payment will be available once payments are activated.",
    error:
      "We couldn't send your order. Please check your details and try again.",
    terms: [
      {
        title: "Validity",
        copy: "Book well in advance — voucher validity cannot be extended.",
      },
      {
        title: "Delivery",
        copy: "Digital vouchers arrive by email, printed ones are collected in the salon.",
      },
      {
        title: "Redemption",
        copy: "Vouchers cannot be exchanged for cash and unused value is not refunded.",
      },
    ],
  },
  before: {
    title: "Before your visit",
    eyebrow: "Practical information",
    intro1:
      "Wash your hair ideally 24–48 hours before the treatment. We also recommend avoiding caffeine so you can fully relax.",
    intro2:
      "One week before your appointment we'll email you a short questionnaire so we can tailor the care precisely to you.",
    blocks: [
      {
        title: "Payment",
        copy: "Online payment will be available once payments are activated. Until then we confirm the payment method together with your appointment.",
      },
      {
        title: "Arrival",
        copy: "Please arrive 5 minutes before your appointment. If you come earlier, take a seat in our waiting area.",
      },
      {
        title: "Finding us",
        copy: "Akademika Heyrovského 1178/6, Hradec Králové. Take the lift to the 3rd floor and turn left. Street parking is available nearby.",
      },
      {
        title: "Important information",
        copy: "Appointments can be cancelled free of charge up to 48 hours in advance. Later cancellations are charged at 50 %, no-shows at 100 % of the price.",
      },
      {
        title: "Gift vouchers",
        copy: "Please bring your voucher with you. Validity cannot be extended, so book at least 3 months before it expires.",
      },
    ],
  },
  footer: {
    tagline:
      "Mindful care for your scalp, your hair and your inner calm in the heart of Hradec Králové.",
    visit: "Visit us",
    info: "Information",
    contact: "Contact",
    map: "Show on map",
    floor: "3rd floor",
    hours: "Appointments by reservation",
    rights: "All rights reserved.",
    terms: "Terms and conditions",
  },
};

const dictionaries: Record<Lang, Dict> = { cs, en };

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}>({ lang: "cs", setLang: () => {}, t: cs });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("cs");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    if (stored === "cs" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t: dictionaries[lang] }),
    [lang, setLang],
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  return useContext(LangContext);
}
