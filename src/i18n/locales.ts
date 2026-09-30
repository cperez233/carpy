import { site } from "../data/site";
import { en } from "./en";
import { es } from "./es";
import type { Dict, Locale } from "./types";

export type { Dict, Locale };

/** Espanol en `/` (idioma principal) e ingles en `/en`. */
export const locales: Locale[] = ["es", "en"];
export const defaultLocale: Locale = "es";
export const dicts: Record<Locale, Dict> = { es, en };

/** Preferencia elegida a mano en el selector; gana sobre el idioma del navegador. */
export const LANG_KEY = "carpy:lang";

export function localePath(locale: Locale): string {
  return locale === "en" ? "/en" : "/";
}

export function localeUrl(locale: Locale): string {
  return locale === "en" ? `${site.url}/en` : `${site.url}/`;
}

export function localeFromPath(pathname: string): Locale {
  return /^\/en(\/|$)/.test(pathname) ? "en" : "es";
}
