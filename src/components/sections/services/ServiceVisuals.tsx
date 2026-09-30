import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import { ease } from "../../../lib/motion";
import { useLoopInView } from "../../../lib/useLoopInView";
import { useI18n } from "../../../i18n/context";

/*
 * Demostraciones sobre negocios ficticios, dibujadas con los mismos tonos de
 * la pagina. Cada una se detiene fuera de pantalla y con reduced-motion.
 */

function Window({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="relative">
    {/* Hoja de atras que se asoma: la ventana esta encima de algo. */}
    <div aria-hidden className="absolute inset-x-5 -bottom-3 top-5 rotate-[1.6deg] rounded-[22px] bg-paper-3 shadow-rest" />
    <div className={cn("relative overflow-hidden rounded-[22px] bg-paper-2 shadow-float ring-1 ring-ink/5", className)}>
      <div className="flex items-center gap-3 border-b border-ink/8 px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        </span>
        <span className="truncate text-[0.85rem] font-semibold text-ink-3">{title}</span>
      </div>
      {children}
    </div>
    </div>
  );
}

/** Numero que entra desde abajo si sube y desde arriba si baja. */
function Rolling({ value, format }: { value: number; format?: (v: number) => string }) {
  const prev = useRef(value);
  const dir = value > prev.current ? 1 : -1;
  useEffect(() => {
    prev.current = value;
  }, [value]);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden tabular-nums">
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.span
          key={value}
          custom={dir}
          variants={{
            enter: (d: number) => ({ y: `${d * 100}%`, opacity: 0 }),
            center: { y: "0%", opacity: 1 },
            exit: (d: number) => ({ y: `${d * -100}%`, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease }}
        >
          {format ? format(value) : value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Stock inicial y minimo de cada producto; los nombres vienen del idioma. */
const stockRows = [
  { stock: 128, min: 40 },
  { stock: 42, min: 20 },
  { stock: 23, min: 20 },
  { stock: 310, min: 60 },
];

/** Software: el inventario de una ferreteria que antes vivia en Excel. */
export function SoftwareVisual() {
  const t = useI18n().t.visuals.software;
  const { ref, play } = useLoopInView<HTMLDivElement>("0px");
  const [stock, setStock] = useState(stockRows.map((r) => r.stock));
  const [flash, setFlash] = useState<number | null>(null);

  useEffect(() => {
    if (!play) return;
    let i = 0;
    const t = window.setInterval(() => {
      // Una venta cada tanto; la pintura baja hasta el minimo y se repone.
      const row = [2, 0, 2, 1][i % 4];
      i++;
      setStock((s) => s.map((v, k) => (k !== row ? v : row === 2 && v <= 18 ? 60 : v - (row === 0 ? 6 : 2))));
      setFlash(row);
    }, 2200);
    return () => window.clearInterval(t);
  }, [play]);

  return (
    <div ref={ref}>
      <Window title={t.title}>
        <div className="px-4 pb-4 pt-3 sm:px-5">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-5 border-b border-ink/8 pb-2 text-[0.8rem] font-semibold text-ink-3">
            <span>{t.product}</span>
            <span className="text-right">{t.stock}</span>
            <span className="w-16 text-right">{t.status}</span>
          </div>
          <ul>
            {stockRows.map((r, k) => {
              const low = stock[k] <= r.min;
              return (
                <li
                  key={k}
                  className={cn(
                    "grid grid-cols-[1fr_auto_auto] items-center gap-x-5 border-b border-ink/5 py-2.5 text-[0.93rem] transition-colors duration-700",
                    flash === k ? "bg-mandarina/10" : "bg-transparent",
                  )}
                >
                  <span className="truncate font-medium text-ink">{t.rows[k]}</span>
                  <span className="text-right font-semibold text-ink">
                    <Rolling value={stock[k]} />
                  </span>
                  <span className={cn("w-16 text-right text-[0.8rem] font-semibold", low ? "text-mandarina-ink" : "text-ok")}>
                    {low ? t.low : t.ok}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[0.82rem] text-ink-3">{t.footer}</p>
        </div>
      </Window>
    </div>
  );
}

/** Hora de cada evento; el texto viene del idioma. */
const flow = ["10:02", "10:02", "10:03", "10:03", "10:03"];

/** Integraciones: un pedido que se factura y se reporta solo. */
export function IntegrationVisual() {
  const t = useI18n().t.visuals.integration;
  const { ref, play, reduce } = useLoopInView<HTMLDivElement>("0px");
  const [n, setN] = useState(flow.length);
  const started = useRef(false);

  useEffect(() => {
    if (!play) return;
    if (!started.current) {
      started.current = true;
      setN(0);
    }
    const t = window.setInterval(() => setN((v) => (v >= flow.length + 2 ? 0 : v + 1)), 1100);
    return () => window.clearInterval(t);
  }, [play]);

  const shown = reduce ? flow.length : Math.min(n, flow.length);

  return (
    <div ref={ref}>
      <Window title={t.title}>
        <ol className="relative min-h-[17.5rem] px-4 py-4 sm:px-5">
          <span aria-hidden className="absolute bottom-6 left-[1.83rem] top-6 w-px bg-ink/10 sm:left-[2.08rem]" />
          <AnimatePresence initial={false}>
            {flow.slice(0, shown).map((time, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.45, ease }}
                className="relative flex items-center gap-3 py-2"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.1 }}
                  className={cn(
                    "relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                    i === flow.length - 1 || i === 2 ? "bg-ok text-paper-2" : "bg-paper-3 text-ink",
                  )}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </motion.span>
                <span className="font-mono text-[0.78rem] text-ink-3">{time}</span>
                <span className="text-[0.93rem] font-medium text-ink">{t.events[i]}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
        <p className="border-t border-ink/8 px-4 py-3 text-[0.82rem] text-ink-3 sm:px-5">{t.footer}</p>
      </Window>
    </div>
  );
}

/** Un hallazgo por area (la auditoria no es solo de seguridad): los dos primeros son de prioridad alta. */
const highPriority = [true, true, false, false];

/** Auditoria: la primera pagina del informe. */
export function AuditVisual() {
  const t = useI18n().t.visuals.audit;
  const findings = t.findings;
  const { ref, play, reduce } = useLoopInView<HTMLDivElement>("0px");
  const [n, setN] = useState(findings.length);
  const started = useRef(false);

  useEffect(() => {
    if (!play) return;
    if (!started.current) {
      started.current = true;
      setN(0);
    }
    const t = window.setInterval(() => setN((v) => (v >= findings.length + 3 ? 0 : v + 1)), 1000);
    return () => window.clearInterval(t);
  }, [play]);

  const shown = reduce ? findings.length : Math.min(n, findings.length);

  return (
    <div ref={ref} className="relative">
      {/* Hojas de atras: el informe tiene mas paginas. */}
      <div aria-hidden className="absolute inset-x-6 -bottom-3 top-6 rotate-[2deg] rounded-[18px] bg-paper-3 shadow-rest" />
      <div className="relative rounded-[18px] bg-paper-2 p-5 shadow-float ring-1 ring-ink/5 sm:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
          <div>
            <p className="text-[0.8rem] font-semibold text-ink-3">{t.eyebrow}</p>
            <p className="mt-1 font-display text-[1.35rem] font-medium leading-tight text-ink">{t.name}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-[2rem] font-medium leading-none text-mandarina-ink tabular-nums">
              {highPriority.filter((high, i) => i < shown && high).length}
            </p>
            <p className="text-[0.78rem] font-semibold text-ink-3">{t.high}</p>
          </div>
        </div>
        <ul className="mt-2 min-h-[13.5rem]">
          <AnimatePresence initial={false}>
            {findings.slice(0, shown).map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ duration: 0.45, ease }}
                className="flex items-center gap-3 border-b border-ink/5 py-2.5"
              >
                <span className={cn("w-[5.2rem] shrink-0 rounded-full py-1 text-center text-[0.74rem] font-bold", highPriority[i] ? "bg-mandarina text-ink" : "bg-paper-3 text-ink")}>{f.area}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.9rem] font-semibold text-ink">{f.title}</span>
                  <span className="block truncate text-[0.86rem] text-ink-3">{f.note}</span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <p className="mt-3 text-[0.82rem] text-ink-3">{t.footer}</p>
      </div>
    </div>
  );
}

/** Color y dibujo de cada producto; nombre y precio vienen del idioma. */
const products = [
  { tone: "#ecd6b4", art: "pan" },
  { tone: "#d9c2a4", art: "cafe" },
  { tone: "#e8d2b0", art: "galleta" },
] as const;

/** Dibujos simples de cada producto. */
function ProductArt({ art }: { art: (typeof products)[number]["art"] }) {
  if (art === "pan")
    return (
      <svg viewBox="0 0 60 40" className="w-[72%]">
        <ellipse cx="30" cy="36" rx="22" ry="3" fill="#000" opacity="0.08" />
        <path d="M6 28 C6 12 18 6 30 6 C42 6 54 12 54 28 C54 33 50 35 44 35 H16 C10 35 6 33 6 28Z" fill="#b8793f" />
        <g stroke="#e9c690" strokeWidth="2.4" strokeLinecap="round">
          <path d="M18 14 l6 10" />
          <path d="M28 12 l6 10" />
          <path d="M38 13 l6 10" />
        </g>
      </svg>
    );
  if (art === "cafe")
    return (
      <svg viewBox="0 0 40 50" className="w-[48%]">
        <ellipse cx="20" cy="47" rx="14" ry="2.4" fill="#000" opacity="0.08" />
        <path d="M8 10 H32 L34 46 H6Z" fill="#5f4330" />
        <path d="M8 10 L12 4 H28 L32 10Z" fill="#7a573e" />
        <rect x="12" y="20" width="16" height="14" rx="3" fill="#efe9dd" />
        <ellipse cx="20" cy="27" rx="3.4" ry="4.6" fill="#5f4330" />
        <path d="M20 23 q-1.6 4 0 8" stroke="#efe9dd" strokeWidth="1.1" fill="none" />
      </svg>
    );
  return (
    <svg viewBox="0 0 50 50" className="w-[62%]">
      <ellipse cx="25" cy="46" rx="17" ry="2.6" fill="#000" opacity="0.08" />
      <circle cx="25" cy="24" r="19" fill="#c99356" />
      <circle cx="25" cy="24" r="19" fill="none" stroke="#b07c42" strokeWidth="1.5" />
      <g fill="#5f4330">
        <circle cx="17" cy="17" r="2.4" />
        <circle cx="30" cy="14" r="2" />
        <circle cx="33" cy="27" r="2.6" />
        <circle cx="20" cy="31" r="2.2" />
        <circle cx="26" cy="23" r="1.6" />
      </g>
    </svg>
  );
}

/** Paginas y tiendas: una tienda pequena que recibe pedidos. */
export function WebVisual() {
  const t = useI18n().t.visuals.web;
  const { ref, play } = useLoopInView<HTMLDivElement>("0px");
  const [cart, setCart] = useState(2);
  const [added, setAdded] = useState<number | null>(null);

  useEffect(() => {
    if (!play) return;
    let i = 0;
    const t = window.setInterval(() => {
      const k = i % products.length;
      i++;
      setAdded(k);
      setCart((c) => (c >= 9 ? 1 : c + 1));
    }, 2000);
    return () => window.clearInterval(t);
  }, [play]);

  return (
    <div ref={ref}>
      <Window title={t.title}>
        <div className="px-4 pb-5 pt-4 sm:px-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[1.15rem] font-medium text-ink">{t.shop}</span>
            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-paper-3 px-3 py-1 text-[0.8rem] font-semibold text-ink">
              {t.order}
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.72rem] text-paper-2">
                <Rolling value={cart} />
              </span>
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {products.map((p, k) => (
              <div key={p.art} className="relative overflow-hidden rounded-2xl bg-paper-3/60 p-2.5">
                <div className="grid aspect-square place-items-center rounded-xl" style={{ background: p.tone }}>
                  <motion.span
                    animate={added === k ? { scale: [1, 1.14, 1], rotate: [0, -6, 0], y: [0, -4, 0] } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid h-full w-full place-items-center"
                  >
                    <ProductArt art={p.art} />
                  </motion.span>
                </div>
                <p className="mt-2 truncate text-[0.78rem] font-semibold text-ink">{t.products[k]}</p>
                <p className="text-[0.74rem] text-ink-3">{t.prices[k]}</p>
                <AnimatePresence>
                  {added === k && (
                    <motion.span
                      key={`${k}-${cart}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-2 top-2 rounded-full bg-ok px-2 py-0.5 text-[0.68rem] font-bold text-paper-2"
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-paper-2">
            <span className="text-[0.86rem] font-semibold">{t.cta}</span>
            <span className="text-[0.78rem] text-paper/60">{t.pay}</span>
          </div>
        </div>
      </Window>
    </div>
  );
}

const weeks = [
  [42, 58, 51, 66, 74, 88, 61],
  [48, 52, 63, 59, 80, 94, 70],
];

/** Datos: las ventas de la semana en un tablero que se actualiza solo. */
export function DataVisual() {
  const t = useI18n().t.visuals.data;
  const { ref, play } = useLoopInView<HTMLDivElement>("0px");
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!play) return;
    const t = window.setInterval(() => setW((v) => (v + 1) % weeks.length), 3200);
    return () => window.clearInterval(t);
  }, [play]);
  const data = weeks[w];
  const total = data.reduce((a, b) => a + b, 0);
  const money = (v: number) => (v * 10000).toLocaleString(t.numberLocale);
  const best = data.indexOf(Math.max(...data));

  return (
    <div ref={ref}>
      <Window title={t.title}>
        <div className="px-4 pb-5 pt-4 sm:px-5">
          <p className="text-[0.8rem] font-semibold text-ink-3">{t.label}</p>
          <p className="mt-1 flex items-baseline gap-2 font-display text-[2rem] font-medium leading-none text-ink">
            <span>
              $<Rolling value={total} format={money} />
            </span>
            <span className="font-sans text-[0.85rem] font-semibold text-ok">{w ? "+12%" : "+4%"}</span>
          </p>
          <div className="mt-5 flex h-40 items-end gap-2.5">
            {data.map((v, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${v}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18, delay: i * 0.05 }}
                  className={cn("w-full rounded-b-md rounded-t-xl transition-colors duration-500", i === best ? "bg-mandarina" : "bg-water")}
                />
                <span className="text-[0.74rem] font-semibold text-ink-3">{t.days[i]}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[0.82rem] text-ink-3">{t.footer}</p>
        </div>
      </Window>
    </div>
  );
}

/** Soporte: el monitor que avisa antes que los clientes. */
export function SupportVisual() {
  const t = useI18n().t.visuals.support;
  const { ref, play } = useLoopInView<HTMLDivElement>("0px");
  const [phase, setPhase] = useState(0); // 0 todo bien, 1 lenta, 2 resuelto
  useEffect(() => {
    if (!play) return;
    const t = window.setInterval(() => setPhase((p) => (p + 1) % 3), 2600);
    return () => window.clearInterval(t);
  }, [play]);
  const down = phase === 1;

  return (
    <div ref={ref} className={cn(!play && "is-paused")}>
      <Window title={t.title}>
        <div className="px-4 pb-5 pt-4 sm:px-5">
          {/* Pulso: la linea corre sola y se vuelve naranja si algo falla. */}
          <div className="relative h-16 overflow-hidden rounded-2xl bg-paper-3/60">
            <svg viewBox="0 0 480 64" className="absolute inset-y-0 left-0 h-full w-[200%]" preserveAspectRatio="none">
              <g className="anim-current" style={{ "--dur": "4s" } as CSSProperties}>
                <path
                  d="M0 34 H60 l8 -18 l10 34 l8 -16 H180 l8 -18 l10 34 l8 -16 H300 l8 -18 l10 34 l8 -16 H420 l8 -18 l10 34 l8 -16 H540 l8 -18 l10 34 l8 -16 H660"
                  fill="none"
                  stroke={down ? "var(--color-mandarina)" : "var(--color-ok)"}
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: "stroke .4s" }}
                />
              </g>
            </svg>
          </div>
          <ul className="mt-3">
            {t.checks.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-4 border-b border-ink/5 py-2.5 text-[0.9rem]">
                <span className="font-medium text-ink">{c.label}</span>
                <span className={cn("font-semibold transition-colors duration-300", i === 0 && down ? "text-mandarina-ink" : "text-ok")}>
                  {i === 0 && down ? t.slow : c.ok}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 min-h-[2.75rem]">
            <AnimatePresence mode="wait">
              {phase > 0 && (
                <motion.p
                  key={phase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease }}
                  className="rounded-xl bg-paper-3/70 px-3 py-2.5 text-[0.84rem] font-medium text-ink"
                >
                  {phase === 1 ? t.alertSlow : t.alertFixed}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Window>
    </div>
  );
}
