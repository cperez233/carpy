import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useLoopInView } from "../../lib/useLoopInView";
import { CarpyMark } from "../brand/CarpyMark";

const words = [
  "Software",
  "Páginas web",
  "Auditorías",
  "Integraciones",
  "Apps",
  "Datos",
  "Seguridad",
  "Automatización",
  "Soporte",
];

/** Orilla ondulada: periodo de 200 unidades para que el bucle a -50% no se note. */
const W = 2400;
const wave = (y: number, amp: number, dir: 1 | -1) => {
  let d = "";
  for (let x = 0; x < W; x += 200) d += ` Q${x + 50} ${y - amp * dir} ${x + 100} ${y} T${x + 200} ${y}`;
  return d;
};
/** La orilla de abajo, recorrida de derecha a izquierda para cerrar la forma. */
const waveBack = (y: number, amp: number) => {
  let d = "";
  for (let x = W; x > 0; x -= 200) d += ` Q${x - 50} ${y + amp} ${x - 100} ${y} T${x - 200} ${y}`;
  return d;
};
const band = `M0 26${wave(26, 9, 1)} L${W} 132${waveBack(132, 7)} Z`;
const bandBack = `M0 18${wave(18, 7, -1)} L${W} 140${waveBack(140, -6)} Z`;
const surface = (y: number) => `M0 ${y}${wave(y, 4, 1)}`;

/** Cosas que flotan entre las palabras: mandarina, hoja de loto o el capibara nadando. */
function Floaty({ kind, bob }: { kind: "fruit" | "pad" | "capy"; bob: number }) {
  let el: ReactNode;
  if (kind === "fruit")
    el = (
      <svg viewBox="0 0 28 28" className="h-7 w-7">
        <ellipse cx="14" cy="24" rx="11" ry="2.4" fill="#eef2ea" opacity="0.5" />
        <circle cx="14" cy="15" r="9" fill="var(--color-mandarina)" />
        <circle cx="10.5" cy="12" r="2" fill="#f2a866" opacity="0.7" />
        <path d="M14 6.5 C16 2 21 1.5 23 3.5 C20 6 17 7 14 6.5Z" fill="var(--color-reed)" />
      </svg>
    );
  else if (kind === "pad")
    el = (
      <svg viewBox="0 0 40 20" className="h-6 w-12">
        <path d="M20 10 L36 6 A16 7 0 1 1 30 3.6Z" fill="#6f8f6a" />
        <path d="M20 10 L30 4" stroke="#557351" strokeWidth="1" />
      </svg>
    );
  else
    el = (
      <span className="relative block">
        <CarpyMark className="h-8 w-auto text-fur" cutout="var(--color-water)" />
        {/* Estela */}
        <svg viewBox="0 0 40 10" className="absolute -left-9 bottom-0.5 h-3 w-10" aria-hidden>
          <path d="M40 5 Q30 1 20 5 T0 5" fill="none" stroke="#eef2ea" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </svg>
      </span>
    );
  return (
    <span className="anim-bob mx-7 inline-flex shrink-0 items-center" style={{ "--bob": `${bob}s` } as CSSProperties}>
      {el}
    </span>
  );
}

/**
 * Un rio que cruza la pagina: la orilla ondula, la superficie corre y lo que
 * construimos flota con la corriente (~55 px/s). Se pausa al pasar el puntero,
 * fuera de pantalla y con reduced-motion. Decorativo: todo se explica abajo.
 */
export function Current({ className }: { className?: string }) {
  const { ref, play } = useLoopInView<HTMLDivElement>("0px");
  const kinds = ["fruit", "pad", "fruit", "capy", "pad", "fruit", "pad", "fruit", "pad"] as const;
  return (
    <div ref={ref} aria-hidden className={cn("group relative h-36 overflow-hidden sm:h-40", !play && "is-paused", className)}>
      {/* Agua: dos orillas desfasadas que se deslizan a distinto ritmo. */}
      <svg viewBox={`0 0 ${W} 160`} preserveAspectRatio="none" className="anim-wave absolute inset-y-0 left-0 h-full w-[200%]" style={{ "--dur": "18s" } as CSSProperties}>
        <path d={bandBack} fill="#c3d2c8" />
      </svg>
      <svg viewBox={`0 0 ${W} 160`} preserveAspectRatio="none" className="anim-wave absolute inset-y-0 left-0 h-full w-[200%]" style={{ "--dur": "12s" } as CSSProperties}>
        <defs>
          <linearGradient id="rio-banda" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#a9bdb1" />
            <stop offset="1" stopColor="#8aa597" />
          </linearGradient>
        </defs>
        <path d={band} fill="url(#rio-banda)" />
        <path d={surface(60)} fill="none" stroke="#eef2ea" strokeOpacity="0.45" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d={surface(108)} fill="none" stroke="#eef2ea" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="30 90" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Lo que flota. */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
        <div className="anim-marquee flex w-max items-center group-hover:[animation-play-state:paused]" style={{ "--dur": "42s" } as CSSProperties}>
          {[0, 1, 2].map((copy) => (
            <div key={copy} className="flex items-center">
              {words.map((w, i) => (
                <span key={w} className="flex items-center">
                  <span
                    className="anim-bob inline-block whitespace-nowrap font-display text-[clamp(1.5rem,3vw,2.4rem)] font-medium tracking-[-0.02em] text-ink/75 transition-colors duration-500 hover:text-ink"
                    style={{ "--bob": `${-i * 0.7}s` } as CSSProperties}
                  >
                    {w}
                  </span>
                  <Floaty kind={kinds[i]} bob={-i * 0.9 - 0.4} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
