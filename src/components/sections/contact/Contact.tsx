import { motion } from "framer-motion";
import { ContactForm } from "./ContactForm";
import { SectionLabel } from "../../ui/SectionLabel";
import { SplitWords } from "../../ui/SplitWords";
import { whatsappHref } from "../../../data/site";
import { EmailLink } from "../../ui/EmailLink";
import { reveal } from "../../../lib/motion";
import { track } from "../../../lib/track";

export function Contact() {
  const wa = whatsappHref("Hola, quiero hablar con carpy sobre un proyecto.");
  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="relative z-10 -mt-10 rounded-[40px] bg-paper-3 pb-14 pt-14 shadow-[var(--shadow-sheet),0_40px_60px_-30px_rgb(20_28_24/0.55)] sm:rounded-[56px] sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel>Contacto</SectionLabel>
            <h2 id="contacto-title" className="mt-5 font-display text-[clamp(2.5rem,6vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.035em] text-ink">
              <SplitWords text="Cuéntanos qué necesitas." />
            </h2>
          </div>
          <motion.div {...reveal} className="space-y-1 text-[1.03rem] text-ink-3 lg:col-span-5 lg:justify-self-end lg:text-right">
            <p>
              Escríbenos a{" "}
              <EmailLink
                location="contacto"
                className="font-semibold text-ink underline decoration-ink/20 decoration-2 underline-offset-4 transition-colors hover:decoration-mandarina"
              />
            </p>
            {wa && (
              <p>
                o por{" "}
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("whatsapp_click", { location: "contacto" })}
                  className="font-semibold text-ink underline decoration-ink/20 decoration-2 underline-offset-4 transition-colors hover:decoration-mandarina"
                >
                  WhatsApp
                </a>
                . Respondemos en menos de un día hábil.
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 sm:mt-14"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
