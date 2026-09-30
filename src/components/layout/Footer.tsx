import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CarpyMark, Logo } from "../brand/CarpyMark";
import { site, whatsappHref } from "../../data/site";
import { EmailLink } from "../ui/EmailLink";
import { handleAnchorClick } from "../../lib/scroll";
import { autor, firmaInvisible } from "../../lib/firma";
import { useI18n } from "../../i18n/context";
import { dicts, localePath, locales } from "../../i18n/locales";

const linkCls = "inline-flex min-h-10 items-center text-[1rem] text-paper/65 transition-colors hover:text-paper";

export function Footer() {
  const { locale, t, switchLocale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // La palabra sube desde el borde al llegar al final.
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "8%"]);
  const wa = whatsappHref(t.whatsapp.project);

  return (
    <footer ref={ref} className="relative -mt-14 overflow-hidden bg-river pt-14 text-paper">
      <div className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <span className="text-paper">
              <Logo cutout="var(--color-river)" />
            </span>
            <p className="mt-5 max-w-[24rem] text-[1rem] leading-relaxed text-paper/65">
              {t.footer.blurb}
            </p>
            <div className="mt-4 flex flex-col">
              <EmailLink location="footer" className="inline-flex min-h-10 items-center text-[1rem] font-semibold text-paper hover:text-mandarina" />
              {wa && (
                <a href={wa} target="_blank" rel="noopener" className="inline-flex min-h-10 items-center text-[1rem] font-semibold text-paper hover:text-mandarina">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
          <nav aria-label={t.nav.sections} className="md:col-span-3">
            <h2 className="text-[0.95rem] font-semibold text-paper">{t.nav.sections}</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 md:block">
              {t.nav.items.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={(e) => handleAnchorClick(e, n.id)} className={linkCls}>
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contacto" onClick={(e) => handleAnchorClick(e, "contacto", true)} className={linkCls}>
                  {t.nav.contactForm}
                </a>
              </li>
            </ul>
          </nav>
          <div className="hidden md:col-span-4 md:block">
            <h2 className="text-[0.95rem] font-semibold text-paper">{t.nav.services}</h2>
            <ul className="mt-3">
              {t.services.items.map((s) => (
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
          <p className="flex flex-wrap items-center gap-x-4">
            <span>© 2026 {site.name}.</span>
            {/* El otro idioma, como enlace real para buscadores. */}
            {locales
              .filter((l) => l !== locale)
              .map((l) => (
                <a
                  key={l}
                  href={localePath(l)}
                  hrefLang={l}
                  lang={l}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    switchLocale(l);
                  }}
                  className="inline-flex min-h-10 items-center gap-2 text-paper/60 transition-colors hover:text-paper"
                >
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-mandarina" />
                  {dicts[l].langName}
                </a>
              ))}
          </p>
          <p>
            {t.footer.madeBy}{" "}
            <a
              href={autor.url}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-10 items-center text-paper/60 underline decoration-paper/20 underline-offset-4 transition-colors hover:text-paper hover:decoration-mandarina"
            >
              {autor.nombre}
            </a>
            {firmaInvisible}
          </p>
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
