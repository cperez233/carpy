/**
 * Prerender de la landing: escribe el HTML completo (contenido, enlaces y
 * JSON-LD) en dist/index.html para que buscadores, crawlers de IA y
 * previews sociales lo lean sin ejecutar JavaScript. Tambien genera
 * robots.txt, sitemap.xml, llms.txt y 404.html desde los mismos datos.
 */
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href;
const { render, jsonLd, site, services, faqs, activeTeam } = await import(ssrEntry);

const template = await readFile(path.join(dist, "index.html"), "utf8");
const ldScript = `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\u003c")}</script>`;
const html = template.replace("<!--json-ld-->", ldScript).replace("<!--app-html-->", render());
await writeFile(path.join(dist, "index.html"), html);

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

await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}/</loc>
    <lastmod>${site.lastModified}</lastmod>
  </url>
</urlset>
`,
);

const llms = [
  `# ${site.name}`,
  ``,
  `> ${site.tagline} en ${site.city}, ${site.country}. Software a medida, integraciones y automatización, y auditoría de software, procesos de negocio y seguridad para empresas y entidades públicas.`,
  ``,
  `## Servicios`,
  ...services.map((s) => `- [${s.title}](${site.url}/#servicio-${s.id}): ${s.summary} Recibes: ${s.deliverable}`),
  ``,
  `## Equipo`,
  ...activeTeam.map((m) => `- ${m.name}, ${m.role}${m.portfolio ? `: ${m.portfolio.href}` : ""}`),
  ``,
  `## Preguntas frecuentes`,
  ...faqs.map((f) => `- ${f.q} ${f.a}`),
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
<a href="/" class="mt-8 inline-flex min-h-12 w-fit items-center rounded-full bg-ink px-6 font-semibold text-paper-2">Volver al inicio de carpy</a>
</main>
</body>
</html>
`,
);

await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log("Prerender listo: index.html, 404.html, robots.txt, sitemap.xml, llms.txt");
