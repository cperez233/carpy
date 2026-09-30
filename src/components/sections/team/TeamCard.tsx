import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { TeamMember } from "../../../data/team";
import { cn } from "../../../lib/cn";
import { ease } from "../../../lib/motion";
import { track } from "../../../lib/track";
import { Tilt } from "../../ui/Tilt";
import { useI18n } from "../../../i18n/context";

interface TeamCardProps {
  member: TeamMember;
  /** `wide`: foto al lado (una sola persona). `column`: foto arriba. */
  layout?: "wide" | "column";
  variants?: Variants;
  /** Muestra el sello giratorio (solo en una tarjeta, para no repetirlo). */
  seal?: boolean;
  /** Color de la hoja que asoma detras de la foto. */
  tone?: string;
  className?: string;
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter((p) => /^[A-ZÁÉÍÓÚÑ]/.test(p))
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return <div className="flex h-full w-full items-center justify-center bg-paper-3 font-display text-5xl text-ink-3">{initials}</div>;
}

/**
 * Tres capas por tarjeta, iguales en todas: una hoja de color asomando detras,
 * la foto encima y la ficha de texto montada sobre el borde inferior. Todas
 * las fichas tienen la misma estructura y los mismos altos de texto.
 */
export function TeamCard({ member, layout = "column", variants, seal = false, tone = "var(--color-water)", className }: TeamCardProps) {
  const { locale, t } = useI18n();
  const copy = member.copy[locale];
  const wide = layout === "wide";
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const spin = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  // Se observa el contenedor: un elemento recortado al 100% no cuenta como visible.
  const wrap = useRef<HTMLDivElement>(null);
  const seen = useInView(wrap, { once: true, margin: "0px 0px -5% 0px" });

  const links = [
    ...(member.portfolio ? [{ label: t.team.portfolio, href: member.portfolio.href, kind: "portafolio" }] : []),
    ...member.links.map((l) => ({ ...l, kind: l.label.toLowerCase() })),
  ];

  return (
    <motion.article
      variants={variants}
      aria-labelledby={`${member.id}-name`}
      className={cn("group/card", wide ? "grid grid-cols-1 items-center md:grid-cols-12 md:gap-12" : "flex flex-col", className)}
    >
      <div ref={wrap} className={cn("relative", wide && "md:col-span-5")}>
        <Tilt max={3} className="relative">
          {/* Capa 1: la hoja de color, desplazada igual en todas las tarjetas. */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={seen ? { opacity: 1, x: 12, y: 12 } : undefined}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            style={{ background: tone }}
            className="absolute inset-0 rounded-[30px] transition-transform duration-700 ease-[var(--ease-calm)] [@media(hover:hover)]:group-hover/card:translate-x-1.5 [@media(hover:hover)]:group-hover/card:translate-y-1.5"
          />
          {/* Capa 2: la foto. */}
          <motion.div
            ref={ref}
            initial={{ clipPath: "inset(35% 0% 0% 0% round 30px)", opacity: 0, y: 50 }}
            animate={seen ? { clipPath: "inset(0% 0% 0% 0% round 30px)", opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.1, delay: 0.1, ease }}
            className="relative overflow-hidden rounded-[30px] bg-paper-3 shadow-raised aspect-[5/6] sm:aspect-[4/5]"
          >
            {member.photo ? (
              <motion.img
                src={member.photo.src}
                alt={copy.alt}
                width={member.photo.width}
                height={member.photo.height}
                loading="lazy"
                decoding="async"
                style={reduce ? undefined : { y: imgY, scale: 1.12 }}
                className="absolute inset-0 h-full w-full object-cover object-[50%_22%] transition-[filter] duration-700 group-hover/card:saturate-[1.08]"
              />
            ) : (
              <Initials name={member.name} />
            )}
          </motion.div>
          {seal && (
            <motion.div
              aria-hidden
              initial={{ scale: 0, rotate: -90 }}
              animate={seen ? { scale: 1, rotate: 0 } : undefined}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.9 }}
              className="absolute -right-3 -top-5 h-24 w-24 sm:-right-5 sm:h-28 sm:w-28"
            >
              <div className="relative h-full w-full rounded-full bg-paper-2 shadow-raised">
                <motion.svg style={reduce ? undefined : { rotate: spin }} viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
                  <defs>
                    <path id={`sello-${member.id}`} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
                  </defs>
                  <text className="fill-ink font-sans text-[11.5px] font-semibold tracking-[0.16em]">
                    {/* textLength reparte la frase en toda la vuelta, sea cual sea el idioma. */}
                    <textPath href={`#sello-${member.id}`} textLength={274} lengthAdjust="spacing">
                      {t.team.seal}
                    </textPath>
                  </text>
                </motion.svg>
                <svg viewBox="0 0 20 20" className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2">
                  <circle cx="10" cy="11" r="7" fill="var(--color-mandarina)" />
                  <path d="M10 4 C12 0 17 0 18 2 C15 4 12 5 10 4Z" fill="var(--color-reed)" />
                </svg>
              </div>
            </motion.div>
          )}
        </Tilt>
      </div>

      {/* Capa 3: la ficha, montada sobre el borde de la foto. */}
      <div
        className={cn(
          "relative z-10 mx-3 -mt-14 flex flex-1 flex-col rounded-[26px] bg-paper-2 p-5 shadow-float transition-transform duration-500 ease-[var(--ease-calm)] sm:mx-4 sm:p-6 [@media(hover:hover)]:group-hover/card:-translate-y-1",
          wide && "md:col-span-7 md:mx-0 md:mt-0",
        )}
      >
        <p className="text-[0.85rem] font-semibold text-mandarina-ink">{copy.specialty}</p>
        <h3 id={`${member.id}-name`} className="mt-1.5 font-display text-[1.9rem] font-medium leading-[1.05] tracking-[-0.03em] text-ink lg:text-[2.05rem]">
          {member.name}
        </h3>
        <p className="mt-1 truncate text-[0.98rem] font-medium text-ink-3">{copy.role}</p>
        {/* Mismo alto para la bio en las tres fichas. */}
        <p className="mt-4 min-h-[4.8em] text-[0.98rem] leading-[1.6] text-ink-2">{copy.bio}</p>

        {copy.focus.length > 0 && (
          <ul className="mt-4 hidden sm:block">
            {copy.focus.slice(0, 3).map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease }}
                className="flex items-center gap-2.5 border-t border-ink/10 py-2 text-[0.93rem] text-ink"
              >
                <span aria-hidden className="h-[3px] w-3 shrink-0 rounded-full bg-mandarina" />
                <span className="truncate">{f}</span>
              </motion.li>
            ))}
          </ul>
        )}
        {member.stack.length > 0 && (
          <ul className="mt-4 hidden flex-wrap gap-1.5 sm:flex" aria-label={t.team.stack}>
            {member.stack.slice(0, 4).map((t) => (
              <li key={t} className="rounded-full bg-paper-3 px-2.5 py-1 text-[0.8rem] font-medium text-ink-2">
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* Enlaces: portafolio con texto; GitHub y LinkedIn como botones redondos. Caben en cualquier ancho. */}
        <ul className="mt-auto flex items-center gap-1.5 pt-5 sm:gap-2">
          {links.map((l) => {
            const icon = l.kind === "github" || l.kind === "linkedin";
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.a11y.profileLink(l.label, member.name)}
                  onClick={() => track(`${l.kind}_click`, { member: member.id })}
                  className={cn(
                    "group/l inline-flex h-11 items-center justify-center rounded-full text-ink ring-1 ring-ink/15 transition-[background-color,color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper-2 hover:ring-ink active:scale-[0.95]",
                    icon ? "w-11" : "gap-1.5 whitespace-nowrap px-3.5 text-[0.9rem] font-semibold",
                  )}
                >
                  {l.kind === "github" ? (
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
                      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5Z" />
                    </svg>
                  ) : l.kind === "linkedin" ? (
                    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor" aria-hidden>
                      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
                    </svg>
                  ) : (
                    <>
                      {l.label}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" aria-hidden />
                    </>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.article>
  );
}
