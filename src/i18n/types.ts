import type { Faq, NavItem, ProcessStep, RequestType, Service } from "../data/content";

export type Locale = "es" | "en";

/** Todos los textos de la pagina en un idioma. `en.ts` debe cubrir lo mismo que `es.ts`. */
export interface Dict {
  meta: {
    /** Atributo `lang` del documento. */
    htmlLang: string;
    ogLocale: string;
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImageAlt: string;
  };
  /** Nombre del idioma en su propio idioma ("Español", "English"). */
  langName: string;
  tagline: string;
  a11y: {
    skip: string;
    home: string;
    mainNav: string;
    mobileNav: string;
    backToTop: string;
    language: string;
    /** "GitHub de Cristian (abre en otra pestana)". */
    profileLink: (label: string, name: string) => string;
  };
  nav: {
    items: NavItem[];
    cta: string;
    menu: string;
    close: string;
    sections: string;
    services: string;
    contactForm: string;
  };
  whatsapp: { project: string; question: string };
  hero: {
    kicker: string;
    line1: string;
    line2: string;
    promise: string;
    lead: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    caption: string;
  };
  scene: { label: string; issues: { before: string; after: string }[] };
  current: string[];
  services: {
    label: string;
    title: string;
    intro: string;
    receive: string;
    otherTitle: string;
    otherBody: string;
    items: Service[];
  };
  visuals: {
    software: { title: string; product: string; stock: string; status: string; low: string; ok: string; rows: string[]; footer: string };
    integration: { title: string; events: string[]; footer: string };
    audit: { eyebrow: string; name: string; high: string; footer: string; findings: { area: string; title: string; note: string }[] };
    web: { title: string; shop: string; order: string; products: string[]; prices: string[]; cta: string; pay: string };
    data: { title: string; label: string; days: string[]; footer: string; numberLocale: string };
    support: { title: string; checks: { label: string; ok: string }[]; slow: string; alertSlow: string; alertFixed: string };
  };
  process: {
    forWhom: string;
    statement: string;
    label: string;
    title: string;
    intro: string;
    step: (n: number) => string;
    steps: ProcessStep[];
    promisesTitle: string;
    promises: string[];
  };
  team: {
    label: string;
    title: string;
    intro: string;
    see: (name: string) => string;
    stack: string;
    portfolio: string;
    seal: string;
  };
  faq: { label: string; title: string; notHere: string; askWhatsapp: string; items: Faq[] };
  contact: { label: string; title: string; writeTo: string; orBy: string; reply: string };
  form: {
    need: string;
    name: string;
    org: string;
    optional: string;
    email: string;
    message: string;
    placeholder: string;
    errName: string;
    errEmail: string;
    errMessage: string;
    /** Primera frase del mensaje: "Hola, soy Ana de Tienda X." */
    hello: (name: string, org: string) => string;
    yourName: string;
    yourMessage: string;
    yourEmail: string;
    myEmail: string;
    to: string;
    subject: string;
    sentTitle: string;
    mailTitle: string;
    sentBody: string;
    mailBody: (email: string) => string;
    otherApp: string;
    copyMessage: string;
    copied: string;
    back: string;
    sendWhatsapp: string;
    sending: string;
    sendEmail: string;
    errorA: string;
    errorLink: string;
    errorB: string;
    privacy: string;
    previewTitle: string;
    now: string;
    trap: string;
    requestTypes: RequestType[];
  };
  email: { subject: string; app: string; copy: string; copied: string };
  footer: { blurb: string; madeBy: string };
  jsonLd: { orgDescription: string; knowsAbout: string[]; remote: string };
}
