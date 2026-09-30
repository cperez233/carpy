import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { LanguageCurtain } from "../components/ui/LanguageCurtain";
import { dicts, LANG_KEY, localeFromPath, localePath, localeUrl, type Dict, type Locale } from "./locales";

interface I18n {
  locale: Locale;
  t: Dict;
  /** Idioma al que se esta cambiando (el selector se mueve antes que la pagina). */
  target: Locale;
  switchLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18n | null>(null);

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n fuera de LocaleProvider");
  return ctx;
}

/** Titulo, descripcion, idioma y canonical del documento, para el idioma activo. */
function syncHead(locale: Locale) {
  const m = dicts[locale].meta;
  document.documentElement.lang = m.htmlLang;
  document.title = m.title;
  const set = (sel: string, attr: string, value: string) => document.querySelector(sel)?.setAttribute(attr, value);
  set('meta[name="description"]', "content", m.description);
  set('link[rel="canonical"]', "href", localeUrl(locale));
  set('meta[property="og:locale"]', "content", m.ogLocale);
  set('meta[property="og:title"]', "content", m.ogTitle);
  set('meta[property="og:description"]', "content", m.ogDescription);
  set('meta[property="og:url"]', "content", localeUrl(locale));
}

/**
 * Cambio de idioma sin recargar: el rio sube, cubre la pagina, los textos se
 * cambian debajo y el agua sigue su camino hacia arriba. La URL pasa a `/` o
 * `/en` para que el enlace compartido abra en el mismo idioma.
 */
export function LocaleProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const reduce = useReducedMotion();
  const [locale, setLocale] = useState<Locale>(initial);
  const [curtain, setCurtain] = useState<{ to: Locale; covered: boolean } | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    syncHead(locale);
  }, [locale]);

  const go = useCallback(
    (next: Locale, push: boolean) => {
      if (curtain) return;
      if (push && localeFromPath(window.location.pathname) !== next) {
        history.pushState(null, "", localePath(next) + window.location.search);
      }
      if (next === locale) return;
      if (reduce) setLocale(next);
      else setCurtain({ to: next, covered: false });
    },
    [curtain, locale, reduce],
  );

  const switchLocale = useCallback(
    (next: Locale) => {
      try {
        localStorage.setItem(LANG_KEY, next);
      } catch {
        /* sin almacenamiento: el cambio vale solo para esta visita */
      }
      go(next, true);
    },
    [go],
  );

  // Atras/adelante del navegador entre `/` y `/en`.
  useEffect(() => {
    const onPop = () => go(localeFromPath(window.location.pathname), false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [go]);

  const onCovered = useCallback(() => {
    if (!curtain || curtain.covered) return;
    setLocale(curtain.to);
    setCurtain({ ...curtain, covered: true });
  }, [curtain]);

  const value: I18n = { locale, t: dicts[locale], target: curtain?.to ?? locale, switchLocale };

  return (
    <I18nContext.Provider value={value}>
      {children}
      {curtain && (
        <LanguageCurtain to={curtain.to} covered={curtain.covered} onCovered={onCovered} onDone={() => setCurtain(null)} />
      )}
    </I18nContext.Provider>
  );
}
