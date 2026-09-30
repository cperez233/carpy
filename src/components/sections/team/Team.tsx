import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TeamCard } from "./TeamCard";
import { SectionLabel } from "../../ui/SectionLabel";
import { SplitWords } from "../../ui/SplitWords";
import { activeTeam } from "../../../data/team";
import { cn } from "../../../lib/cn";
import { reveal, staggerChild, staggerParent } from "../../../lib/motion";
import { useI18n } from "../../../i18n/context";

/**
 * La grilla se adapta a cuantos socios tengan `isActive` en `data/team.ts`:
 * 1 = retrato ancho; 2 = dos columnas; 3 = tres columnas en escritorio.
 */
export function Team() {
  const { t } = useI18n();
  const n = activeTeam.length;
  if (n === 0) return null;
  return (
    <section
      id="equipo"
      aria-labelledby="equipo-title"
      className="relative z-30 -mt-10 rounded-t-[40px] bg-paper pb-16 pt-14 shadow-sheet sm:rounded-t-[56px] sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel>{t.team.label}</SectionLabel>
            <h2 id="equipo-title" className="mt-5 font-display text-[clamp(2.3rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.03em] text-ink">
              <SplitWords text={t.team.title} />
            </h2>
          </div>
          <motion.p {...reveal} className="max-w-[30rem] text-[1rem] leading-[1.6] text-ink-3 sm:text-[1.06rem] lg:col-span-5">
            {t.team.intro}
          </motion.p>
        </div>

        {n === 1 ? (
          <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-10 sm:mt-16">
            <TeamCard member={activeTeam[0]} layout="wide" variants={staggerChild} seal />
          </motion.div>
        ) : (
          <Roster />
        )}
      </div>
    </section>
  );
}

/**
 * Varios socios: columnas en escritorio. En telefono, un carrusel que se
 * desliza de lado con la siguiente tarjeta asomandose, para no apilar tres
 * perfiles completos uno debajo del otro.
 */
/** Un color de hoja por persona, tomados de la escena del rio. */
const tones = ["var(--color-water)", "#ecc9a0", "#c9b89a"];

function Roster() {
  const { t } = useI18n();
  const row = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = row.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    setIndex(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };
  const go = (i: number) => {
    const el = row.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 16, behavior: "smooth" });
  };

  return (
    <div className="mt-10 sm:mt-16">
      <motion.div
        ref={row}
        onScroll={onScroll}
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-6 pr-6 pt-6 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:pt-0 lg:grid-cols-3"
      >
        {activeTeam.map((m, i) => (
          <TeamCard
            key={m.id}
            member={m}
            layout="column"
            variants={staggerChild}
            seal={i === 0}
            tone={tones[i % tones.length]}
            className="w-[84%] shrink-0 snap-start md:w-auto"
          />
        ))}
      </motion.div>
      {/* Puntos del carrusel (solo telefono). */}
      <div className="mt-2 flex items-center justify-center gap-2 md:hidden">
        {activeTeam.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => go(i)}
            aria-label={t.team.see(m.name)}
            aria-current={index === i}
            className="grid h-11 w-8 place-items-center"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-all duration-500 ease-[var(--ease-calm)]",
                index === i ? "w-6 bg-mandarina" : "w-2 bg-ink/20",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
