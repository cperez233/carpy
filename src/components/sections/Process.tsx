import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { CarpyMark } from "../brand/CarpyMark";
import { SectionLabel } from "../ui/SectionLabel";
import { Fireflies } from "../ui/Fireflies";
import { SplitWords } from "../ui/SplitWords";
import { useI18n } from "../../i18n/context";
import { ease, staggerChild, staggerParent } from "../../lib/motion";

/** Una palabra que se aclara mientras el bloque cruza la pantalla. */
function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start, Math.min(1, start + 1.5 / total)], [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}
    </motion.span>
  );
}

function Statement() {
  const statement = useI18n().t.process.statement;
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = statement.split(" ");
  return (
    <p
      ref={ref}
      className="max-w-[62rem] font-display text-[clamp(1.9rem,4.4vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.025em] text-paper"
    >
      {words.map((w, i) => (
        <span key={i}>
          {reduce ? w : <Word word={w} i={i} total={words.length} progress={scrollYProgress} />}
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}

interface RiverProps {
  d: string;
  width: number;
  height: number;
  progress: MotionValue<number>;
  className?: string;
  /** Eje en el que avanza el rio: el color se revela hasta la posicion del capibara. */
  axis: "x" | "y";
}

/**
 * El rio se dibuja con el scroll y el capibara nada por el. La posicion sale
 * de getPointAtLength sobre el mismo trazo.
 */
function River({ d, width, height, progress, className, axis }: RiverProps) {
  const path = useRef<SVGPathElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const left = useTransform(x, (v) => `${(v / width) * 100}%`);
  const top = useTransform(y, (v) => `${(v / height) * 100}%`);
  // Recorte, no escala ni dasharray: el trazo conserva su grosor.
  const clipX = useTransform(x, (v) => `inset(-20px ${100 - (v / width) * 100}% -20px -20px)`);
  const clipY = useTransform(y, (v) => `inset(-20px -20px ${100 - (v / height) * 100}% -20px)`);

  const place = (p: number) => {
    const el = path.current;
    if (!el) return;
    const pt = el.getPointAtLength(Math.max(0, Math.min(1, p)) * el.getTotalLength());
    x.set(pt.x);
    y.set(pt.y);
  };
  useEffect(() => {
    place(progress.get());
    setReady(true);
  }, []);
  useMotionValueEvent(progress, "change", place);

  return (
    <div className={className} aria-hidden>
      <div className="relative h-full w-full">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <path ref={path} d={d} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <motion.div style={{ clipPath: axis === "x" ? clipX : clipY }} className="absolute inset-0">
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <path d={d} fill="none" stroke="var(--color-water)" strokeWidth="10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.div>
        <motion.span
          style={{ left, top, opacity: ready ? 1 : 0 }}
          className="absolute -translate-x-1/2 -translate-y-[70%] text-paper"
        >
          <span className="block rounded-full bg-river p-1.5">
            <CarpyMark className="h-8 w-auto" cutout="var(--color-river)" />
          </span>
        </motion.span>
      </div>
    </div>
  );
}

export function Process() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const progress = reduce ? scrollYProgress : smooth;
  // Cuantos pasos alcanzo el capibara: solo re-renderiza cuando cambia.
  const [reached, setReached] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setReached(Math.max(0, Math.min(4, Math.floor(v * 4 + 0.98)))));

  return (
    <section
      id="proceso"
      aria-labelledby="proceso-title"
      className="relative z-20 -mt-10 rounded-t-[40px] bg-river pb-20 pt-16 text-paper sm:pb-28 sm:pt-24 shadow-sheet sm:rounded-t-[56px] lg:pb-36 lg:pt-32"
    >
      <Fireflies className="rounded-t-[40px] sm:rounded-t-[56px]" />
      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <SectionLabel onDark>{t.process.forWhom}</SectionLabel>
        <div className="mt-5 sm:mt-6">
          <Statement />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-28 sm:gap-6 lg:mt-36 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel onDark>{t.process.label}</SectionLabel>
            <h2 id="proceso-title" className="mt-5 font-display text-[clamp(2.3rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.03em]">
              <SplitWords text={t.process.title} />
            </h2>
          </div>
          <p className="max-w-[28rem] text-[1rem] leading-[1.6] text-paper/70 sm:text-[1.06rem] lg:col-span-5">
            {t.process.intro}
          </p>
        </div>

        <div ref={ref} className="relative mt-8 sm:mt-16">
          {/* Escritorio: rio horizontal con los pasos debajo. */}
          <River
            className="hidden h-[120px] text-paper lg:block"
            d="M20 60 C140 10 240 110 375 60 S620 10 750 60 S900 110 980 60"
            width={1000}
            height={120}
            axis="x"
            progress={progress}
          />
          {/* Telefono: el caminito del rio a la izquierda, con el capibara nadando. */}
          <River
            className="absolute bottom-4 left-0 top-1 w-10 text-paper lg:hidden"
            d="M20 0 C40 120 0 200 20 330 S40 540 20 660 S0 880 20 1000"
            width={40}
            height={1000}
            axis="y"
            progress={progress}
          />

          <ol className="grid grid-cols-1 gap-7 pl-14 lg:mt-8 lg:grid-cols-4 lg:gap-8 lg:pl-0">
            {t.process.steps.map((s, i) => {
              const on = reduce || i < reached;
              return (
                <li key={i} className="relative">
                  <motion.span
                    animate={{ scale: on ? 1 : 0.6, backgroundColor: on ? "#d9772b" : "rgba(239,233,221,0.18)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    aria-hidden
                    className="mb-2 block h-3 w-3 rounded-full lg:mb-4"
                  />
                  <p className="text-[0.9rem] font-semibold text-paper/60 sm:text-[0.95rem]">{t.process.step(i + 1)}</p>
                  <h3 className="mt-1 font-display text-[1.5rem] font-medium sm:text-[1.7rem] tracking-[-0.02em] text-paper">{s.title}</h3>
                  <p className="mt-1 max-w-[18rem] text-[0.97rem] leading-[1.5] text-paper/70 sm:mt-2 sm:text-[1rem] sm:leading-[1.55]">{s.body}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 border-t border-paper/15 pt-8 sm:mt-24 sm:gap-8 sm:pt-10 lg:grid-cols-12">
          <h3 className="font-display text-[1.5rem] font-medium tracking-[-0.02em] sm:text-[1.7rem] lg:col-span-4">{t.process.promisesTitle}</h3>
          <motion.ul
            variants={staggerParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-8"
          >
            {t.process.promises.map((p, i) => (
              <motion.li key={i} variants={staggerChild} className="flex gap-3 border-b border-paper/10 py-3 text-[0.98rem] leading-[1.5] text-paper/85 sm:py-4 sm:text-[1.03rem]">
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3, ease }}
                  className="mt-[0.7em] h-[3px] w-4 shrink-0 origin-left rounded-full bg-mandarina"
                />
                {p}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
