import { site } from "../data/site";
import { services } from "../data/content";
import { activeTeam } from "../data/team";

/**
 * Grafo de entidades: Organization + WebSite + WebPage + Service por linea +
 * Person por socio activo. Solo datos visibles en la pagina.
 */
export function buildJsonLd() {
  const base = site.url;
  const org = `${base}/#organization`;
  const modified = `${site.lastModified}T00:00:00-05:00`;

  const people = activeTeam.map((m) => ({
    "@type": "Person",
    "@id": `${base}/#${m.id}`,
    name: m.name,
    jobTitle: m.role,
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
        description:
          "Consultoría de software: desarrollo a medida, integraciones y automatización, y auditoría de software, procesos de negocio y seguridad.",
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
          { "@type": "Place", name: "Latinoamérica (remoto)" },
        ],
        founder: people.map((p) => ({ "@id": p["@id"] })),
        knowsAbout: [
          "Desarrollo de software full-stack",
          "Auditoría de software",
          "Auditoría de procesos de negocio",
          "Ciberseguridad",
          "Seguridad de infraestructura",
          "Pruebas de penetración",
          "Arquitectura cloud",
          "Automatización de procesos",
          "Inteligencia artificial aplicada",
        ],
        ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: `${base}/`,
        name: site.name,
        inLanguage: site.locale,
        publisher: { "@id": org },
      },
      {
        "@type": "WebPage",
        "@id": `${base}/#webpage`,
        url: `${base}/`,
        name: "Software a medida, integraciones y auditoría | carpy",
        isPartOf: { "@id": `${base}/#website` },
        about: { "@id": org },
        inLanguage: site.locale,
        dateModified: modified,
      },
      ...services.map((s) => ({
        "@type": "Service",
        "@id": `${base}/#servicio-${s.id}`,
        name: s.title,
        serviceType: s.serviceType,
        description: s.summary,
        provider: { "@id": org },
        areaServed: { "@type": "Country", name: site.country },
        url: `${base}/#servicio-${s.id}`,
      })),
      ...people,
    ],
  };
}
