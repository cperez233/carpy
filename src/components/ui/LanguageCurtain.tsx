import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { CarpyMark } from "../brand/CarpyMark";
import { dicts, type Locale } from "../../i18n/locales";
import { ease } from "../../lib/motion";

/** Orilla ondulada con periodo de 200 unidades: el bucle a -50% no se nota. */
const W = 2400;
function shore(y: number, amp: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x < W; x += 200) d += ` Q${x + 50} ${y - amp} ${x + 100} ${y} T${x + 200} ${y}`;
  return `${d} L${W} 80 L0 80 Z`;
}
const front = shore(46, 14);
const back = shore(30, 12);

/** Borde de agua: dos orillas que corren a distinto ritmo. `flip` la pone boca abajo. */
function Shore({ flip }: { flip?: boolean }) {
  return (
    <div aria-hidden className={flip ? "absolute inset-x-0 top-full h-16 -scale-y-100 overflow-hidden" : "absolute inset-x-0 bottom-full h-16 overflow-hidden"}>
      <svg viewBox={`0 0 ${W} 80`} preserveAspectRatio="none" className="anim-wave absolute inset-y-0 left-0 h-full w-[200%]" style={{ "--dur": "5s" } as CSSProperties}>
        <path d={back} fill="var(--color-river-2)" />
      </svg>
      <svg viewBox={`0 0 ${W} 80`} preserveAspectRatio="none" className="anim-wave absolute inset-y-0 left-0 h-full w-[200%]" style={{ "--dur": "3.2s" } as CSSProperties}>
        <path d={front} fill="var(--color-river)" />
      </svg>
    </div>
  );
}

const curve = [0.76, 0, 0.24, 1] as const;

interface Props {
  to: Locale;
  /** true cuando la pagina ya cambio de idioma debajo del agua. */
  covered: boolean;
  onCovered: () => void;
  onDone: () => void;
}

/**
 * Transicion de idioma: el rio sube desde abajo con el capibara nadando y el
 * nombre del idioma nuevo; debajo se cambian los textos y el agua sigue
 * subiendo hasta salir por arriba.
 */
export function LanguageCurtain({ to, covered, onCovered, onDone }: Props) {
  const [leaving, setLeaving] = useState(false);

  // Un respiro para que React pinte el idioma nuevo antes de destapar.
  useEffect(() => {
    if (!covered) return;
    const id = window.setTimeout(() => setLeaving(true), 280);
    return () => window.clearTimeout(id);
  }, [covered]);

  return (
    <motion.div
      aria-hidden
      initial={{ y: "112%" }}
      animate={{ y: leaving ? "-112%" : "0%" }}
      transition={{ duration: leaving ? 0.8 : 0.62, ease: curve }}
      onAnimationComplete={() => {
        if (leaving) onDone();
        else window.setTimeout(onCovered, 160);
      }}
      className="fixed inset-0 z-[90] cursor-wait bg-river text-paper"
    >
      <Shore />
      <Shore flip />
      <div className="absolute inset-0 grid place-items-center overflow-hidden px-6">
        <div className="flex flex-col items-center">
          {/* El capibara llega nadando con su estela. */}
          <motion.div
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.9, ease }}
            className="relative"
          >
            <span className="anim-bob block">
              <CarpyMark className="carpy-alive h-14 w-auto sm:h-16" cutout="var(--color-river)" />
            </span>
            <svg viewBox="0 0 60 12" className="absolute -left-14 bottom-1 h-3 w-14 opacity-50" aria-hidden>
              <path d="M60 6 Q45 1 30 6 T0 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 120 10" className="absolute -bottom-3 left-1/2 w-28 -translate-x-1/2 opacity-30" aria-hidden>
              <ellipse className="anim-ripple" cx="60" cy="5" rx="56" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </motion.div>

          <span className="mt-8 block overflow-hidden pb-[0.12em]">
            <motion.span
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.3, duration: 0.75, ease }}
              className="block font-display text-[clamp(2.4rem,8vw,4.4rem)] font-medium leading-none tracking-[-0.035em]"
            >
              {dicts[to].langName}
            </motion.span>
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-4 block h-[3px] w-10 origin-left rounded-full bg-mandarina"
          />
        </div>
      </div>
    </motion.div>
  );
}
