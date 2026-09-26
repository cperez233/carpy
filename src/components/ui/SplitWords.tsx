import { Fragment } from "react";
import { motion } from "framer-motion";
import { ease } from "../../lib/motion";

interface SplitWordsProps {
  text: string;
  className?: string;
  delay?: number;
  /** `mount` anima al cargar (hero); `view` al entrar en pantalla. */
  trigger?: "mount" | "view";
}

/** Palabras que suben desde una mascara. El texto completo existe en el HTML. */
export function SplitWords({ text, className, delay = 0, trigger = "view" }: SplitWordsProps) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const anim = { y: "0%" };
        return (
          <Fragment key={`${w}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span
                className={`inline-block ${className ?? ""}`}
                initial={{ y: "105%" }}
                {...(trigger === "mount"
                  ? { animate: anim }
                  : { whileInView: anim, viewport: { once: true, margin: "-40px" } })}
                transition={{ duration: 0.95, delay: delay + i * 0.055, ease }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </>
  );
}
