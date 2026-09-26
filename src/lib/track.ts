/**
 * Evento de conversion. No depende de un proveedor: si hay Plausible, GA4
 * o Vercel Analytics cargado en la pagina, lo usa; si no, no hace nada.
 */
type Props = Record<string, string>;

interface AnalyticsWindow extends Window {
  plausible?: (event: string, opts?: { props: Props }) => void;
  gtag?: (cmd: "event", event: string, props?: Props) => void;
  va?: (cmd: "event", payload: { name: string; data?: Props }) => void;
}

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  w.plausible?.(event, { props });
  w.gtag?.("event", event, props);
  w.va?.("event", { name: event, data: props });
}
