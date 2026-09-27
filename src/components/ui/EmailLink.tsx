import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { composeLinks, mailtoHref, site } from "../../data/site";
import { useFinePointer } from "../../lib/pointer";
import { track } from "../../lib/track";
import { cn } from "../../lib/cn";

/**
 * Enlace al correo. En el celular abre la app de correo instalada (mailto).
 * En computador `mailto:` casi siempre cae en Outlook aunque nadie lo use,
 * asi que mostramos un menu: Gmail, Outlook web, app de correo o copiar.
 */
export function EmailLink({ className, location }: { className?: string; location: string }) {
  const fine = useFinePointer();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const links = composeLinks("Contacto desde carpy.tech", "");

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!fine) {
      track("email_click", { location, client: "app" });
      return;
    }
    e.preventDefault();
    setOpen((o) => !o);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      track("email_click", { location, client: "copiar" });
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1400);
    } catch {
      /* sin portapapeles: el correo sigue visible en el enlace */
    }
  }

  const item =
    "flex min-h-10 w-full items-center rounded-xl px-3 text-left text-[0.95rem] font-semibold text-ink transition-colors hover:bg-ink/6";

  return (
    <span ref={root} className="relative inline-flex">
      <a href={mailtoHref} onClick={onClick} aria-haspopup={fine ? "menu" : undefined} aria-expanded={fine ? open : undefined} className={className}>
        {site.email}
      </a>
      <AnimatePresence>
        {open && (
          <motion.span
            role="menu"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-0 z-50 mb-2 flex w-56 origin-bottom-left flex-col rounded-2xl bg-paper-2 p-1.5 shadow-float ring-1 ring-ink/10"
          >
            {(
              [
                ["gmail", "Gmail"],
                ["outlook", "Outlook"],
                ["app", "App de correo"],
              ] as const
            ).map(([k, label]) => (
              <a
                key={k}
                role="menuitem"
                href={links[k]}
                target={k === "app" ? undefined : "_blank"}
                rel={k === "app" ? undefined : "noopener"}
                onClick={() => {
                  track("email_click", { location, client: k });
                  setOpen(false);
                }}
                className={item}
              >
                {label}
              </a>
            ))}
            <button type="button" role="menuitem" onClick={copy} className={cn(item, "text-ink-2")}>
              {copied ? "Copiado ✓" : "Copiar correo"}
            </button>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
