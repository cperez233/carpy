/**
 * hCaptcha para el formulario. Se carga solo cuando la persona empieza a
 * escribir, para no contactar a un tercero con solo visitar la pagina.
 */
interface HCaptcha {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
}
declare global {
  interface Window {
    hcaptcha?: HCaptcha;
    carpyHcaptchaReady?: () => void;
  }
}

let loading: Promise<HCaptcha> | null = null;

export function loadHcaptcha(hl: string): Promise<HCaptcha> {
  if (typeof window === "undefined") return Promise.reject(new Error("sin ventana"));
  if (window.hcaptcha) return Promise.resolve(window.hcaptcha);
  loading ??= new Promise<HCaptcha>((resolve, reject) => {
    const s = document.createElement("script");
    window.carpyHcaptchaReady = () => (window.hcaptcha ? resolve(window.hcaptcha) : reject(new Error("hcaptcha no disponible")));
    s.src = `https://js.hcaptcha.com/1/api.js?render=explicit&onload=carpyHcaptchaReady&hl=${encodeURIComponent(hl)}`;
    s.async = true;
    s.onerror = () => {
      loading = null;
      reject(new Error("no se pudo cargar hcaptcha"));
    };
    document.head.appendChild(s);
  });
  return loading;
}
