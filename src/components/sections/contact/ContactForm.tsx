import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CarpyMark } from "../../brand/CarpyMark";
import { requestTypes, type RequestType } from "../../../data/content";
import { site, whatsappHref } from "../../../data/site";
import { cn } from "../../../lib/cn";
import { ease, layoutSpring } from "../../../lib/motion";
import { track } from "../../../lib/track";
import { REQUEST_EVENT } from "../services/Services";

interface Fields {
  name: string;
  org: string;
  email: string;
  type: RequestType["id"];
  message: string;
}
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "mail" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Escribe tu nombre.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Revisa el correo: parece incompleto.";
  if (f.message.trim().length < 15) e.message = "Cuéntanos un poco más (mínimo 15 caracteres).";
  return e;
}

function compose(f: Fields) {
  const t = requestTypes.find((r) => r.id === f.type)!;
  const subject = `${t.label}${f.org.trim() ? ` · ${f.org.trim()}` : ""}`;
  const body = [
    `Hola, soy ${f.name.trim() || "(tu nombre)"}${f.org.trim() ? ` de ${f.org.trim()}` : ""}. ${t.opener}`,
    "",
    f.message.trim() || "(tu mensaje)",
    "",
    `Mi correo: ${f.email.trim() || "(tu correo)"}`,
  ].join("\n");
  return { subject, body };
}

const input =
  "mt-2 block w-full rounded-2xl border-0 bg-paper-2 px-4 py-3 text-[1.02rem] text-ink shadow-rest ring-1 ring-ink/8 transition-[box-shadow] duration-200 placeholder:text-ink-3/70 hover:ring-ink/20 focus:outline-none focus:ring-2 focus:ring-mandarina aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-fail/60";

export function ContactForm() {
  const uid = useId();
  const [f, setF] = useState<Fields>({ name: "", org: "", email: "", type: "software", message: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const errors = validate(f);
  const { body } = compose(f);

  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (requestTypes.some((r) => r.id === id)) setF((x) => ({ ...x, type: id as RequestType["id"] }));
    };
    window.addEventListener(REQUEST_EVENT, on);
    return () => window.removeEventListener(REQUEST_EVENT, on);
  }, []);

  const set = <K extends keyof Fields>(k: K) => (v: Fields[K]) => setF((x) => ({ ...x, [k]: v }));
  const err = (k: keyof Fields) => (touched[k] ? errors[k] : undefined);
  const blur = (k: keyof Fields) => () => setTouched((t) => ({ ...t, [k]: true }));
  const touchAll = () => {
    setTouched({ name: true, email: true, message: true });
    return Object.keys(validate(f)).length === 0;
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!touchAll() || trap) return;
    const { subject, body } = compose(f);
    track("contacto_enviar", { type: f.type, channel: site.formEndpoint ? "form" : "email" });
    if (!site.formEndpoint) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("mail");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...f, subject, _subject: subject }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  function onWhatsapp() {
    if (!touchAll()) return;
    const href = whatsappHref(compose(f).body);
    if (!href) return;
    track("whatsapp_click", { location: "formulario", type: f.type });
    window.open(href, "_blank", "noopener");
  }

  const done = status === "sent" || status === "mail";

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <form noValidate onSubmit={onSubmit} className="lg:col-span-7">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="done"
              role="status"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="flex min-h-[28rem] flex-col items-start justify-center"
            >
              <motion.span initial={{ rotate: -12, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>
                <CarpyMark className="h-14 w-auto text-ink" cutout="var(--color-paper-3)" />
              </motion.span>
              <h3 className="mt-6 font-display text-[2.2rem] font-medium tracking-[-0.03em] text-ink">
                {status === "sent" ? "Recibimos tu mensaje." : "Tu correo está listo para enviar."}
              </h3>
              <p className="mt-2 max-w-[28rem] text-[1.05rem] leading-[1.65] text-ink-2">
                {status === "sent"
                  ? "Te respondemos por correo en menos de un día hábil."
                  : `Abrimos tu aplicación de correo con el mensaje escrito. Si no se abrió, escríbenos a ${site.email}.`}
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-7 inline-flex min-h-11 items-center font-semibold text-ink underline decoration-mandarina decoration-2 underline-offset-[6px]"
              >
                Volver al formulario
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <fieldset>
                <legend className="text-[1rem] font-semibold text-ink">¿Qué necesitas?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {requestTypes.map((r) => {
                    const on = f.type === r.id;
                    return (
                      <label
                        key={r.id}
                        className={cn(
                          "relative inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[0.98rem] font-semibold transition-colors duration-300 active:scale-[0.97] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mandarina",
                          on ? "text-paper-2" : "bg-paper-2/70 text-ink-2 ring-1 ring-ink/8 hover:text-ink hover:ring-ink/20",
                        )}
                      >
                        <input type="radio" name="type" value={r.id} checked={on} onChange={() => set("type")(r.id)} className="sr-only" />
                        {on && <motion.span layoutId="request-type" transition={layoutSpring} aria-hidden className="absolute inset-0 rounded-full bg-ink" />}
                        <span className="relative">{r.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field id={`${uid}-name`} label="Nombre" error={err("name")}>
                  <input
                    id={`${uid}-name`}
                    name="name"
                    autoComplete="name"
                    value={f.name}
                    onChange={(e) => set("name")(e.target.value)}
                    onBlur={blur("name")}
                    aria-invalid={Boolean(err("name"))}
                    aria-describedby={err("name") ? `${uid}-name-error` : undefined}
                    className={input}
                    required
                  />
                </Field>
                <Field id={`${uid}-org`} label="Empresa" hint="Opcional">
                  <input id={`${uid}-org`} name="organization" autoComplete="organization" value={f.org} onChange={(e) => set("org")(e.target.value)} className={input} />
                </Field>
              </div>
              <div className="mt-5">
                <Field id={`${uid}-email`} label="Correo" error={err("email")}>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={f.email}
                    onChange={(e) => set("email")(e.target.value)}
                    onBlur={blur("email")}
                    aria-invalid={Boolean(err("email"))}
                    aria-describedby={err("email") ? `${uid}-email-error` : undefined}
                    className={input}
                    required
                  />
                </Field>
              </div>
              <div className="mt-5">
                <Field id={`${uid}-message`} label="Cuéntanos en dos o tres frases" error={err("message")}>
                  <textarea
                    id={`${uid}-message`}
                    name="message"
                    rows={4}
                    value={f.message}
                    onChange={(e) => set("message")(e.target.value)}
                    onBlur={blur("message")}
                    aria-invalid={Boolean(err("message"))}
                    aria-describedby={err("message") ? `${uid}-message-error` : undefined}
                    placeholder="Ej.: llevamos los pedidos en WhatsApp y un Excel, y queremos un sistema que facture solo."
                    className={cn(input, "resize-y leading-[1.55]")}
                    required
                  />
                </Field>
              </div>

              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  No llenar
                  <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                </label>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                {whatsappHref("") && (
                  <button
                    type="button"
                    onClick={onWhatsapp}
                    className="group relative isolate inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-ink px-6 text-[1rem] font-semibold text-paper-2 shadow-raised transition-[transform,color] duration-300 hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:scale-[0.97]"
                  >
                    <span aria-hidden className="absolute inset-0 -z-10 translate-y-full bg-mandarina transition-transform duration-500 ease-[var(--ease-calm)] group-hover:translate-y-0" />
                    Enviar por WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} aria-hidden />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[1rem] font-semibold text-ink ring-1 ring-ink/20 transition-[background-color,transform] duration-200 hover:bg-ink/5 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "sending" ? "Enviando…" : "Enviar por correo"}
                </button>
              </div>
              {status === "error" && (
                <p role="alert" className="mt-4 text-[0.95rem] font-semibold text-fail">
                  No pudimos enviar el formulario. Escríbenos a {site.email} y te respondemos igual.
                </p>
              )}
              <p className="mt-5 text-[0.9rem] text-ink-3">Usamos tus datos solo para responder este mensaje.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Asi llega el mensaje. */}
      <div className="lg:col-span-5">
        <div className="rounded-[32px] bg-river p-5 shadow-float sm:p-7 lg:sticky lg:top-28">
          <div className="flex items-center gap-3 border-b border-paper/10 pb-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-paper">
              <CarpyMark className="h-5 w-auto text-ink" />
            </span>
            <span>
              <span className="block font-semibold text-paper">carpy</span>
              <span className="block text-[0.85rem] text-paper/60">Así nos llega tu mensaje</span>
            </span>
          </div>
          <motion.div
            layout
            transition={{ duration: 0.35, ease }}
            className="ml-auto mt-5 max-w-[92%] rounded-[20px] rounded-br-md bg-[#d8e5d6] px-4 py-3 text-[0.97rem] leading-[1.5] text-ink shadow-rest"
          >
            <p className="whitespace-pre-line break-words">{body}</p>
            <p className="mt-1.5 text-right text-[0.75rem] text-ink-3">ahora ✓✓</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[0.98rem] font-semibold text-ink">
        {label}
        {hint && <span className="text-[0.88rem] font-medium text-ink-3">{hint}</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-[0.9rem] font-semibold text-fail"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
