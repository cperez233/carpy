import type { ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { usePointerParallax } from "../../lib/pointer";
import { cn } from "../../lib/cn";

/**
 * Inclina lo que envuelve unos grados hacia el puntero, como una hoja que se
 * levanta de la mesa. Solo con mouse; en touch se queda quieto.
 */
export function Tilt({ children, max = 5, className }: { children: ReactNode; max?: number; className?: string }) {
  const { x, y, active, handlers } = usePointerParallax(150, 18);
  const rotateY = useTransform(x, (v) => v * max * 2);
  const rotateX = useTransform(y, (v) => -v * max * 2);
  return (
    <div {...handlers} className={cn("[perspective:1200px]", className)}>
      <motion.div style={active ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}>{children}</motion.div>
    </div>
  );
}
