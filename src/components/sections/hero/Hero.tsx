import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CapyScene } from "../../brand/CapyScene";
import { ButtonLink } from "../../ui/ButtonLink";
import { Magnetic } from "../../ui/Magnetic";
import { SplitWords } from "../../ui/SplitWords";
import { bookingHref, bookingIsExternal, onBookingClick } from "../../../lib/booking";
import { handleAnchorClick } from "../../../lib/scroll";
import { ease } from "../../../lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Al bajar, la escena se hunde un poco mas lento que el texto.
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  // Mientras la hoja de servicios sube, el hero se aleja un poco: queda debajo.
  const sink = useTransform(scrollYProgress, [0.25, 1], [1, 0.94]);
  const dim = useTransform(scrollYProgress, [0.25, 1], [1, 0.45]);
  const sceneRotate = useTransform(scrollYProgress, [0, 1], [0, -2]);

  return (
    <section ref={ref} id="inicio" aria-labelledby="hero-title" className="relative pb-20 pt-24 sm:pb-24 sm:pt-36 lg:pb-32 lg:pt-40">
      <motion.div
        style={reduce ? undefined : { scale: sink, opacity: dim }}
        className="mx-auto max-w-[1240px] origin-top px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <h1
              id="hero-title"
              className="font-display text-[clamp(3.3rem,11vw,6.6rem)] font-medium leading-[0.94] tracking-[-0.035em] text-ink"
            >
              <span className="block">
                <SplitWords trigger="mount" text="Software" delay={0.1} />
              </span>
              <span className="block">
                <SplitWords trigger="mount" text="sin sustos." delay={0.22} />
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease }}
              className="mt-6 max-w-[30rem] text-[1.15rem] font-medium sm:mt-8 leading-[1.5] text-ink-2 sm:text-[1.3rem]"
            >
              Resolvemos lo que tu empresa necesite en software, sin afán y de buena manera, como el capibara.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.68, ease }}
              className="mt-5 hidden max-w-[30rem] text-[1.03rem] leading-[1.7] text-ink-3 sm:block"
            >
              Sistemas a medida, páginas y tiendas, integraciones con lo que ya usas, tableros de datos, auditorías y
              soporte. Para que los problemas se resuelvan con calma y no un viernes en la noche.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease }}
              className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-9"
            >
              <Magnetic>
                <ButtonLink href={bookingHref} external={bookingIsExternal} onClick={(e) => onBookingClick(e, "hero")}>
                  Cuéntanos tu proyecto
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="#servicios" variant="quiet" arrow={false} onClick={(e) => handleAnchorClick(e, "servicios")}>
                Ver qué hacemos
              </ButtonLink>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, clipPath: "inset(18% 6% 0% 6% round 36px)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 36px)", transitionEnd: { clipPath: "none" } }}
            transition={{ duration: 1.3, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="relative lg:col-span-6"
          >
            <motion.div style={reduce ? undefined : { y: sceneY, rotate: sceneRotate }}>
              <CapyScene />
              {/* Pie como tarjeta que flota sobre el borde de la escena. */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3, ease }}
                className="relative z-10 -mt-6 ml-5 inline-flex max-w-[calc(100%-2.5rem)] items-center gap-2.5 rounded-full bg-paper-2 px-4 py-2.5 text-[0.9rem] font-medium text-ink-2 shadow-raised sm:ml-8 sm:text-[0.95rem]"
              >
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-mandarina" />
                Los problemas bajan por el río. Aquí salen resueltos.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
