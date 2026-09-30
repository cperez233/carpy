import { motion } from "framer-motion";
import { useI18n } from "../../i18n/context";
import { localePath, locales } from "../../i18n/locales";
import { cn } from "../../lib/cn";
import { layoutSpring } from "../../lib/motion";
import { track } from "../../lib/track";

/**
 * ES / EN. La pastilla de tinta se desliza al idioma elegido (con la mandarina
 * encima) y luego el rio cambia la pagina. Son enlaces reales a `/` y `/en`
 * para que los buscadores encuentren las dos versiones.
 */
export function LanguageToggle({ onDark = false, className, id = "lang" }: { onDark?: boolean; className?: string; id?: string }) {
  const { t, target, switchLocale } = useI18n();
  return (
    <div
      role="group"
      aria-label={t.a11y.language}
      className={cn("relative inline-flex items-center rounded-full p-1 ring-1", onDark ? "ring-paper/25" : "ring-ink/12", className)}
    >
      {locales.map((l) => {
        const on = target === l;
        return (
          <a
            key={l}
            href={localePath(l)}
            hrefLang={l}
            lang={l}
            aria-current={on ? "true" : undefined}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              if (on) return;
              track("idioma_click", { to: l });
              switchLocale(l);
            }}
            className={cn(
              "relative grid h-9 min-w-10 place-items-center rounded-full px-2.5 text-[0.8rem] font-semibold tracking-[0.06em] transition-colors duration-300 active:scale-[0.94]",
              on ? (onDark ? "text-ink" : "text-paper-2") : onDark ? "text-paper/70 hover:text-paper" : "text-ink-3 hover:text-ink",
            )}
          >
            {on && (
              <motion.span
                layoutId={`${id}-pill`}
                transition={layoutSpring}
                aria-hidden
                className={cn("absolute inset-0 rounded-full", onDark ? "bg-paper" : "bg-ink")}
              >
                {/* La mandarina viaja encima de la pastilla. */}
                <svg viewBox="0 0 20 20" className="absolute -top-2 right-0.5 h-3.5 w-3.5" aria-hidden>
                  <circle cx="10" cy="11" r="7" fill="var(--color-mandarina)" />
                  <path d="M10 4 C12 0 17 0 18 2 C15 4 12 5 10 4Z" fill="var(--color-reed)" />
                </svg>
              </motion.span>
            )}
            <span className="relative">{l.toUpperCase()}</span>
          </a>
        );
      })}
    </div>
  );
}
