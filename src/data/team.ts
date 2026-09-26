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
    id: "jorge",
    name: "Jorge [COMPLETAR: apellido]",
    role: "[COMPLETAR: rol]",
    specialty: "[COMPLETAR]",
    bio: "[COMPLETAR: una o dos frases sobre lo que hace en carpy]",
    focus: [],
    stack: [],
    location: "[COMPLETAR]",
    photo: null,
    portfolio: null,
    links: [],
    isActive: false,
  },
  {
    id: "javier-g",
    name: "Javier G. [COMPLETAR: apellido]",
    role: "[COMPLETAR: rol]",
    specialty: "[COMPLETAR]",
    bio: "[COMPLETAR: una o dos frases sobre lo que hace en carpy]",
    focus: [],
    stack: [],
    location: "[COMPLETAR]",
    photo: null,
    portfolio: null,
    links: [],
    isActive: false,
  },
];

export const activeTeam = teamMembers.filter((m) => m.isActive);
