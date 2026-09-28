import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../../lib/cn";
import { useLoopInView } from "../../lib/useLoopInView";
import { useLayer, usePointerParallax } from "../../lib/pointer";

/**
 * Los problemas bajan por el rio, pasan junto al capibara y salen resueltos.
 * Todo el movimiento es CSS: arranca con el primer pintado y se pausa fuera
 * de pantalla. Con reduced-motion se ven dos etiquetas ya resueltas.
 */
const issues = [
  { before: "Error 500 en el portal", after: "Portal en línea" },
  { before: "Factura rechazada por la DIAN", after: "Factura validada" },
  { before: "Clave de AWS en el repositorio", after: "Clave rotada" },
  { before: "Inventario en tres Excel", after: "Inventario sincronizado" },
];

const DUR = 28;

export function CapyScene({ className }: { className?: string }) {
  const { ref, play } = useLoopInView<HTMLDivElement>("0px");
  // Capas que siguen al puntero: lo lejano casi no se mueve, lo cercano si.
  const { x, y, handlers } = usePointerParallax();
  const sunX = useLayer(x, 6), sunY = useLayer(y, 4);
  const hillX = useLayer(x, 10);
  const capyX = useLayer(x, 16), capyY = useLayer(y, 6);
  const frontX = useLayer(x, 30), frontY = useLayer(y, 10);
  // Al tocar al capibara la mandarina da un salto y el ojo se abre.
  const [hops, setHops] = useState(0);
  return (
    <div
      ref={ref}
      {...handlers}
      className={cn(
        "relative isolate aspect-[520/380] w-full overflow-hidden rounded-[36px] bg-[#e4dccb] shadow-float",
        !play && "is-paused",
        className,
      )}
    >
      <svg viewBox="0 0 520 380" className="absolute inset-0 h-full w-full" role="img" aria-label="Un capibara con una mandarina en la cabeza, tranquilo en el río">
        {/* Sol de la tarde. */}
        <motion.g style={{ x: sunX, y: sunY }}>
          <circle cx="392" cy="92" r="58" fill="#ecc9a0" />
          <circle cx="392" cy="92" r="58" fill="none" stroke="#e6bb8c" strokeWidth="1" />
          {/* Pajaros lejanos. */}
          <g fill="none" stroke="#8a8270" strokeWidth="1.6" strokeLinecap="round" className="anim-birds">
            <path d="M120 70 q6 -6 12 0 q6 -6 12 0" />
            <path d="M150 58 q4 -4 8 0 q4 -4 8 0" />
          </g>
        </motion.g>
        {/* Loma lejana. */}
        <motion.path style={{ x: hillX }} d="M-20 214 C80 176 150 186 230 200 C320 214 420 172 540 188 V250 H-20Z" fill="#cfc6ae" />

        {/* Juncos de atras. */}
        <g stroke="var(--color-reed)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55">
          <path className="anim-sway" style={{ "--dur": "7s" } as CSSProperties} d="M478 262 C476 220 482 180 474 136" />
          <path className="anim-sway" style={{ "--dur": "6s", "--delay": "-2s" } as CSSProperties} d="M492 262 C494 226 500 196 508 160" />
        </g>

        {/* Capibara: el cuerpo sigue bajo el agua. */}
        <motion.g style={{ x: capyX, y: capyY }}>
        <g
          className="anim-breathe cursor-pointer"
          onClick={() => setHops((h) => h + 1)}
        >
          <path
            fill="var(--color-fur)"
            d="M58 330 C52 250 70 164 166 138 C214 125 250 112 284 104 C306 96 332 92 360 95 C396 99 422 112 434 136 C444 156 444 186 432 204 C422 222 400 232 372 238 C360 280 350 310 344 330Z"
          />
          {/* Sombra del lomo y hocico mas oscuro. */}
          <path fill="var(--color-fur-2)" opacity="0.35" d="M58 330 C54 262 70 196 120 162 C96 200 92 262 104 330Z" />
          <path fill="var(--color-fur-2)" opacity="0.55" d="M404 108 C426 116 442 136 442 166 C442 186 438 198 430 206 C418 196 410 174 406 150 C404 134 402 120 404 108Z" />
          {/* Textura de pelo. */}
          <g stroke="#b88763" strokeWidth="2.2" strokeLinecap="round" opacity="0.7">
            <path d="M150 158 l10 -6" />
            <path d="M184 150 l10 -5" />
            <path d="M166 176 l10 -6" />
            <path d="M214 140 l9 -4" />
            <path d="M244 132 l9 -4" />
          </g>
          {/* Oreja. */}
          <path className="anim-ear" fill="var(--color-fur-2)" d="M296 106 C290 90 300 80 311 86 C317 90 317 99 312 105Z" />
          {/* Ojo: casi siempre cerrado; de vez en cuando se asoma. */}
          <ellipse className="anim-peek" cx="354" cy="128" rx="5.2" ry="5.6" fill="#241a14" />
          {hops > 0 && (
            <motion.ellipse
              key={`eye-${hops}`}
              cx="354"
              cy="128"
              rx="5.2"
              ry="5.6"
              fill="#241a14"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scaleY: 0.1 }}
              animate={{ scaleY: [0.1, 1, 1, 0.1] }}
              transition={{ duration: 1.4, times: [0, 0.15, 0.8, 1] }}
            />
          )}
          <path d="M346 124 Q354 119 362 124" fill="none" stroke="var(--color-fur-2)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          {/* Fosa nasal, boca y mejilla. */}
          <ellipse cx="430" cy="146" rx="2.6" ry="4.2" fill="#2e211a" transform="rotate(12 430 146)" />
          <path d="M404 208 Q413 212 421 206" fill="none" stroke="#5e3d27" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M366 196 C380 208 394 214 406 213" fill="none" stroke="var(--color-fur-2)" strokeWidth="2" opacity="0.45" />

          {/* La mandarina. */}
          <motion.g
            key={`fruit-${hops}`}
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
            animate={hops ? { y: [0, -46, 0, -10, 0], rotate: [0, -25, 8, -4, 0] } : undefined}
            transition={{ duration: 1.1, times: [0, 0.35, 0.65, 0.82, 1], ease: "easeOut" }}
          >
            <circle cx="338" cy="78" r="17" fill="var(--color-mandarina)" />
            <ellipse cx="332" cy="72" rx="5" ry="3.4" fill="#eea45f" />
            <path d="M338 61 l1 -6" stroke="#6b5234" strokeWidth="2" strokeLinecap="round" />
            <path d="M339 58 C346 47 360 46 366 52 C358 58 348 60 339 58Z" fill="var(--color-reed)" />
          </motion.g>
        </g>
        </motion.g>

        {/* Agua: tapa el cuerpo sumergido. */}
        <rect x="0" y="236" width="520" height="144" fill="#9fb5a8" opacity="0.9" />
        <rect x="0" y="236" width="520" height="144" fill="url(#rio-fondo)" />
        <defs>
          <linearGradient id="rio-fondo" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#b7c8bd" stopOpacity="0.5" />
            <stop offset="1" stopColor="#6f8a7d" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* Reflejo de la mandarina y el sol. */}
        <ellipse cx="392" cy="272" rx="40" ry="4" fill="#ecc9a0" opacity="0.6" />
        <ellipse cx="338" cy="258" rx="12" ry="2.6" fill="var(--color-mandarina)" opacity="0.35" />

        {/* Ondas alrededor del cuerpo. */}
        <g fill="none" stroke="#eef2ea" strokeWidth="1.4" opacity="0.6">
          <ellipse className="anim-ripple" cx="246" cy="238" rx="210" ry="12" />
          <ellipse className="anim-ripple" style={{ "--delay": "-3s" } as CSSProperties} cx="246" cy="238" rx="210" ry="12" />
        </g>

        {/* Linea de corriente. */}
        <g stroke="#eef2ea" strokeWidth="2" strokeLinecap="round" opacity="0.55">
          <g className="anim-current" style={{ "--dur": "8s" } as CSSProperties}>
            {[0, 120, 240, 360, 480, 600].map((x) => (
              <path key={x} d={`M${x + 10} 300 q20 -5 40 0`} fill="none" />
            ))}
          </g>
          <g className="anim-current" style={{ "--dur": "12s" } as CSSProperties}>
            {[0, 120, 240, 360, 480, 600].map((x) => (
              <path key={x} d={`M${x + 70} 346 q24 -6 48 0`} fill="none" />
            ))}
          </g>
        </g>

        {/* Juncos de adelante. */}
        <motion.g style={{ x: frontX, y: frontY }}>
        <g stroke="#4f6a3e" strokeWidth="3.4" strokeLinecap="round" fill="none">
          <path className="anim-sway" style={{ "--dur": "5.5s", "--delay": "-1.5s" } as CSSProperties} d="M40 380 C42 330 46 290 58 246" />
          <path className="anim-sway" style={{ "--dur": "7.5s", "--delay": "-3s" } as CSSProperties} d="M12 380 C12 340 6 300 0 276" />
        </g>
        {/* Espadana: tallo y cabeza giran juntos desde la base, como una sola pieza. */}
        <g className="anim-sway" style={{ "--dur": "6.5s" } as CSSProperties}>
          <path d="M26 380 C24 320 30 270 18 214" stroke="#4f6a3e" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          <ellipse cx="18" cy="204" rx="4" ry="13" fill="#6b4d33" />
        </g>
        </motion.g>

        {/* Libelula: da vueltas perezosas sobre el agua. */}
        <motion.g
          animate={{
            x: [0, -110, -230, -320, -170, 0],
            y: [0, -10, 18, 4, 22, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <g transform="translate(470 34)">
            <g className="anim-hover">
              <ellipse cx="0" cy="0" rx="9" ry="2.2" fill="#35514a" />
              <g className="anim-flap" fill="#dfe8e2" fillOpacity="0.85" stroke="#9fb5a8" strokeWidth="0.6">
                <ellipse cx="-2" cy="-5" rx="3" ry="6" transform="rotate(-20 -2 -5)" />
                <ellipse cx="3" cy="-5" rx="3" ry="6" transform="rotate(20 3 -5)" />
              </g>
              <circle cx="-9" cy="0" r="2" fill="#35514a" />
            </g>
          </g>
        </motion.g>
      </svg>

      {/* Etiquetas que bajan por el rio. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-[64%] [mask-image:linear-gradient(to_right,transparent,#000_9%,#000_91%,transparent)]"
      >
        {issues.map((it, i) => {
          const style = {
            "--dur": `${DUR}s`,
            "--delay": `${-(DUR / issues.length) * i}s`,
            "--bob": `${-i * 0.9}s`,
            "--from": "80%",
            "--to": "-80%",
          } as CSSProperties;
          return (
            <div
              key={it.before}
              style={style}
              className={cn("drift-lane anim-drift absolute inset-x-0", i % 2 === 0 ? "top-[12%]" : "top-[52%]")}
            >
              <div className="absolute left-1/2 -translate-x-1/2">
                <div style={style} className="anim-bob">
                  <span className="relative grid whitespace-nowrap rounded-full bg-paper-2 px-2.5 py-1.5 text-[0.7rem] font-semibold text-ink shadow-raised sm:px-3.5 sm:py-2 sm:text-[0.86rem]">
                    <span style={style} className="anim-before col-start-1 row-start-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-fail" />
                      {it.before}
                    </span>
                    <span style={style} className="anim-after col-start-1 row-start-1 flex items-center gap-1.5 text-ok">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      {it.after}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Texto para lectores de pantalla y buscadores. */}
      <ul className="sr-only">
        {issues.map((it) => (
          <li key={it.before}>
            {it.before}: {it.after}.
          </li>
        ))}
      </ul>
    </div>
  );
}
