import { site } from "../data/site";
import { activeTeam } from "../data/team";
import { dicts, localeUrl, type Locale } from "../i18n/locales";

/**
 * Grafo de entidades: Organization + WebSite + WebPage + Service por linea +
 * Person por socio activo. Solo datos visibles en la pagina, en el idioma de
 * la pagina. La organizacion y las personas comparten `@id` entre idiomas.
 */
export function buildJsonLd(locale: Locale) {
  const t = dicts[locale];
  const base = site.url;
  const page = localeUrl(locale);
  const org = `${base}/#organization`;
  const modified = `${site.lastModified}T00:00:00-05:00`;

  const people = activeTeam.map((m) => ({
    "@type": "Person",
    "@id": `${base}/#${m.id}`,
    name: m.name,
    jobTitle: m.copy[locale].role,
    ...(m.photo ? { image: `${base}${m.photo.src}` } : {}),
    ...(m.portfolio ? { url: m.portfolio.href } : {}),
    sameAs: [m.portfolio?.href, ...m.links.map((l) => l.href)].filter(Boolean),
    worksFor: { "@id": org },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: site.name,
        url: `${base}/`,
        description: t.jsonLd.orgDescription,
        logo: { "@type": "ImageObject", url: `${base}/icon-512.png`, width: 512, height: 512 },
        image: `${base}/og-image.png`,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: site.countryCode,
        },
        areaServed: [
          { "@type": "City", name: site.city },
          { "@type": "Country", name: site.country },
          { "@type": "Place", name: t.jsonLd.remote },
        ],
        founder: people.map((p) => ({ "@id": p["@id"] })),
        knowsAbout: t.jsonLd.knowsAbout,
        ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: site.name,
        inLanguage: ["es-CO", "en"],
        publisher: { "@id": org },
      },
      {
        "@type": "WebPage",
        "@id": `${page}#webpage`,
        url: page,
        name: t.meta.title,
        isPartOf: { "@id": `${base}/#website` },
        about: { "@id": org },
        inLanguage: t.meta.htmlLang,
        dateModified: modified,
      },
      ...t.services.items.map((s) => ({
        "@type": "Service",
        "@id": `${page}#servicio-${s.id}`,
        name: s.title,
        serviceType: s.serviceType,
        description: s.summary,
        provider: { "@id": org },
        areaServed: { "@type": "Country", name: site.country },
        url: `${page}#servicio-${s.id}`,
      })),
      ...people,
    ],
  };
}
