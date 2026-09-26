import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";
import { useLoopInView } from "../../lib/useLoopInView";

/** Posiciones fijas (sin Math.random): mismo HTML en servidor y cliente. */
const flies = [
  { l: 8, t: 18, d: 11, s: 0 },
  { l: 22, t: 62, d: 14, s: -4 },
  { l: 41, t: 34, d: 12, s: -7 },
  { l: 57, t: 78, d: 15, s: -2 },
  { l: 73, t: 22, d: 13, s: -9 },
  { l: 86, t: 55, d: 16, s: -5 },
  { l: 94, t: 12, d: 12, s: -11 },
];

/** Luciernagas sobre el rio de noche: pocas, lentas y tenues. */
export function Fireflies({ className }: { className?: string }) {
  const { ref, play } = useLoopInView<HTMLDivElement>("0px");
  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", !play && "is-paused", className)}>
      {flies.map((f, i) => (
        <span
          key={i}
          className="anim-firefly absolute h-1.5 w-1.5 rounded-full bg-[#f3d9a6]"
          style={{ left: `${f.l}%`, top: `${f.t}%`, "--dur": `${f.d}s`, "--delay": `${f.s}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}
