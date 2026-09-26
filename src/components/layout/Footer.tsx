import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CarpyMark, Logo } from "../brand/CarpyMark";
import { navItems, services } from "../../data/content";
import { mailtoHref, site, whatsappHref } from "../../data/site";
import { handleAnchorClick } from "../../lib/scroll";

const linkCls = "inline-flex min-h-10 items-center text-[1rem] text-paper/65 transition-colors hover:text-paper";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // La palabra sube desde el borde al llegar al final.
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "8%"]);
  const wa = whatsappHref("Hola, quiero hablar con carpy sobre un proyecto.");

  return (
    <footer ref={ref} className="relative -mt-14 overflow-hidden bg-river pt-14 text-paper">
      <div className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <span className="text-paper">
              <Logo cutout="var(--color-river)" />
            </span>
            <p className="mt-5 max-w-[24rem] text-[1rem] leading-relaxed text-paper/65">
              {site.tagline}, para empresas y entidades de {site.country}.
            </p>
            <div className="mt-4 flex flex-col">
              <a href={mailtoHref} className="inline-flex min-h-10 items-center text-[1rem] font-semibold text-paper hover:text-mandarina">
                {site.email}
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center text-[1rem] font-semibold text-paper hover:text-mandarina">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
          <nav aria-label="Secciones" className="md:col-span-3">
            <h2 className="text-[0.95rem] font-semibold text-paper">Secciones</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 md:block">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={(e) => handleAnchorClick(e, n.id)} className={linkCls}>
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contacto" onClick={(e) => handleAnchorClick(e, "contacto", true)} className={linkCls}>
                  Formulario de contacto
                </a>
              </li>
            </ul>
          </nav>
          <div className="hidden md:col-span-4 md:block">
            <h2 className="text-[0.95rem] font-semibold text-paper">Servicios</h2>
            <ul className="mt-3">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`#servicio-${s.id}`} onClick={(e) => handleAnchorClick(e, `servicio-${s.id}`)} className={linkCls}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap sm:mt-14 items-center justify-between gap-3 border-t border-paper/10 py-6 text-[0.9rem] text-paper/50">
          <p>
            © 2026 {site.name}.
          </p>
          <p>Hecho con calma.</p>
        </div>
      </div>

      <div aria-hidden className="relative h-[clamp(7rem,23vw,19rem)] select-none">
        <motion.div style={reduce ? undefined : { y }} className="absolute inset-x-0 bottom-0 flex justify-center">
          <span className="relative font-display text-[27vw] font-medium leading-[0.78] tracking-[-0.05em] text-paper/[0.08]">
            carpy
            {/* El capibara descansa sobre las letras. */}
            <span className="absolute bottom-[56%] left-[7%] w-[11vw]">
              <CarpyMark className="carpy-alive h-auto w-full text-paper/80" cutout="var(--color-river)" />
            </span>
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
