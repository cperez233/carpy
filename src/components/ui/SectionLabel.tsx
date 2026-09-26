import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { ease } from "../../lib/motion";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
  /** Sobre la banda oscura. */
  onDark?: boolean;
}

/** Etiqueta de seccion: texto en oracion con una rayita mandarina que se dibuja. */
export function SectionLabel({ children, className, onDark }: SectionLabelProps) {
  return (
    <p className={cn("flex items-center gap-3 text-[1rem] font-semibold", onDark ? "text-paper/85" : "text-ink/85", className)}>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="h-[3px] w-6 origin-left rounded-full bg-mandarina"
      />
      {children}
    </p>
  );
}
