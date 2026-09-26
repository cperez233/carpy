import type { MouseEvent } from "react";

/**
 * Baja a una seccion sin dejar `#seccion` en la URL: asi F5 vuelve al
 * inicio en lugar de saltar a la mitad de la pagina.
 */
export function scrollToId(id: string, focus = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", window.location.pathname + window.location.search);
  if (focus) {
    const target = el.querySelector<HTMLElement>("input:not([type=radio]):not([type=checkbox]):not([tabindex=\"-1\"]), textarea") ?? el;
    window.setTimeout(() => target.focus({ preventScroll: true }), reduce ? 0 : 650);
  }
}

/** Handler para enlaces internos: mantiene el `href` real para crawlers. */
export function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>, id: string, focus = false) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  scrollToId(id, focus);
}
