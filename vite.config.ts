import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { site } from "./src/data/site.ts";

/** Reemplaza %SITE_URL% en index.html con el dominio de `src/data/site.ts`. */
function siteUrl(): Plugin {
  return {
    name: "carpy-site-url",
    transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", site.url),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrl()],
  server: { port: 5175, strictPort: true },
  preview: { port: 4175, strictPort: true },
});
