import { useEffect, useState, type PointerEvent } from "react";
import { useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

/** true solo con puntero fino (mouse/trackpad). En touch los efectos de puntero no corren. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setFine(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return fine;
}

/**
 * Posicion del puntero normalizada (-0.5..0.5) con resorte suave. Se usa para
 * inclinaciones y parallax por capas. Vuelve al centro al salir.
 */
export function usePointerParallax(stiffness = 120, damping = 20) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const active = fine && !reduce;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness, damping });
  const y = useSpring(py, { stiffness, damping });

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };
  return { x, y, active, handlers: { onPointerMove, onPointerLeave } };
}

/** Desplazamiento en px para una capa: las capas cercanas se mueven mas. */
export function useLayer(v: MotionValue<number>, depth: number) {
  return useTransform(v, (n) => n * depth);
}
