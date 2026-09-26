/**
 * Textos de la landing. Cada dato se explica completo en una sola seccion;
 * las demas lo resumen o enlazan.
 */

export interface NavItem {
  id: string;
  label: string;
}

export const navItems: NavItem[] = [
  { id: "servicios", label: "Servicios" },
  { id: "proceso", label: "Cómo trabajamos" },
  { id: "equipo", label: "Equipo" },
  { id: "preguntas", label: "Preguntas" },
];

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

export const services: Service[] = [
  {
    id: "software",
    name: "Software a medida",
    title: "Aplicaciones web y sistemas internos",
    summary:
      "El sistema que hoy vive en hojas de cálculo y mensajes de WhatsApp: inventario, reservas, pedidos, portales para clientes.",
    includes: [
      "Aplicaciones web y paneles administrativos",
      "APIs documentadas para conectar con otros sistemas",
      "Despliegue en la nube con copias de seguridad y monitoreo",
    ],
    deliverable: "El código en un repositorio a tu nombre desde el primer día, con un manual para operarlo.",
    cta: "Cotizar un desarrollo",
    request: "software",
    serviceType: "Desarrollo de software a medida y arquitectura cloud",
  },
  {
    id: "web",
    name: "Páginas y tiendas",
    title: "Tu negocio en internet, bien hecho",
    summary:
      "Una página rápida que explique qué vendes, aparezca en Google y te traiga clientes por WhatsApp. Si vendes en línea, la tienda con pagos y envíos.",
    includes: [
      "Páginas para negocios, con dominio y correo propios",
      "Tiendas en línea con pagos colombianos (PSE, tarjetas, Nequi)",
      "Posicionamiento en Google y en Google Maps",
    ],
    deliverable: "La página publicada, a tu nombre, y la forma de cambiar textos y fotos sin depender de nadie.",
    cta: "Cotizar una página",
    request: "web",
    serviceType: "Diseño y desarrollo de páginas web y tiendas en línea",
  },
  {
    id: "automatizacion",
    name: "Integraciones",
    title: "Facturación electrónica, WhatsApp y Excel conectados",
    summary:
      "Conectamos lo que ya usas para que los datos no se copien a mano: facturación electrónica, WhatsApp, correo, ERP y hojas de cálculo.",
    includes: [
      "Facturación electrónica y reportes conectados a tu sistema",
      "Mensajes automáticos por WhatsApp o correo",
      "Lectura y clasificación de documentos con IA",
    ],
    deliverable: "El flujo funcionando, con un registro de cada evento y reintentos si algo falla.",
    cta: "Cotizar una integración",
    request: "integracion",
    serviceType: "Automatización de procesos e integración de inteligencia artificial",
  },
  {
    id: "datos",
    name: "Datos y reportes",
    title: "Tus números, claros y al día",
    summary:
      "Juntamos lo que está regado entre la caja, el Excel y la contabilidad en un tablero que se actualiza solo, para decidir con datos y no a ojo.",
    includes: [
      "Tableros de ventas, inventario y cartera",
      "Reportes automáticos que llegan a tu correo cada semana",
      "Limpieza y unificación de datos que hoy están duplicados",
    ],
    deliverable: "El tablero funcionando con tus datos reales y una explicación de cómo leer cada número.",
    cta: "Cotizar un tablero",
    request: "integracion",
    serviceType: "Análisis de datos, tableros e informes automáticos",
  },
  {
    id: "auditoria",
    name: "Auditoría",
    title: "Software, procesos de negocio y seguridad",
    summary:
      "Revisamos el software que ya tienes y cómo lo usa tu negocio: qué funciona, qué cuesta de más, qué pone en riesgo la operación y qué conviene cambiar primero.",
    includes: [
      "Procesos: dónde se pierde tiempo, dinero o información entre áreas",
      "Código y arquitectura: calidad, deuda técnica y qué tan fácil es de mantener",
      "Costos y rendimiento: nube, licencias y sistemas que se quedan cortos",
      "Seguridad: vulnerabilidades, accesos y pentesting con autorización escrita",
    ],
    deliverable:
      "Un informe con cada hallazgo, su impacto en el negocio y cómo resolverlo, en orden de prioridad, más un resumen de una página para gerencia.",
    cta: "Pedir una auditoría",
    request: "auditoria",
    serviceType: "Auditoría de software, procesos de negocio y seguridad",
  },
  {
    id: "soporte",
    name: "Soporte y acompañamiento",
    title: "Alguien técnico de tu lado",
    summary:
      "Mantenemos lo que ya tienes funcionando y te ayudamos a decidir: qué sistema comprar, si una cotización de otro proveedor tiene sentido, por dónde empezar.",
    includes: [
      "Mantenimiento, actualizaciones y copias de seguridad",
      "Monitoreo: nos enteramos antes que tus clientes si algo se cae",
      "Asesoría técnica por horas o por mes",
    ],
    deliverable: "Un plan mensual claro con lo que cubre, y un canal directo para escribirnos cuando algo pase.",
    cta: "Hablar de soporte",
    request: "soporte",
    serviceType: "Soporte técnico, mantenimiento y consultoría de software",
  },
];

export interface ProcessStep {
  title: string;
  body: string;
}

export const processSteps: ProcessStep[] = [
  { title: "Conversación", body: "30 minutos para entender qué necesitas y qué ya tienes funcionando." },
  { title: "Propuesta", body: "Alcance, tiempos y precio cerrado, por escrito." },
  { title: "Entregas cortas", body: "Avances cada semana que puedes probar tú mismo." },
  { title: "Traspaso", body: "Código, accesos y documentación a tu nombre." },
];

/** Lo que va por escrito en cada propuesta. */
export const promises = [
  "Respondemos cada solicitud en menos de 24 horas hábiles.",
  "Firmamos confidencialidad antes de ver tu código o tus datos.",
  "El precio es cerrado: no cobramos horas abiertas.",
  "El código, los accesos y los informes quedan a tu nombre.",
];

export interface RequestType {
  id: "software" | "web" | "integracion" | "auditoria" | "soporte" | "otro";
  label: string;
  /** Frase que abre el mensaje. */
  opener: string;
}

export const requestTypes: RequestType[] = [
  { id: "software", label: "Un sistema o app", opener: "Quiero cotizar un desarrollo." },
  { id: "web", label: "Una página o tienda", opener: "Quiero una página web o una tienda en línea." },
  { id: "integracion", label: "Integración o datos", opener: "Quiero conectar un proceso o tener mis datos más claros." },
  { id: "auditoria", label: "Una auditoría", opener: "Quiero una auditoría de mi software o mis procesos." },
  { id: "soporte", label: "Soporte", opener: "Necesito soporte o asesoría técnica." },
  { id: "otro", label: "Otra cosa", opener: "Tengo una consulta." },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "¿Cuánto cuesta?",
    a: "Depende del alcance: no cuesta lo mismo un panel de inventario que una plataforma con varios servicios en la nube. Después de la primera conversación enviamos una propuesta con precio cerrado.",
  },
  {
    q: "Somos una empresa pequeña. ¿Trabajan con nosotros?",
    a: "Sí, y es con quienes empezamos. Muchos proyectos arrancan pequeños: una sola pantalla, una integración, una revisión de lo que ya existe.",
  },
  {
    q: "¿Hacen pentesting sobre producción?",
    a: "Solo con autorización escrita, alcance firmado y ventanas acordadas. Por defecto trabajamos sobre el código fuente y un entorno de pruebas.",
  },
  {
    q: "¿Trabajan con entidades públicas?",
    a: "Sí. Preparamos la documentación técnica que pida el proceso de contratación.",
  },
  {
    q: "¿Dónde están?",
    a: "En Bucaramanga. Nos reunimos en persona en el área metropolitana y trabajamos de forma remota con el resto del país.",
  },
];
