import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer } from "../../lib/pointer";
import { cn } from "../../lib/cn";

/**
 * Atrae lo que envuelve hacia el puntero (hasta ~30% de la distancia) y lo
 * suelta con resorte. Solo con mouse; en touch es un contenedor normal.
 */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.6 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.6 });

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.span ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x, y }} className={cn("inline-flex", className)}>
      {children}
    </motion.span>
  );
}
