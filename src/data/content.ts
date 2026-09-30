/**
 * Formas de los textos de la landing. Los textos viven en `src/i18n/es.ts`
 * y `src/i18n/en.ts`; aqui solo quedan los tipos que comparten.
 */

export interface NavItem {
  id: string;
  label: string;
}

export interface Service {
  id: "software" | "web" | "automatizacion" | "datos" | "auditoria" | "soporte";
  /** Nombre corto para la lista. */
  name: string;
  title: string;
  summary: string;
  includes: string[];
  deliverable: string;
  cta: string;
  /** Tipo de solicitud que preselecciona en el formulario. */
  request: RequestType["id"];
  /** Para el JSON-LD. */
  serviceType: string;
}

export interface ProcessStep {
  title: string;
  body: string;
}

export interface RequestType {
  id: "software" | "web" | "integracion" | "auditoria" | "soporte" | "otro";
  label: string;
  /** Frase que abre el mensaje. */
  opener: string;
}

export interface Faq {
  q: string;
  a: string;
}
