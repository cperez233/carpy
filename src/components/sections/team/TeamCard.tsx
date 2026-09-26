import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { TeamMember } from "../../../data/team";
import { cn } from "../../../lib/cn";
import { ease } from "../../../lib/motion";
import { track } from "../../../lib/track";
import { Tilt } from "../../ui/Tilt";

interface TeamCardProps {
  member: TeamMember;
  /** `wide`: foto al lado (una sola persona). `column`: foto arriba. */
  layout?: "wide" | "column";
  variants?: Variants;
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

/** Retrato que se abre de abajo hacia arriba; el texto se superpone al borde en telefono. */
export function TeamCard({ member, layout = "column", variants }: TeamCardProps) {
  const wide = layout === "wide";
  const first = member.name.split(" ")[0];
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const spin = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  // Se observa el contenedor: un elemento recortado al 100% no cuenta como visible.
  const wrap = useRef<HTMLDivElement>(null);
  const seen = useInView(wrap, { once: true, margin: "0px 0px -5% 0px" });

  return (
    <motion.article
      variants={variants}
      aria-labelledby={`${member.id}-name`}
      className={cn(wide ? "grid grid-cols-1 items-center gap-0 md:grid-cols-12 md:gap-12" : "flex flex-col")}
    >
      <div ref={wrap} className={cn(wide && "md:col-span-5")}>
      <Tilt max={3} className="relative">
      {/* Hoja de agua detras de la foto: aparece primero y la foto sube sobre ella. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, rotate: 0, y: 30 }}
        animate={seen ? { opacity: 1, rotate: -4, y: 0 } : undefined}
        transition={{ duration: 1, ease }}
        className="absolute inset-0 hidden rounded-[32px] bg-water/70 sm:block"
      />
      <motion.div
        ref={ref}
        initial={{ clipPath: "inset(35% 0% 0% 0% round 32px)", opacity: 0, y: 60 }}
        animate={seen ? { clipPath: "inset(0% 0% 0% 0% round 32px)", opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.1, delay: 0.15, ease }}
        className="group/photo relative aspect-[5/5] overflow-hidden rounded-[32px] bg-paper-3 shadow-float sm:aspect-[4/5]"
      >
        {member.photo ? (
          <motion.img
            src={member.photo.src}
            alt={member.photo.alt}
            width={member.photo.width}
            height={member.photo.height}
            loading="lazy"
            decoding="async"
            style={reduce ? undefined : { y: imgY, scale: 1.14 }}
            className="absolute inset-0 h-full w-full object-cover object-[50%_20%] transition-[filter] duration-700 group-hover/photo:saturate-[1.08]"
          />
        ) : (
          <Initials name={member.name} />
        )}
      </motion.div>
      {/* Sello que gira con el scroll, montado sobre la esquina de la foto. */}
      <motion.div
        aria-hidden
        initial={{ scale: 0, rotate: -90 }}
        animate={seen ? { scale: 1, rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.9 }}
        className="absolute -right-4 -top-5 h-28 w-28 sm:-right-6 sm:h-32 sm:w-32"
      >
        <div className="relative h-full w-full rounded-full bg-paper-2 shadow-raised">
          <motion.svg style={reduce ? undefined : { rotate: spin }} viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
            <defs>
              <path id={`sello-${member.id}`} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
            </defs>
            <text className="fill-ink font-sans text-[11.5px] font-semibold tracking-[0.16em]">
              <textPath href={`#sello-${member.id}`}>SOFTWARE SIN SUSTOS · CARPY · </textPath>
            </text>
          </motion.svg>
          <svg viewBox="0 0 20 20" className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2">
            <circle cx="10" cy="11" r="7" fill="var(--color-mandarina)" />
            <path d="M10 4 C12 0 17 0 18 2 C15 4 12 5 10 4Z" fill="var(--color-reed)" />
          </svg>
        </div>
      </motion.div>
      </Tilt>
      </div>

      <div
        className={cn(
          "relative z-10 mx-3 -mt-14 rounded-[28px] bg-paper-2 p-6 shadow-float sm:mx-6 sm:p-8",
          wide && "md:col-span-7 md:mx-0 md:mt-0 md:bg-transparent md:p-0 md:shadow-none",
        )}
      >
        <p className="text-[1rem] font-semibold text-mandarina-ink">{member.specialty}</p>
        <h3 id={`${member.id}-name`} className="mt-2 font-display text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">
          {member.name}
        </h3>
        <p className="mt-2 text-[1.02rem] font-medium text-ink-3">
          {member.role}
        </p>
        <p className="mt-4 max-w-[34rem] text-[1.02rem] leading-[1.6] text-ink-2 sm:mt-6 sm:text-[1.08rem] sm:leading-[1.65]">{member.bio}</p>

        {member.focus.length > 0 && (
          <ul className="mt-7 hidden max-w-[34rem] sm:block">
            {member.focus.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease }}
                className="flex items-baseline justify-between gap-4 border-t border-ink/10 py-2.5 text-[1rem] text-ink"
              >
                {f}
              </motion.li>
            ))}
          </ul>
        )}
        {member.stack.length > 0 && <p className="mt-4 text-[0.95rem] text-ink-3">Trabaja con {member.stack.join(", ")}.</p>}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 sm:mt-8">
          {member.portfolio && (
            <motion.a
              href={member.portfolio.href}
              target="_blank"
              rel="noopener"
              whileTap={{ scale: 0.97 }}
              onClick={() => track("portafolio_click", { member: member.id })}
              className="group/btn relative isolate inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-ink px-5 text-[1rem] font-semibold text-paper-2 transition-colors duration-300 hover:text-ink"
            >
              <span aria-hidden className="absolute inset-0 -z-10 translate-y-full bg-mandarina transition-transform duration-500 ease-[var(--ease-calm)] group-hover/btn:translate-y-0" />
              Portafolio de {first}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" aria-hidden />
              <span className="sr-only">({member.portfolio.label}, abre en otra pestaña)</span>
            </motion.a>
          )}
          {member.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/l relative inline-flex min-h-11 items-center text-[1rem] font-semibold text-ink"
            >
              <span className="relative">
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-ink/20" />
                <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-mandarina transition-transform duration-500 ease-[var(--ease-calm)] group-hover/l:scale-x-100" />
              </span>
              <span className="sr-only"> de {member.name} (abre en otra pestaña)</span>
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
