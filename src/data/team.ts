import type { Locale } from "../i18n/types";

/**
 * Equipo de carpy. La seccion "Equipo" y el JSON-LD se alimentan de este
 * arreglo y solo muestran a quien tenga `isActive: true`.
 *
 * Para publicar a otro socio: completa sus campos (en `copy`, un bloque por
 * idioma), agrega su foto en `public/team/<id>.webp` (4:5, 800x1000) y cambia
 * `isActive` a `true`. La grilla pasa sola de la tarjeta ancha (1 persona) a
 * columnas (2 o 3).
 */

export interface TeamLink {
  label: string;
  href: string;
}

/** Lo que cambia con el idioma. */
export interface MemberCopy {
  role: string;
  /** Especialidad principal: se muestra como insignia. */
  specialty: string;
  /** Una o dos frases concretas: que hace en carpy. */
  bio: string;
  /** Areas de trabajo (insignias). [confirmar con cada socio] */
  focus: string[];
  /** Texto alternativo de la foto. */
  alt: string;
}

export interface TeamMember {
  /** Identificador estable: `key`, `@id` del JSON-LD y nombre de la foto. */
  id: string;
  name: string;
  copy: Record<Locale, MemberCopy>;
  /** Herramientas con las que trabaja a diario. [confirmar con cada socio] */
  stack: string[];
  location: string;
  photo: { src: string; width: number; height: number } | null;
  /** Enlace principal: portafolio personal. */
  portfolio: TeamLink | null;
  /** Perfiles publicos; tambien van al `sameAs` del JSON-LD. */
  links: TeamLink[];
  isActive: boolean;
}

export const teamMembers: TeamMember[] = [
  {
    id: "cristian-perez",
    name: "Cristian Pérez",
    copy: {
      es: {
        role: "Desarrollo y ciberseguridad",
        specialty: "Full-stack · Seguridad · Contenido",
        bio: "Construye aplicaciones de principio a fin, dirige las auditorías y crea contenido y branding para negocios.",
        focus: ["Desarrollo full-stack", "Auditoría y pentesting", "Contenido y branding"],
        alt: "Retrato de Cristian Pérez, socio fundador de carpy",
      },
      en: {
        role: "Development & security",
        specialty: "Full-stack · Security · Content",
        bio: "Builds applications end to end, leads the audits and creates content and branding for businesses.",
        focus: ["Full-stack development", "Auditing and pentesting", "Content and branding"],
        alt: "Portrait of Cristian Pérez, founding partner of carpy",
      },
    },
    stack: ["TypeScript", "React", "Node.js", "AWS"],
    location: "Bucaramanga, CO",
    photo: { src: "/team/cristian-perez.webp", width: 800, height: 1000 },
    portfolio: { label: "cristianperez.me", href: "https://cristianperez.me" },
    links: [
      { label: "GitHub", href: "https://github.com/cperez233" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/cristianperez879m" },
    ],
    isActive: true,
  },
  {
    id: "jorge-vergel",
    name: "Jorge Vergel",
    copy: {
      es: {
        role: "Desarrollo full-stack y móvil",
        specialty: "Backend · Móvil · Servidores",
        bio: "Lleva cada proyecto del diseño a producción, con experiencia en sistemas para empresas de distribución.",
        focus: ["Sistemas de gestión empresarial", "Apps con React Native", "Despliegue en servidores"],
        alt: "Retrato de Jorge Vergel, socio fundador de carpy",
      },
      en: {
        role: "Full-stack & mobile",
        specialty: "Backend · Mobile · Servers",
        bio: "Takes each project from design to production, with experience building systems for distribution companies.",
        focus: ["Business management systems", "Apps with React Native", "Server deployment"],
        alt: "Portrait of Jorge Vergel, founding partner of carpy",
      },
    },
    stack: ["Laravel", "Vue", "React Native", "Docker"],
    location: "Bucaramanga, CO",
    photo: { src: "/team/jorge-vergel.webp", width: 800, height: 1000 },
    portfolio: null,
    links: [
      { label: "GitHub", href: "https://github.com/jorgev898" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jorge-isaac-vergel-garc%C3%ADa-590247346/" },
    ],
    isActive: true,
  },
  {
    id: "javier-guerra",
    name: "Javier Guerra",
    copy: {
      es: {
        role: "Datos y automatización",
        specialty: "Datos · Automatización · IA",
        bio: "Convierte procesos manuales en automatizaciones y los datos en tableros claros para decidir mejor.",
        focus: ["Ingeniería y análisis de datos", "Automatización con n8n", "Tableros en Power BI"],
        alt: "Retrato de Javier Guerra, socio fundador de carpy",
      },
      en: {
        role: "Data and automation",
        specialty: "Data · Automation · AI",
        bio: "Turns manual processes into automations and data into clear dashboards for better decisions.",
        focus: ["Data engineering and analysis", "Automation with n8n", "Power BI dashboards"],
        alt: "Portrait of Javier Guerra, founding partner of carpy",
      },
    },
    stack: ["Python", "SQL", "Next.js", "PostgreSQL"],
    location: "Bucaramanga, CO",
    photo: { src: "/team/javier-guerra.webp", width: 800, height: 1000 },
    portfolio: { label: "javierguerra.vercel.app", href: "https://javierguerra.vercel.app" },
    links: [
      { label: "GitHub", href: "https://github.com/jwar28" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jguerra2203" },
    ],
    isActive: true,
  },
];

export const activeTeam = teamMembers.filter((m) => m.isActive);
