/**
 * Prerender de la landing: escribe el HTML completo (contenido, enlaces y
 * JSON-LD) de cada idioma, dist/index.html (es) y dist/en.html (en), para que buscadores, crawlers de IA y
 * previews sociales lo lean sin ejecutar JavaScript. Tambien genera
 * robots.txt, sitemap.xml, llms.txt y 404.html desde los mismos datos.
 */
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href;
const { render, buildJsonLd, buildHead, site, activeTeam, dicts, locales, localeUrl } = await import(ssrEntry);

// Una pagina por idioma: dist/index.html (es, en `/`) y dist/en.html (en `/en`).
const template = await readFile(path.join(dist, "index.html"), "utf8");
for (const locale of locales) {
  const ld = `<script type="application/ld+json">${JSON.stringify(buildJsonLd(locale)).replace(/</g, "\\u003c")}</script>`;
  const html = template
    .replace('<html lang="es-CO">', `<html lang="${dicts[locale].meta.htmlLang}">`)
    .replace("<!--head-->", buildHead(locale))
    .replace("<!--json-ld-->", ld)
    .replace("<!--app-html-->", render(locale));
  await writeFile(path.join(dist, locale === "es" ? "index.html" : `${locale}.html`), html);
}

await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *
Allow: /

# Buscadores de IA (busqueda y citas)
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
Allow: /

Sitemap: ${site.url}/sitemap.xml
`,
);

const alternates = [...locales.map((l) => [l, localeUrl(l)]), ["x-default", localeUrl("es")]]
  .map(([l, href]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${href}" />`)
  .join("\n");
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${locales
  .map(
    (l) => `  <url>
    <loc>${localeUrl(l)}</loc>
${alternates}
    <lastmod>${site.lastModified}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);

const es = dicts.es;
const llms = [
  `# ${site.name}`,
  ``,
  `> ${es.tagline} en ${site.city}, ${site.country}. Software a medida, integraciones y automatización, y auditoría de software, procesos de negocio y seguridad para empresas y entidades públicas.`,
  ``,
  `English version: ${localeUrl("en")}`,
  ``,
  `## Servicios`,
  ...es.services.items.map((s) => `- [${s.title}](${site.url}/#servicio-${s.id}): ${s.summary} ${es.services.receive}${s.deliverable}`),
  ``,
  `## Equipo`,
  ...activeTeam.map((m) => `- ${m.name}, ${m.copy.es.role}${m.portfolio ? `: ${m.portfolio.href}` : ""}`),
  ``,
  `## Preguntas frecuentes`,
  ...es.faq.items.map((f) => `- ${f.q} ${f.a}`),
  ``,
  `## Contacto`,
  `- Correo: ${site.email}`,
  `- Formulario y agenda: ${site.url}/#contacto`,
  ``,
].join("\n");
await writeFile(path.join(dist, "llms.txt"), llms);

// 404: misma hoja de estilos, sin indexar.
const cssHref = template.match(/href="(\/assets\/[^"]+\.css)"/)?.[1];
await writeFile(
  path.join(dist, "404.html"),
  `<!doctype html>
<html lang="es-CO">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Página no encontrada | carpy</title>
<meta name="robots" content="noindex" />
<meta name="theme-color" content="#efe9dd" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
${cssHref ? `<link rel="stylesheet" href="${cssHref}" />` : ""}
</head>
<body>
<main class="mx-auto flex min-h-svh max-w-[40rem] flex-col justify-center px-6">
<p class="text-[1rem] font-semibold text-mandarina-ink">Error 404</p>
<h1 class="mt-4 font-display text-[clamp(2.5rem,6vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.035em] text-ink">Esta página se fue río abajo.</h1>
<p class="mt-5 text-[1.06rem] leading-[1.65] text-ink-3">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
<p lang="en" class="mt-2 text-[1rem] leading-[1.6] text-ink-3">This page drifted downstream. The link may be misspelled, or the page may have moved.</p>
<div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
<a href="/" class="inline-flex min-h-12 w-fit items-center rounded-full bg-ink px-6 font-semibold text-paper-2">Volver al inicio de carpy</a>
<a href="/en" hreflang="en" lang="en" class="inline-flex min-h-12 items-center font-semibold text-ink underline decoration-mandarina decoration-2 underline-offset-4">Back to carpy in English</a>
</div>
</main>
</body>
</html>
`,
);

await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log("Prerender listo: index.html, en.html, 404.html, robots.txt, sitemap.xml, llms.txt");
