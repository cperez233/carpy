import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * En desarrollo, llena el <head> con las etiquetas del idioma de la URL.
 * En el build se dejan las marcas: `scripts/prerender.mjs` escribe una
 * pagina por idioma (`/` y `/en`).
 */
function devHead(): Plugin {
  return {
    name: "carpy-dev-head",
    apply: "serve",
    transformIndexHtml: async (html, ctx) => {
      if (!ctx.server) return html;
      const { buildHead } = await ctx.server.ssrLoadModule("/src/seo/head.ts");
      const { dicts, localeFromPath } = await ctx.server.ssrLoadModule("/src/i18n/locales.ts");
      const locale = localeFromPath(ctx.originalUrl ?? ctx.path);
      return html
        .replace('<html lang="es-CO">', `<html lang="${dicts[locale].meta.htmlLang}">`)
        .replace("<!--head-->", buildHead(locale));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devHead()],
  server: { port: 5175, strictPort: true },
  preview: { port: 4175, strictPort: true },
});
