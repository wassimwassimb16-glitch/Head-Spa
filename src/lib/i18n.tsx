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

export const CONTACT_PLACEHOLDERS = {
  phone: "---",
  address: "---",
  email: "---",
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
    eyebrow: "Rezervace",
    title: "Rezervujte si rituál a nechte se zklidnit",
    copy: "Vyberte si termín online během několika minut. Vše je navrženo tak, aby bylo rezervování jednoduché, rychlé a přehledné pro každého klienta.",
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
  auth: {
    titleLogin: "Přihlášení",
    titleRegister: "Registrace",
    subtitle:
      "Pro rezervaci, správu termínů a přístup do zákaznického účtu se přihlaste s vaším e-mailem a heslem.",
    signIn: "Přihlásit se",
    signUp: "Registrovat",
    signInButton: "Přihlásit se",
    signUpButton: "Vytvořit účet",
    submit: "Odesílám...",
    firstName: "Jméno",
    lastName: "Příjmení",
    phone: "Telefon",
    confirmPassword: "Potvrdit heslo",
    customerAccount: "Zákaznický účet",
    secureAccess: "Bezpečný přístup",
    secureText:
      "Váš účet vám umožní spravovat rezervace, sledovat platby a přístup k osobním údajům.",
    adminAccess: "Administrace",
    adminText:
      "Pouze uživatel s rolí administrátora má přístup na panel /admin po přihlášení.",
    backToHome: "Zpět na hlavní stránku",
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
    paymentRequired:
      "Platba kartou je nutná pro potvrzení rezervace a zajištění termínu.",
    payNow: "Pokračovat k platbě",
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
        copy: "Platba kartou probíhá bezpečně přes Stripe. Rezervace je potvrzena po úspěšné úhradě.",
      },
      {
        title: "Příchod",
        copy: "Dorazte prosím 5 minut před začátkem rezervace. Pokud přijdete dříve, posaďte se u nás v čekárně.",
      },
      {
        title: "Jak nás najdete",
        copy: `Adresa: ${CONTACT_PLACEHOLDERS.address}. Pro přesné návštěvní instrukce nás kontaktujte před příjezdem.`,
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
    eyebrow: "Booking",
    title: "Book your ritual and enjoy a calmer moment",
    copy: "Reserve your appointment online in minutes. The process is simple, fast, and designed to make booking feel effortless for every guest.",
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
    copy: "We combine scalp diagnostics, mindful rituals and gentle touch to support healthier hair and a calmer mind.",
    cta: "Choose a ritual",
    secondary: "View services",
    gift: "Give an experience",
  },
  approach: {
    eyebrow: "Our approach",
    title: "More than relaxation.",
    copy: "Every ritual is designed around your scalp and your needs. Expertise and calm are not opposites here — they belong together.",
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
        copy: "We dry your hair gently and suggest a simple at-home routine.",
      },
    ],
  },
  quote: {
    eyebrow: "Your time",
    title: "Slowing down is not a luxury. It is care.",
    copy: "In a quiet, unhurried space we focus on one person only — you. From the first touch to the last drop of water.",
    text: "“I left feeling rested and lighter.”",
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
  auth: {
    titleLogin: "Log in",
    titleRegister: "Register",
    subtitle:
      "Log in with your email and password to book, manage your appointments, and access your customer account.",
    signIn: "Log in",
    signUp: "Register",
    signInButton: "Log in",
    signUpButton: "Create account",
    submit: "Signing in...",
    firstName: "First name",
    lastName: "Last name",
    phone: "Phone",
    confirmPassword: "Confirm password",
    customerAccount: "Customer account",
    secureAccess: "Secure access",
    secureText:
      "Your account lets you manage reservations, monitor payments and access your personal details.",
    adminAccess: "Administration",
    adminText:
      "Only a user with the administrator role can access the /admin panel after signing in.",
    backToHome: "Back to homepage",
  },
  reservation: {
    eyebrow: "Booking",
    title: "Choose a time for yourself",
    stepService: "Ritual",
    stepDetails: "Contact details",
    submit: "Send booking request",
    reserveAnd: "Book this ritual",
    success: "Your reservation is pending payment.",
    successCopy:
      "The appointment request has been created. Please complete the payment to secure your time slot and receive confirmation.",
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
    paymentRequired:
      "Payment is required to confirm the booking and secure your time slot.",
    payNow: "Pay now",
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
    eyebrow: "A thoughtful gift",
    title: "Give the gift of time.",
    copy: "We send digital vouchers by email and prepare printed vouchers for pickup in the salon. Validity and terms are always stated directly on the voucher.",
    byRitual: "A specific ritual",
    byAmount: "Custom value",
    chooseRitual: "Choose a ritual",
    amount: "Voucher value",
    delivery: "Delivery",
    deliveryEmail: "Digital by email",
    deliveryPickup: "Pickup in the salon",
    submit: "Order voucher",
    success: "Your order has been submitted successfully.",
    successCopy:
      "We'll contact you with confirmation and next steps. Payment is required to confirm and secure the voucher order.",
    error:
      "We couldn't send your order. Please check your details and try again.",
    terms: [
      {
        title: "Validity",
        copy: "Please book in advance — voucher validity cannot be extended.",
      },
      {
        title: "Delivery",
        copy: "Digital vouchers are sent by email, while printed vouchers can be collected in the salon.",
      },
      {
        title: "Redemption",
        copy: "Vouchers cannot be exchanged for cash, and any unused value is non-refundable.",
      },
    ],
  },
  before: {
    title: "Before your visit",
    eyebrow: "Practical information",
    intro1:
      "Wash your hair ideally 24–48 hours before the treatment. We also recommend avoiding caffeine so you can fully relax.",
    intro2:
      "One week before your appointment, we'll send you a short questionnaire so we can tailor the treatment precisely to you.",
    blocks: [
      {
        title: "Payment",
        copy: "Payment is processed securely through Stripe. Your booking is confirmed after successful payment.",
      },
      {
        title: "Arrival",
        copy: "Please arrive 5 minutes before your appointment. If you come earlier, feel free to take a seat in our waiting area.",
      },
      {
        title: "Finding us",
        copy: `Address: ${CONTACT_PLACEHOLDERS.address}. Please get in touch before your visit for directions and access details.`,
      },
      {
        title: "Important information",
        copy: "Appointments can be cancelled free of charge up to 48 hours in advance. Later cancellations are charged at 50%, and no-shows are charged at 100% of the price.",
      },
      {
        title: "Gift vouchers",
        copy: "Please bring your voucher with you. Validity cannot be extended, so we recommend booking at least 3 months before it expires.",
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
