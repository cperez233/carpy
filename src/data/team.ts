/**
 * Equipo de carpy. La seccion "Equipo" y el JSON-LD se alimentan de este
 * arreglo y solo muestran a quien tenga `isActive: true`.
 *
 * Para publicar a otro socio: completa sus campos, agrega su foto en
 * `public/team/<id>.webp` (4:5, 800x1000) y cambia `isActive` a `true`.
 * La grilla pasa sola de la tarjeta ancha (1 persona) a columnas (2 o 3).
 */

export interface TeamLink {
  label: string;
  href: string;
}

export interface TeamMember {
  /** Identificador estable: `key`, `@id` del JSON-LD y nombre de la foto. */
  id: string;
  name: string;
  role: string;
  /** Especialidad principal: se muestra como insignia. */
  specialty: string;
  /** Una o dos frases concretas: que hace en carpy. */
  bio: string;
  /** Areas de trabajo (insignias). [confirmar con cada socio] */
  focus: string[];
  /** Herramientas con las que trabaja a diario. [confirmar con cada socio] */
  stack: string[];
  location: string;
  photo: { src: string; alt: string; width: number; height: number } | null;
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
    role: "Desarrollador full-stack, ciberseguridad y creador de contenido",
    specialty: "Desarrollo · Seguridad · Contenido",
    bio: "Socio fundador. Construye aplicaciones de principio a fin, dirige las auditorías y comparte en redes lo que aprende sobre software y seguridad.",
    focus: ["Desarrollo full-stack", "Arquitectura cloud", "Ciberseguridad y pentesting", "Creación de contenido sobre tecnología"],
    stack: ["TypeScript", "React", "Node.js", "Python", "Docker", "AWS"],
    location: "Bucaramanga, CO",
    photo: {
      src: "/team/cristian-perez.webp",
      alt: "Retrato de Cristian Pérez, socio fundador de carpy",
      width: 800,
      height: 1000,
    },
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
    role: "Desarrollador full-stack",
    specialty: "Desarrollo · Backend · Full-stack",
    bio: "Socio fundador. Lleva cada proyecto desde el diseño inicial hasta su puesta en producción, con experiencia real en sistemas para empresas del sector distribución.",
    focus: [
      "Desarrollo backend y frontend",
      "Sistemas de gestión empresarial (cartera, compras, roles y permisos)",
      "Desarrollo móvil con React Native",
      "Despliegue e infraestructura en servidores",
    ],
    stack: ["React Native", "Laravel", "Vue", "Python", "Docker"],
    location: "Bucaramanga, CO",
    photo: {
      src: "/team/jorge-vergel.webp",
      alt: "Retrato de Jorge Vergel, socio fundador de carpy",
      width: 800,
      height: 1000,
    },
    portfolio: null,
    links: [],
    isActive: true,
  },
  {
    id: "javier-guerra",
    name: "Javier Guerra",
    role: "Ingeniero de datos y automatización",
    specialty: "Datos · Automatización · IA",
    bio: "Socio fundador. Convierte procesos manuales en automatizaciones y datos en decisiones. Hace poco llevó una tarea contable de un día entero de trabajo a 20 segundos.",
    focus: [
      "Ingeniería y análisis de datos",
      "Automatización de procesos con n8n y Power Automate",
      "Integraciones con IA",
      "Tableros en Power BI",
    ],
    stack: ["Python", "SQL", "TypeScript", "Next.js", "PostgreSQL", "n8n"],
    location: "Bucaramanga, CO",
    photo: {
      src: "/team/javier-guerra.webp",
      alt: "Retrato de Javier Guerra, socio fundador de carpy",
      width: 800,
      height: 1000,
    },
    portfolio: { label: "javierguerra.vercel.app", href: "https://javierguerra.vercel.app" },
    links: [
      { label: "GitHub", href: "https://github.com/jwar28" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jguerra2203" },
    ],
    isActive: true,
  },
];

export const activeTeam = teamMembers.filter((m) => m.isActive);
