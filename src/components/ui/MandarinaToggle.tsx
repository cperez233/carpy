import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

interface Props {
  open: boolean;
  size?: number;
  className?: string;
}

/**
 * Indicador de abrir/cerrar con forma de mandarina. Cerrada muestra un "+";
 * abierta, el "+" gira hasta ser una "x" y la hoja se sacude. Al pasar el
 * puntero sobre la fila (clase `group`), la fruta rueda un poco.
 */
export function MandarinaToggle({ open, size = 44, className }: Props) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-grid shrink-0 place-items-center transition-transform duration-500 ease-[var(--ease-calm)] group-hover:-rotate-12 group-active:scale-90",
        className,
      )}
    >
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full overflow-visible">
        {/* Sombra en el piso. */}
        <ellipse cx="22" cy="41" rx="12" ry="2" fill="var(--color-ink)" opacity="0.08" />
        <motion.circle
          cx="22"
          cy="24"
          r="16"
          initial={false}
          animate={{ fill: open ? "#c9651f" : "#d9772b" }}
          transition={{ duration: 0.4 }}
        />
        {/* Poros de la cascara. */}
        <g fill="#f2a866" opacity="0.55">
          <circle cx="15" cy="19" r="2.6" />
          <circle cx="29" cy="31" r="0.9" />
          <circle cx="16" cy="30" r="0.8" />
          <circle cx="28" cy="18" r="0.7" />
        </g>
        {/* Tallo y hoja. */}
        <path d="M22 8.5 l0.6 -3" stroke="#6b5234" strokeWidth="1.6" strokeLinecap="round" />
        <motion.path
          d="M22.6 6 C26 0.5 33 0 36 2.6 C31.6 5.6 27 7 22.6 6Z"
          fill="var(--color-reed)"
          style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
          initial={false}
          animate={{ rotate: open ? [0, -22, 10, 0] : 0 }}
          transition={{ duration: 0.6 }}
        />
      </svg>
      {/* El signo: + cerrado, x abierto. */}
      <motion.span
        initial={false}
        animate={{ rotate: open ? 135 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative mt-[4px] block h-3.5 w-3.5"
      >
        <span className="absolute left-1/2 top-0 h-full w-[2.4px] -translate-x-1/2 rounded-full bg-paper-2" />
        <span className="absolute left-0 top-1/2 h-[2.4px] w-full -translate-y-1/2 rounded-full bg-paper-2" />
      </motion.span>
    </span>
  );
}
