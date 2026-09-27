/**
 * Datos de la empresa: una sola copia. El JSON-LD, el sitemap, robots.txt,
 * llms.txt y los enlaces de contacto salen de aqui.
 *
 * Los valores marcados con [COMPLETAR] son temporales y deben cambiarse
 * antes de publicar.
 */

export interface SiteConfig {
  name: string;
  /** Dominio de produccion, sin barra final. */
  url: string;
  tagline: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  locale: string;
  /**
   * Correo que recibe las solicitudes.
   */
  email: string;
  /**
   * WhatsApp en formato E.164. [COMPLETAR: linea de carpy]
   * Temporalmente es el numero de Cristian. Deja `null` para ocultar el enlace.
   */
  whatsapp: string | null;
  /**
   * Enlace de agenda (Cal.com, Calendly, Google Calendar). Si es `null`, los
   * botones de "Agendar diagnostico" llevan al formulario de contacto.
   */
  bookingUrl: string | null;
  /**
   * Endpoint que recibe el formulario por POST JSON (Formspree, Web3Forms,
   * una funcion propia). Si es `null`, el formulario abre el correo del
   * visitante con el mensaje ya escrito.
   */
  formEndpoint: string | null;
  /** Perfiles de la empresa (LinkedIn, GitHub...). Vacio hasta que existan. */
  sameAs: string[];
  /** Fecha de la ultima revision del contenido (sitemap y JSON-LD). */
  lastModified: string;
}

export const site: SiteConfig = {
  name: "carpy",
  url: "https://carpy.tech",
  tagline: "Software, páginas, integraciones, datos, auditoría y soporte",
  city: "Bucaramanga",
  region: "Santander",
  country: "Colombia",
  countryCode: "CO",
  locale: "es-CO",
  email: "carpyenterprise@gmail.com",
  whatsapp: "+573334337931",
  bookingUrl: null,
  formEndpoint: null,
  sameAs: [],
  lastModified: "2026-09-26",
};

export function whatsappHref(message: string): string | null {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export const mailtoHref = `mailto:${site.email}`;
