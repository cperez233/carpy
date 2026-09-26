import { useState } from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "../ui/SectionLabel";
import { MandarinaToggle } from "../ui/MandarinaToggle";
import { SplitWords } from "../ui/SplitWords";
import { faqs, type Faq as FaqItem } from "../../data/content";
import { whatsappHref } from "../../data/site";
import { cn } from "../../lib/cn";
import { ease, staggerChild, staggerParent } from "../../lib/motion";
import { track } from "../../lib/track";

function Item({ f, i, open, onToggle }: { f: FaqItem; i: number; open: boolean; onToggle: () => void }) {
  const id = `faq-${i}`;
  return (
    <motion.li variants={staggerChild} className="relative border-t border-ink/12 last:border-b">
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleY: open ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
        className="absolute -left-4 top-6 bottom-6 w-[3px] origin-top rounded-full bg-mandarina sm:-left-6"
      />
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          id={`${id}-q`}
          className="group flex min-h-[4.5rem] w-full items-center justify-between gap-6 py-5 text-left"
        >
          <span
            className={cn(
              "text-[1.15rem] font-semibold leading-[1.35] transition-colors duration-300 sm:text-[1.25rem]",
              open ? "text-mandarina-ink" : "text-ink group-hover:text-ink-2",
            )}
          >
            {f.q}
          </span>
          <MandarinaToggle open={open} size={42} />
        </button>
      </h3>
      <motion.div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
        className="overflow-hidden"
      >
        <p className="max-w-[42rem] pb-6 pr-12 text-[1.03rem] leading-[1.7] text-ink-2">{f.a}</p>
      </motion.div>
    </motion.li>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const wa = whatsappHref("Hola, tengo una pregunta para carpy.");
  return (
    <section id="preguntas" aria-labelledby="preguntas-title" className="relative bg-paper py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionLabel>Preguntas</SectionLabel>
            <h2 id="preguntas-title" className="mt-5 font-display text-[clamp(2.3rem,5vw,3.6rem)] font-medium leading-[1] tracking-[-0.03em] text-ink">
              <SplitWords text="Antes de escribirnos" />
            </h2>
            {wa && (
              <p className="mt-6 hidden max-w-[22rem] text-[1.03rem] leading-[1.6] text-ink-3 lg:block">
                ¿No está tu pregunta?{" "}
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("whatsapp_click", { location: "faq" })}
                  className="font-semibold text-ink underline decoration-mandarina decoration-2 underline-offset-4"
                >
                  Pregúntanos por WhatsApp
                </a>
                .
              </p>
            )}
          </div>
        </div>

        <motion.ul
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="lg:col-span-8"
        >
          {faqs.map((f, i) => (
            <Item key={f.q} f={f} i={i} open={open === i} onToggle={() => setOpen((v) => (v === i ? null : i))} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
