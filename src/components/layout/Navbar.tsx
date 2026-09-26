import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { CarpyMark, Logo } from "../brand/CarpyMark";
import { Magnetic } from "../ui/Magnetic";
import { navItems } from "../../data/content";
import { mailtoHref, site, whatsappHref } from "../../data/site";
import { handleAnchorClick, scrollToId } from "../../lib/scroll";
import { bookingHref, bookingIsExternal, onBookingClick } from "../../lib/booking";
import { cn } from "../../lib/cn";
import { ease, layoutSpring } from "../../lib/motion";

/**
 * Barra partida. Arriba es transparente; al bajar se vuelve una tira de papel
 * flotante y se esconde mientras lees hacia abajo; reaparece al subir.
 */
export function Navbar() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCompact(v > 40);
    if (Math.abs(v - prev) > 4) setHidden(v > 520 && v > prev);
  });

  useEffect(() => {
    const ids = [...navItems.map((n) => n.id), "contacto"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const top = document.getElementById("inicio");
    const ioTop = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), {
      rootMargin: "0px 0px -60% 0px",
    });
    if (top) ioTop.observe(top);
    return () => {
      io.disconnect();
      ioTop.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    menuButton.current?.focus();
  }

  function goFromMenu(e: MouseEvent<HTMLAnchorElement>, id: string) {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToId(id, id === "contacto"), 380);
  }

  const wa = whatsappHref("Hola, quiero hablar con carpy sobre un proyecto.");

  return (
    <>
      <a
        href="#contenido"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-2 font-semibold text-paper focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: hidden && !open ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.55, ease }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1240px] items-center justify-between gap-4 rounded-full px-3 transition-[background-color,box-shadow,height,padding] duration-500 ease-[var(--ease-calm)] sm:px-5",
            compact ? "h-14 bg-paper-2/90 shadow-raised backdrop-blur-md" : "h-16 bg-transparent sm:h-[4.5rem]",
          )}
        >
          <a
            href="/"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey) return;
              e.preventDefault();
              scrollToId("inicio");
            }}
            className="group rounded-full px-1 py-2 text-ink"
            aria-label="carpy, volver al inicio"
          >
            <Logo cutout={compact ? "var(--color-paper-2)" : "var(--color-paper)"} />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleAnchorClick(e, item.id)}
                    aria-current={active === item.id ? "location" : undefined}
                    className={cn(
                      "group relative block px-3.5 py-2 text-[0.98rem] font-semibold transition-colors duration-200",
                      active === item.id ? "text-ink" : "text-ink-3 hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-3.5 bottom-1.5 h-[1.5px] origin-right scale-x-0 bg-ink/30 transition-transform duration-500 ease-[var(--ease-calm)] group-hover:origin-left group-hover:scale-x-100"
                    />
                    {active === item.id && (
                      <motion.span
                        layoutId="nav-marker"
                        transition={layoutSpring}
                        aria-hidden
                        className="absolute bottom-0.5 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-mandarina"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.2}>
            <a
              href={bookingHref}
              onClick={(e) => onBookingClick(e, "nav")}
              target={bookingIsExternal ? "_blank" : undefined}
              rel={bookingIsExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "group relative isolate inline-flex min-h-11 items-center overflow-hidden rounded-full px-5 text-[0.95rem] font-semibold transition-[transform,color] duration-300 active:scale-[0.96]",
                active === "contacto" ? "bg-mandarina text-ink" : "bg-ink text-paper-2 hover:text-ink",
              )}
            >
              <span aria-hidden className="absolute inset-0 -z-10 translate-y-full bg-mandarina transition-transform duration-500 ease-[var(--ease-calm)] group-hover:translate-y-0" />
              Escríbenos
            </a>
            </Magnetic>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-movil"
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-ink/5 active:scale-[0.96] lg:hidden"
            >
              <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                <span className="h-[2px] w-full rounded-full bg-current" />
                <span className="h-[2px] w-3/5 rounded-full bg-current" />
              </span>
              Menú
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-river text-paper lg:hidden"
          >
            <div className="flex h-[4.75rem] items-center justify-between px-6">
              <span className="inline-flex items-center gap-2.5">
                <CarpyMark className="h-7 w-auto text-paper" cutout="var(--color-river)" />
                <span className="font-display text-[1.55rem] font-semibold tracking-[-0.03em]">carpy</span>
              </span>
              <button
                type="button"
                onClick={closeMenu}
                className="min-h-11 rounded-full px-4 font-semibold text-paper ring-1 ring-paper/25 transition-colors hover:bg-paper/10 active:scale-[0.96]"
              >
                Cerrar
              </button>
            </div>
            <nav aria-label="Menú móvil" className="flex flex-1 flex-col justify-center px-6 sm:px-10">
              <ul>
                {[...navItems, { id: "contacto", label: "Escríbenos" }].map((item, i) => (
                  <li key={item.id} className="overflow-hidden">
                    <motion.a
                      ref={i === 0 ? firstLink : undefined}
                      href={`#${item.id}`}
                      onClick={(e) => goFromMenu(e, item.id)}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease }}
                      className={cn(
                        "block py-1.5 font-display text-[clamp(2.4rem,11vw,3.6rem)] font-medium leading-[1.08] tracking-[-0.03em] transition-colors active:text-mandarina",
                        item.id === "contacto" ? "text-mandarina" : "text-paper",
                      )}
                    >
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="border-t border-paper/15 px-6 py-6 text-[1rem] text-paper/70 sm:px-10"
            >
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <a href={mailtoHref} className="inline-flex min-h-11 items-center font-semibold text-paper">
                  {site.email}
                </a>
                {wa && (
                  <a href={wa} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center font-semibold text-paper">
                    WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
