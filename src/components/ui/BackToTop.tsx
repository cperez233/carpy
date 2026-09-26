import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { CarpyMark } from "../brand/CarpyMark";
import { scrollToId } from "../../lib/scroll";

/**
 * El capibara flota en la esquina despues del hero. El anillo muestra cuanto
 * llevas de la pagina; al tocarlo vuelve al inicio.
 */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 900));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => scrollToId("inicio")}
          aria-label="Volver al inicio"
          initial={{ opacity: 0, y: 30, scale: 0.6 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.6 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
          className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-paper-2 text-ink shadow-float sm:bottom-7 sm:right-7"
        >
          <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
            <circle cx="28" cy="28" r="25" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2.5" />
            <motion.circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="var(--color-mandarina)"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>
          <span className="relative transition-transform duration-500 ease-[var(--ease-calm)] group-hover:-translate-y-0.5 group-hover:-rotate-6">
            <CarpyMark className="h-6 w-auto" cutout="var(--color-paper-2)" />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
