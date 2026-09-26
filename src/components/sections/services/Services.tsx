import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AuditVisual, DataVisual, IntegrationVisual, SoftwareVisual, SupportVisual, WebVisual } from "./ServiceVisuals";
import { MandarinaToggle } from "../../ui/MandarinaToggle";
import { CarpyMark } from "../../brand/CarpyMark";
import { SectionLabel } from "../../ui/SectionLabel";
import { Current } from "../../ui/Current";
import { Tilt } from "../../ui/Tilt";
import { SplitWords } from "../../ui/SplitWords";
import { services, type Service } from "../../../data/content";
import { cn } from "../../../lib/cn";
import { ease, reveal } from "../../../lib/motion";
import { scrollToId } from "../../../lib/scroll";
import { track } from "../../../lib/track";

/** Evento que preselecciona el tipo de solicitud en el formulario. */
export const REQUEST_EVENT = "carpy:request";

const visuals: Record<Service["id"], () => React.ReactNode> = {
  software: () => <SoftwareVisual />,
  web: () => <WebVisual />,
  automatizacion: () => <IntegrationVisual />,
  datos: () => <DataVisual />,
  auditoria: () => <AuditVisual />,
  soporte: () => <SupportVisual />,
};

function quote(e: MouseEvent<HTMLAnchorElement>, s: Service) {
  if (e.metaKey || e.ctrlKey || e.button !== 0) return;
  e.preventDefault();
  track("cotizar_servicio_click", { service: s.id });
  window.dispatchEvent(new CustomEvent(REQUEST_EVENT, { detail: s.request }));
  scrollToId("contacto", true);
}

interface RowProps {
  s: Service;
  open: boolean;
  onToggle: () => void;
}

function Row({ s, open, onToggle }: RowProps) {
  const panel = `servicio-${s.id}-panel`;
  return (
    <li id={`servicio-${s.id}`} className="border-t border-ink/12 last:border-b">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panel}
          className="group relative flex w-full items-center justify-between gap-5 py-4 text-left sm:py-6"
        >
          {/* Banda que barre la fila al pasar el puntero. */}
          <span
            aria-hidden
            className="absolute -inset-x-3 inset-y-1 -z-0 origin-left scale-x-0 rounded-2xl bg-paper-3/70 transition-transform duration-500 ease-[var(--ease-calm)] [@media(hover:hover)]:group-hover:scale-x-100"
          />
          <span className="relative">
            <span
              className={cn(
                "block font-display text-[clamp(1.75rem,3.4vw,2.55rem)] font-medium leading-[1.02] tracking-[-0.03em] transition-[color,transform] duration-500 ease-[var(--ease-calm)] [@media(hover:hover)]:group-hover:translate-x-2",
                open ? "text-ink" : "text-ink/55",
              )}
            >
              {s.name}
            </span>
            <span className="mt-1 block text-[0.95rem] font-medium text-ink-3 sm:mt-1.5 sm:text-[1rem]">{s.title}</span>
          </span>
          <MandarinaToggle open={open} size={48} className="relative" />
        </button>
      </h3>

      {/* La respuesta existe en el HTML aunque este cerrada. */}
      <motion.div
        id={panel}
        role="region"
        aria-labelledby={`servicio-${s.id}`}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.6, ease }}
        className="overflow-hidden"
      >
        <div className="pb-8">
          <p className="max-w-[34rem] text-[1.06rem] leading-[1.65] text-ink-2">{s.summary}</p>
          <ul className="mt-5 max-w-[34rem]">
            {s.includes.map((it, i) => (
              <motion.li
                key={it}
                initial={false}
                animate={{ opacity: open ? 1 : 0, x: open ? 0 : -10 }}
                transition={{ duration: 0.5, delay: open ? 0.15 + i * 0.06 : 0, ease }}
                className="flex gap-3 border-t border-ink/8 py-2.5 text-[0.98rem] text-ink"
              >
                <span aria-hidden className="mt-[0.6em] h-[3px] w-3 shrink-0 rounded-full bg-mandarina" />
                {it}
              </motion.li>
            ))}
          </ul>
          <p className="mt-5 max-w-[34rem] text-[0.98rem] leading-[1.6] text-ink-3">
            <span className="font-semibold text-ink">Recibes: </span>
            {s.deliverable}
          </p>

          {/* En telefono la demostracion va dentro de la fila. */}
          <div className="mt-8 lg:hidden">{open && visuals[s.id]()}</div>

          <a
            href="#contacto"
            onClick={(e) => quote(e, s)}
            className="group/cta mt-7 inline-flex min-h-11 items-center gap-2 text-[1rem] font-semibold text-ink"
          >
            <span className="relative">
              {s.cta}
              <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-mandarina transition-transform duration-500 ease-[var(--ease-calm)] group-hover/cta:scale-x-100" />
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" strokeWidth={2.4} aria-hidden />
          </a>
        </div>
      </motion.div>
    </li>
  );
}

export function Services() {
  // Se puede cerrar todo; la demostracion de escritorio muestra la ultima abierta.
  const [openId, setOpenId] = useState<Service["id"] | null>("software");
  const [lastId, setLastId] = useState<Service["id"]>("software");
  const active = services.find((s) => s.id === lastId) ?? services[0];
  // En telefono la lista arranca cerrada: se lee de un vistazo y se abre lo que interese.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) setOpenId(null);
  }, []);
  const toggle = (id: Service["id"]) => {
    setOpenId((v) => (v === id ? null : id));
    setLastId(id);
  };

  return (
    <section
      id="servicios"
      aria-labelledby="servicios-title"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-paper-2 pb-16 pt-14 shadow-sheet sm:rounded-t-[56px] sm:py-24 lg:py-32"
    >
      <Current className="-mt-8 mb-8 sm:-mt-12 sm:mb-12 lg:-mt-16 lg:mb-20" />
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel>Qué hacemos</SectionLabel>
            <h2 id="servicios-title" className="mt-5 font-display text-[clamp(2.3rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.03em] text-ink">
              <SplitWords text="Si es software, lo resolvemos." />
            </h2>
          </div>
          <motion.p {...reveal} className="max-w-[30rem] text-[1rem] leading-[1.6] text-ink-3 sm:text-[1.06rem] lg:col-span-5">
            Esto es lo que más nos piden. Si lo tuyo no aparece, escríbenos igual: casi siempre hay una forma.
          </motion.p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-14 sm:mt-14 lg:grid-cols-12 lg:gap-12">
          <motion.ul {...reveal} className="lg:col-span-6">
            {services.map((s) => (
              <Row
                key={s.id}
                s={s}
                open={openId === s.id}
                onToggle={() => toggle(s.id)}
              />
            ))}
            {/* La lista no se cierra aqui. */}
            <li className="pt-6 sm:pt-8">
              <a
                href="#contacto"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.button !== 0) return;
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent(REQUEST_EVENT, { detail: "otro" }));
                  scrollToId("contacto", true);
                }}
                className="group flex items-center gap-4 rounded-[28px] bg-paper-3/60 p-5 transition-[background-color,transform] duration-500 ease-[var(--ease-calm)] hover:-translate-y-1 hover:bg-paper-3 sm:p-6"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-paper-2 shadow-rest transition-transform duration-500 ease-[var(--ease-calm)] group-hover:rotate-[-8deg]">
                  <CarpyMark className="h-7 w-auto text-ink" cutout="var(--color-paper-2)" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.5rem] font-medium leading-tight tracking-[-0.02em] text-ink">¿Otra cosa?</span>
                  <span className="mt-0.5 block text-[0.98rem] text-ink-3">Cuéntanos qué te tiene preocupado y lo miramos con calma.</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} aria-hidden />
              </a>
            </li>
          </motion.ul>

          {/* Escritorio: la demostracion del servicio abierto, al lado. */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-28">
              <div className="relative grid">
                <div aria-hidden className="absolute -inset-6 rounded-[44px] bg-paper-3/60" />
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 30, rotate: -1.5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, rotate: 1.5, scale: 0.97 }}
                    transition={{ duration: 0.6, ease }}
                    className="relative col-start-1 row-start-1 p-2"
                  >
                    <Tilt max={4}>{visuals[active.id]()}</Tilt>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
