import { site } from "../data/site";
import { dicts, LANG_KEY, localeUrl, locales, type Locale } from "../i18n/locales";

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Detecta el idioma antes del primer pintado: si la persona eligio uno en el
 * selector, se respeta; si no, se usa el primer idioma del navegador (espanol
 * se queda en `/`, cualquier otro va a `/en`). Los bots no se redirigen: cada
 * version se indexa en su URL y se enlazan con hreflang.
 */
const detect = `(function(){try{var p=location,en=/^\\/en(\\/|$)/.test(p.pathname),w=null;try{w=localStorage.getItem("${LANG_KEY}")}catch(e){}if(w!=="es"&&w!=="en"){if(/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|slack|discord|embed|preview|lighthouse|headless/i.test(navigator.userAgent))return;var l=((navigator.languages&&navigator.languages[0])||navigator.language||"es").toLowerCase();w=l.indexOf("es")===0?"es":"en"}if(w==="en"&&!en)p.replace("/en"+p.search+p.hash);else if(w==="es"&&en)p.replace("/"+p.search+p.hash)}catch(e){}})();`;

/** Etiquetas del <head> que cambian con el idioma. */
export function buildHead(locale: Locale): string {
  const m = dicts[locale].meta;
  const url = localeUrl(locale);
  const image = `${site.url}/og-image.png`;
  const alternates = [
    ...locales.map((l) => `<link rel="alternate" hreflang="${l}" href="${localeUrl(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${localeUrl("es")}" />`,
  ];
  const otherOg = locales.filter((l) => l !== locale).map((l) => `<meta property="og:locale:alternate" content="${dicts[l].meta.ogLocale}" />`);
  return [
    `<script>${detect}</script>`,
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${m.ogLocale}" />`,
    ...otherOg,
    `<meta property="og:site_name" content="${site.name}" />`,
    `<meta property="og:title" content="${esc(m.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(m.ogDescription)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(m.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.ogTitle)}" />`,
    `<meta name="twitter:description" content="${esc(m.ogDescription)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join("\n    ");
}
