import type { Transition, Variants } from "framer-motion";

/** Curva unica del sitio: entra rapido y se asienta con calma. */
export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const softSpring: Transition = { type: "spring", stiffness: 420, damping: 30 };
export const layoutSpring: Transition = { type: "spring", stiffness: 380, damping: 34, bounce: 0 };

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease },
} as const;

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
