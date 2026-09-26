import type { MouseEvent } from "react";
import { site } from "../data/site";
import { handleAnchorClick } from "./scroll";
import { track } from "./track";

/** Destino de "Agendar diagnostico": la agenda externa o el formulario. */
export const bookingHref = site.bookingUrl ?? "#contacto";
export const bookingIsExternal = Boolean(site.bookingUrl);

export function onBookingClick(e: MouseEvent<HTMLAnchorElement>, location: string) {
  track("agendar_click", { location });
  if (!site.bookingUrl) handleAnchorClick(e, "contacto", true);
}
