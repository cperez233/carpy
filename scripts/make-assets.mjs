/**
 * Genera favicon, iconos, imagen OG y la foto del equipo desde las fuentes
 * en assets-src/. Se corre a mano: `npm run assets`.
 * La imagen OG se renderiza con Edge/Chrome headless para usar las fuentes reales.
 */
import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");


// Icono: la cabeza del capibara con la mandarina (assets-src/badge.svg), sobre papel.
const badge = await readFile(path.join(root, "assets-src", "badge.svg"), "utf8");
const icon = badge.replace('viewBox="0 0 120 120">', 'viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#efe9dd"/>');
await writeFile(path.join(pub, "favicon.svg"), icon);
for (const [name, size] of [["favicon-32.png", 32], ["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
  await sharp(Buffer.from(icon), { density: 600 }).resize(size, size).png().toFile(path.join(pub, name));
}

await writeFile(
  path.join(pub, "site.webmanifest"),
  JSON.stringify(
    {
      name: "carpy",
      short_name: "carpy",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: "#efe9dd",
      background_color: "#efe9dd",
      display: "standalone",
    },
    null,
    2,
  ),
);

// Foto del equipo: 4:5, recorte centrado arriba.
const photo = path.join(root, "assets-src", "cristian-perez.png");
if (existsSync(photo)) {
  await sharp(photo).resize(800, 1000, { fit: "cover", position: "top" }).webp({ quality: 80 }).toFile(path.join(pub, "team", "cristian-perez.webp"));
}

// Imagen OG 1200x630.
const browsers = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/chromium",
  "/usr/bin/google-chrome",
];
const browser = browsers.find((b) => existsSync(b));
if (browser) {
  const tmp = path.join(root, "assets-src", "og-raw.png");
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    `--screenshot=${tmp}`,
    pathToFileURL(path.join(root, "assets-src", "og.html")).href,
  ]);
  await sharp(tmp).resize(1200, 630).png({ compressionLevel: 9 }).toFile(path.join(pub, "og-image.png"));
} else {
  console.warn("No se encontro Chrome/Edge: og-image.png no se regenero.");
}
console.log("Assets listos en public/");
