import { motion } from "framer-motion";
import { TeamCard } from "./TeamCard";
import { SectionLabel } from "../../ui/SectionLabel";
import { SplitWords } from "../../ui/SplitWords";
import { activeTeam } from "../../../data/team";
import { cn } from "../../../lib/cn";
import { reveal, staggerChild, staggerParent } from "../../../lib/motion";

/**
 * La grilla se adapta a cuantos socios tengan `isActive` en `data/team.ts`:
 * 1 = retrato ancho; 2 = dos columnas; 3 = tres columnas en escritorio.
 */
export function Team() {
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
            <SectionLabel>Equipo</SectionLabel>
            <h2 id="equipo-title" className="mt-5 font-display text-[clamp(2.3rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.03em] text-ink">
              <SplitWords text="Hablas con quien escribe el código." />
            </h2>
          </div>
          <motion.p {...reveal} className="max-w-[30rem] text-[1rem] leading-[1.6] text-ink-3 sm:text-[1.06rem] lg:col-span-5">
            carpy la formamos tres socios que desarrollan y auditan software. Sin intermediarios ni
            cuentas que pasan de mano en mano.
          </motion.p>
        </div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className={cn("mt-10 grid grid-cols-1 gap-10 sm:mt-16", n === 2 ? "md:grid-cols-2" : n >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "")}
        >
          {activeTeam.map((m) => (
            <TeamCard key={m.id} member={m} layout={n === 1 ? "wide" : "column"} variants={staggerChild} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
