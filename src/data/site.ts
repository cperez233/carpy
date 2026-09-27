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
   * Access key de Web3Forms (web3forms.com). Con ella el formulario envia
   * el mensaje directo a `email` sin abrir ninguna app. Es publica por
   * diseno: puede ir en el codigo. Si es `null`, el formulario ofrece
   * Gmail, Outlook o la app de correo con el mensaje ya escrito.
   */
  web3formsKey: string | null;
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
  web3formsKey: "94c09bfb-ccd1-4062-a520-e03cbae28e83",
  sameAs: [],
  lastModified: "2026-09-26",
};

export function whatsappHref(message: string): string | null {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export const mailtoHref = `mailto:${site.email}`;

/**
 * `mailto:` abre la app predeterminada del sistema (en Windows suele ser
 * Outlook aunque nadie lo use). Por eso damos tambien Gmail y Outlook web.
 */
export function composeLinks(subject: string, body: string) {
  const to = encodeURIComponent(site.email);
  const su = encodeURIComponent(subject);
  const b = encodeURIComponent(body);
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${b}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}&body=${b}`,
    app: `mailto:${site.email}?subject=${su}&body=${b}`,
  };
}
